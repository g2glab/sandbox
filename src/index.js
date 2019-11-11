var example_github_dir = 'https://raw.githubusercontent.com/g2glab/g2g/master/examples/';

var waiting_logos = [
  '/img/g2g_noisy.png',
  '/img/g2g_sliding.png',
  '/img/g2g_turning.png',
  '/img/g2g_zooming.png',
  '/img/g2g_fading.png'
];

function clear_output () {
  $('#pg').val('');
  $('#dot').val('');
  $('#neo_n').val('');
  $('#neo_e').val('');
  $('#pgx_n').val('');
  $('#pgx_e').val('');
  $('#aws_n').val('');
  $('#aws_e').val('');
  $('img#vis').attr('src', '');
}

function list_examples (callback) {
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

function load_example () {
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


// on document ready:
$(function () {
  //Hide output textarea until submit 
  $(".output").hide();

  // Local File Mode as default
  $(".endpoint").hide();

  // load example list, then load the first example from that list
  list_examples(function () {
    load_example();
  });
  // load the new example once it's chosen in the dropdown
  $('#examples').change(function () {
    clear_output();
    load_example();
  });
  
  // handle switching of endpoint mode
  $('input#mode_switch').change(function (e) {
      if ($(e.target).is(":checked")){
        $(".rdf").hide();
        $(".endpoint").show();
      } else {
        $(".rdf").show();
        $(".endpoint").hide();
      }; 
    });

  //Submit
  $('form#input-form').on('submit', function (e) {
    // prevent form from being sent
    e.preventDefault();

    clear_output();
    loader('start');
    $.ajax({
      url: location.protocol + "/g2g/",
      type: "POST",
      dataType: "json",
      data: {
        g2g: $("#g2g").val(),
        mode: $("input[name=mode]:checked").val(),
        rdf: $("#rdf").val(),
        endpoint: $("#endpoint").val()
      },
    }).done(function (res) {
      $(".output").show();
      $.get(res.g2g_output_dir + '/tmp.pg', function (data) {
        $("#pg").val(data);
      });
      $.get(res.g2g_output_dir + '/tmp.dot', function (data) {
        $("#dot").val(data);
      });
      $.get(res.g2g_output_dir + '/neo/tmp.neo.nodes', function (data) {
        $("#neo_n").val(data);
      });
      $.get(res.g2g_output_dir + '/neo/tmp.neo.edges', function (data) {
        $("#neo_e").val(data);
      });
      $.get(res.g2g_output_dir + '/pgx/tmp.pgx.nodes', function (data) {
        $("#pgx_n").val(data);
      });
      $.get(res.g2g_output_dir + '/pgx/tmp.pgx.edges', function (data) {
        $("#pgx_e").val(data);
      });
      $.get(res.g2g_output_dir + '/aws/tmp.aws.nodes', function (data) {
        $("#aws_n").val(data);
      });
      $.get(res.g2g_output_dir + '/aws/tmp.aws.edges', function (data) {
        $("#aws_e").val(data);
      });
      $('#dot').val(res.dot);
      if ($("input[value=endpoint]").is(":not(:checked)")){
          $('img#vis').attr('src', res.g2g_output_dir + '/tmp.png');
        }; 
      
      
      loader('stop');
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      $('#pg').val('ERROR: ' + textStatus + ' ' + errorThrown)
              .css({ 'color': 'red' });
      $('#dot').val('');
      $('img#vis').attr('src', '');
      loader('stop');
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