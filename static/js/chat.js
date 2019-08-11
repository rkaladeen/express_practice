

$(document).ready(function (){
  var socket = io();
  var user = document.getElementById("name");
  var user_dis = document.getElementById("joined_users");
  
  $('#join_btn').click(function (){
    if (user.value.length < 3) {
      $('#name').addClass('is-invalid');
      $('#valid_name').removeClass('d-none');
    } else {
      $('#name_req').addClass('d-none');
      socket.emit('user_join', { user: {name: user.value} });
      socket.on('joined_list', function (data) {
        $('#chat_room').removeClass('d-none');
        for (var user of data.joined_users) {
          user_dis.innerHTML += "<p>" + user.id + " - " + user.name + "</p>";
          console.log("USER_LIST" + user.name)
        }
        socket.on('update_all', function (data) {
          user_dis.innerHTML += "<p>" + data.joined_user.id + " - " + data.joined_user.name + "</p>";
        })
      })
    }
  })
})