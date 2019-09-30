
const example_github_dir = 'https://raw.githubusercontent.com/g2glab/g2g/master/examples/';

const waiting_logos = [
  '/img/g2g_noisy.png',
  '/img/g2g_sliding.png',
  '/img/g2g_turning.png',
  '/img/g2g_zooming.png',
  '/img/g2g_fading.png'
];

$(function () {
  list_examples(function () {
    load_example();
  });
  $('#examples').change(function () {
    clear_output();
    load_example();
  });
  
  // Local File Mode as default
  $(".endpoint").hide();
  $('input#mode_switch').change(function () {
      if (!$('input#mode_switch').is(":checked")){
        $(".rdf").show();
        $(".endpoint").hide();
      } else {
        $(".rdf").hide();
        $(".endpoint").show();
      }; 
    });

  //Hide output textarea until submit 
  $(".output").hide();

  //Submit
  $('button').click(function () {
    clear_output();
    var random = Math.floor(Math.random() * waiting_logos.length)
    var logo = waiting_logos[random];
    $('img#logo').attr('src', logo);
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
      
      $('img#logo').attr('src', './img/g2g_static.png');
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      $('#pg').val('ERROR: ' + textStatus + ' ' + errorThrown)
              .css({ 'color': 'red' });
      $('#dot').val('');
      $('img#vis').attr('src', '');
      $('img#logo').attr('src', './img/g2g_static.png');
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


var clear_output = function (callback) {
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

var list_examples = function (callback) {
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

var load_example = function () {
  var $val = $('#examples').val();
  var example_ttl = $val + '/' + $val + '.ttl';
  var example_g2g = $val + '/' + $val + '.g2g';

  $.get(example_github_dir + example_ttl, function (data) {
    $("#rdf").val(data);
  });
  $.get(example_github_dir + example_g2g, function (data) {
    $("#g2g").val(data);
  });
};
