
var github_dir = 'https://raw.githubusercontent.com/g2gml/g2gml/master/examples/';

var waiting_logos = [
  './img/g2g_noisy.png',
  './img/g2g_sliding.png',
  './img/g2g_turning.png',
  './img/g2g_zooming.png',
  './img/g2g_fading.png'
];

$(function() {
  list_examples( function() {
    load_example();
  });
  $('#examples').change(function() {
    clear_output();
    load_example();
  });
  $('button').click( function() {
    clear_output();
    var logo = waiting_logos[Math.floor(Math.random() * waiting_logos.length)];
    $('img#logo').attr('src', logo);
    $.ajax({
      url: "http://192.168.56.122:8080/g2g/",
      type: "POST",
      dataType: "json",
      data: {
        rdf: $("#rdf").val(),
        g2g: $("#g2g").val()
      },
    }).done(function(res) {
      $.get(res.dir_out + '/tmp.pg', function(data) {
        $("#pg").val(data);
      });
      $.get(res.dir_out + '/tmp.dot', function(data) {
        $("#dot").val(data);
      });
      $.get(res.dir_out + '/neo/tmp.neo.nodes', function(data) {
        $("#neo_n").val(data);
      });
      $.get(res.dir_out + '/neo/tmp.neo.edges', function(data) {
        $("#neo_e").val(data);
      });
      $.get(res.dir_out + '/pgx/tmp.pgx.nodes', function(data) {
        $("#pgx_n").val(data);
      });
      $.get(res.dir_out + '/pgx/tmp.pgx.edges', function(data) {
        $("#pgx_e").val(data);
      });
      $('#dot').val(res.dot);
      $('img#vis').attr('src', res.dir_out + '/tmp.png');
      $('img#logo').attr('src', './img/g2g_static.png');
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
      $('#pg').val('ERROR: ' + textStatus + ' ' + errorThrown)
              .css({'color': 'red'});
      $('#dot').val('');
      $('img#vis').attr('src', '');
      $('img#logo').attr('src', './img/g2g_static.png');
    })
  });
});

$('textarea').on('keydown', function(e){
  if (e.keyCode === 9) {
    e.preventDefault();
    var elem = e.target;
    var val = elem.value;
    var pos = elem.selectionStart;
    elem.value = val.substr(0, pos) + '\t' + val.substr(pos, val.length);
    elem.setSelectionRange(pos + 1, pos + 1);
  }
});

var clear_output = function(callback) {
  $('#pg').val('');
  $('#dot').val('');
  $('#neo_n').val('');
  $('#neo_e').val('');
  $('#pgx_n').val('');
  $('#pgx_e').val('');
  $('img#vis').attr('src', '');
}

var list_examples = function(callback) {
  $.getJSON(github_dir + "examples.json", function(data) {
    for(var i = 0; i < data.length; i++) {
      var text = data[i].val + ' -- ' + data[i].text;
      $('#examples').append($('<option>').val(data[i].val).text(text));
      callback();
    }
  }); 
}

var load_example = function() {
  var val = $('#examples').val();
  $.get(github_dir + val + '/' + val + '.ttl', function(data) {
    $("#rdf").val(data);
  });
  $.get(github_dir + val + '/' + val + '.g2g', function(data) {
    $("#g2g").val(data);
  });
}
