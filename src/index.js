var example_github_dir = 'https://raw.githubusercontent.com/g2glab/g2g/master/examples/';

var waiting_logos = [
  '/img/g2g_noisy.png',
  '/img/g2g_sliding.png',
  '/img/g2g_turning.png',
  '/img/g2g_zooming.png',
  '/img/g2g_fading.png'
];

function list_examples(callback) {
  $.getJSON(example_github_dir + "examples.json", function (data) {
    for (var i = 0; i < data.length; i++) {
      var example_title = data[i].val;
      var example_description = data[i].text;
      var example_text = example_title + ' -- ' + example_description;
      $('#examples').append($('<option>')
        .val(example_title)
        .text(example_text));
      callback();
    }
  });
}

function load_example() {
  loader('start');

  var $val = $('#examples').val();
  var example_ttl = $val + '/' + $val + '.ttl';
  var example_g2g = $val + '/' + $val + '.g2g';

  var loadCount = 2; // number of resources to load
  function load_resource(example, target) {
    $.get(example_github_dir + example, function (data) {
      target.val(data);
      // decrease the number of resources to load
      loadCount--;
      if (loadCount == 0) loader('stop'); // stop loader when last resource is loaded
    });
  }

  load_resource(example_ttl, $("#rdf"));
  load_resource(example_g2g, $("#g2g"));
};


// start / stop the loading animation
function loader(operation) {
  // when we are not starting, we are stopping
  if (operation != 'start') {
    $('img#logo').attr('src', './img/g2g_static.png');
    return;
  }

  // choose a random logo, then display it
  var random = Math.floor(Math.random() * waiting_logos.length)
  var logo = waiting_logos[random];
  $('img#logo').attr('src', logo);
}

/**
 * Sends the request to the g2g endpoint
 * @param {Object} options 
 * 
 */
function send_request(options) {
  // get mode and output format
  var format = options.format;

  // assemble body from subset of options
  var body = {
    g2g: options.g2g,
    mode: options.mode,
    rdf: options.rdf,
    endpoint: options.endpoint
  };

  // clear output div
  document.querySelector('#output').innerHTML = '';

  // start loader
  loader('start');

  // fetch from server
  fetch('/g2g', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(function (resp) {
    if (resp.status == 200) return resp.json();

    loader('stop');
    display_error('Could not process request!', resp.status + ' - ' + resp.statusText);
    throw new Error('Error processing request!');
  }).then(function (json) {
    var out_dir = json.g2g_output_dir;

    render_response(out_dir, format).finally(function () {
      // stop the loader after the rendering completes (doesn't matter if successfully or not)
      loader('stop');
    });
  })
}

/**
 * Display a dismissable error message inside the html container with id 'alert-container'
 * @param {String} title the title of the error
 * @param {Strin} message the error message (optional)
 */
function display_error(title, message) {
  var alert = document.createElement('div');
  alert.setAttribute('class', 'alert alert-danger alert-dismissible fade show');
  alert.setAttribute('role', 'alert');

  alert.innerHTML = '<strong>' + title + '</strong> ' + (message || '') + '\
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
    <span aria-hidden="true">&times;</span>\
  </button>';

  document.querySelector('#alert-container').appendChild(alert);
}

/**
 * Gets the required resources from the server and displays them in the output section
 * @param {Strning} out_dir the path to where the output files are
 * @param {String} format the desired output format. One of (pg|pgx|neo|dot|aws|all)
 * @returns {Promise} a promise that resolves when all resources finished loading
 */
function render_response(out_dir, format) {
  if (format == 'all') {
    return Promise.all([
      render_response(out_dir, 'pg'),
      render_response(out_dir, 'pgx'),
      render_response(out_dir, 'neo'),
      render_response(out_dir, 'dot'),
      render_response(out_dir, 'aws')
    ]);
  }

  var outputNode = document.querySelector('#output');

  switch (format) {
    case 'pg':
    case 'dot':
      return fetch_resource(out_dir + '/tmp.' + format).then(function (content) {
        outputNode.appendChild(output_view[format]({ content: content, image: out_dir + '/tmp.png' }));
      });
    case 'neo':
    case 'pgx':
    case 'aws':
      return Promise.all([
        fetch_resource(out_dir + '/' + format + '/tmp.' + format + '.nodes'),
        fetch_resource(out_dir + '/' + format + '/tmp.' + format + '.edges'),
      ]).then(function (contents) {
        var nodes = contents[0];
        var edges = contents[1];

        outputNode.appendChild(output_view[format]({ nodes: nodes, edges: edges }));
      })
  }
}

/**
 * Fetches a (text) resource from the server and returns the content. Also renders an error 
 * on request failure using @see display_error
 * @param {String} resource url of the text resource to fetch
 */
function fetch_resource(resource) {
  return fetch(resource).then(function (r) {
    if (r.status == 200) return r.text();
    display_error('Error loading resource ' + resource, 'Could not get the desired resource from the server! ' + r.textStatus)
    throw new Error('Could not load resource ' + resource);
  })
}


// on document ready:
$(function () {
  // Local File Mode as default
  $(".endpoint").hide();

  // load example list, then load the first example from that list
  list_examples(function () {
    load_example();
  });
  // load the new example once it's chosen in the dropdown
  $('#examples').change(function () {
    load_example();
  });

  // handle switching of endpoint mode
  document.querySelector('input#mode_switch').addEventListener('change', function (e) {
    if (e.target.checked) {
      $(".rdf").hide();
      $(".endpoint").show();
    } else {
      $(".rdf").show();
      $(".endpoint").hide();
    };
  });

  //Submit
  document.querySelector('form#input-form').addEventListener('submit', function (e) {
    // prevent form from being sent
    e.preventDefault();

    send_request({
      format: document.querySelector('input[type="radio"][name="output"]:checked').value,
      g2g: document.querySelector("#g2g").value,
      mode: document.querySelector("input#mode_switch:checked") ? 'endpoint' : 'rdf',
      rdf: document.querySelector("#rdf").value,
      endpoint: document.querySelector("#endpoint").value
    })
  });

  //Enable writing tabs in textareas
  $('textarea').on('keydown', function (e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      var elem = e.target;
      var val = elem.value;
      var pos = elem.selectionStart;
      elem.value = val.substr(0, pos) + '\t' + val.substr(pos, val.length);
      elem.setSelectionRange(pos + 1, pos + 1);
    }
  });
});
