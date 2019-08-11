//First Web Socket Implementation with Socket.io
$(document).ready(function (){
  var socket = io(); //1
  socket.on('greeting', function (data) { //4
    console.log(data.msg); //5
    socket.emit('thankyou', { msg: 'Thank you for connecting me! -Client' }); //6
  });
})


function clearRegForm() {
  $("#fname").val('');
  $("#lname").val('');
  $("#em").val('');
  $("#pw").val('');
  $("#cpw").val('');
  console.log("FORM CLEARED");
}

function reg_res() {
  var socket = io(); 
  
  //Form data
  var fname = document.getElementById("fname");
  var lname = document.getElementById("lname");
  var em = document.getElementById("em");
  var pw = document.getElementById("pw");
  var cpw = document.getElementById("cpw");
  
  var form_info = {fname: fname.value, lname: lname.value, em: em.value, pw: pw.value, cpw: cpw.value};
  console.log(">>>>>>>" + form_info.fname);
  socket.emit('posting_form', {form_info: form_info}); 
  socket.on('updated_message', function (data) { 
    console.log(data.user);
    var context = "{ "+data.user.fname +" - "+ data.user.lname +" | Email: "+ data.user.em +" | Password: "+ data.user.pw +" | Confirm Password: "+ data.user.cpw + " }"; 
    $("#emit_user_info").text(context);
  });
  socket.on('random_number', function (data) { 
    console.log(data.ran); 
    $("#ran_num").text(data.ran);
  });

  $("#reg_info").removeClass('d-none');
  clearRegForm();
}

//Epic Button

  
$(document).ready(function(){
  $('#epic_btn').click(function() {
    var socket = io(); 
    // console.log("CLICKED EPIC");
    socket.emit('epic_click', {click: 1});
    socket.on('click_dis', function (data) {
      // console.log(data.c_dis);
      $('#epic_wid').text(data.c_dis);
    })
  }) 
  $('#epic_reset').click(function() {
    var socket = io(); 
    // console.log("CLICKED RESET");
    socket.emit('epic_reset', {click: 0});
    socket.on('click_dis', function (data) {
      // console.log(data.c_dis);
      $('#epic_wid').text(data.c_dis);
    })
  }) 
})