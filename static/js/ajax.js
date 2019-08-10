$(document).ready(function(){
  $('#plus_two').click(function(){
    $.ajax({
      url: "/plus_two/"
    })
    .done(function(res){
      $('#count').html(res) 
    })
  })
})

$(document).ready(function(){
  $('#reset').click(function(){
    $.ajax({
      url: "/reset/"
    })
    .done(function(res){
      $('#count').html(res) 
    })
  })
})