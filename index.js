
var github_dir = 'https://raw.githubusercontent.com/g2gml/g2gml/master/examples/';

$(function() {
  list_examples( function() {
    load_example();
  });
  $('#examples').change(function() {
    load_example();
  });
  $('button').click( function() {
    $('#pg').val('');
    $('#dot').val('');
    $('img#vis').attr('src', '');
    $('img#logo').attr('src', './img/g2g_animation.png');
    $.ajax({
      url: "http://18.182.137.114:8080/g2g/",
      type: "POST",
      dataType: "json",
      data: {
        rdf: $("#rdf").val(),
        g2g: $("#g2g").val()
      },
    }).done(function(res) {
      $('#pg').val(res.pg)
              .css({'color': ''});
      $('#dot').val(res.dot);
      $('img#vis').attr('src', res.vis);
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
