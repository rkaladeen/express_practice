

$(document).ready(function (){
  var socket = io();
  var user = document.getElementById("name");
  var user_dis = document.getElementById("joined_users");
  var ts = new Date();
  var m_count = 0;
  var message_list = document.getElementById("messages");
  var message_to_send = document.getElementById("message");
  var ms_ts = ts.toLocaleString();
  var context = "";
  
  $('#join_btn').click(function (){
    if (user.value.length < 3) {
      $('#name').addClass('is-invalid');
      $('#valid_name').removeClass('d-none');
    } else {
      $('#name_req').addClass('d-none');
      socket.emit('user_join', { user: { name: user.value, join_date: ts.toLocaleString()} });
      
      socket.on('joined_list', function (data) {
        $('#chat_room').removeClass('d-none');
        for (var user of data.joined_users) {
          user_dis.innerHTML += "<small class='d-block'>" + user.id + " - " + user.name + " | " + user.join_date + " - Joined</small>";
          // console.log("USER_LIST" + user.name)
        }
        socket.on('update_all', function (data) {
          user_dis.innerHTML += "<small class='d-block'>" + data.joined_user.id + " - " + data.joined_user.name + " | " + data.joined_user.join_date + " - Joined</small>";
        })
        socket.on('left_room', function (data) {
          user_dis.innerHTML += "<small class='d-block'>" + data.left_user.id + " - " + data.left_user.name + " | " + data.left_user.join_date + " - Left</small>";
        })
      })
      //The following listener is to generate existing messages upon joining chat room.
      socket.on('posted_msgs', function (data) {
        for (var msg of data.p_msgs) {
          if (msg.sender === user.value) {
            context = "<div class='jumbotron bg-primary my-1 col-8 p-2 ml-auto'>";
            context += "<div class='row'>";
            context += "<p class='mb-0 col-10 text-light'>" + msg.msg + "</p>";
            context += "<div class='col-2 text-right'>";
            context += "<button id='m" + msg.id + "' type='button' class='btn fas fa-trash-alt text-danger' style='background: none' onclick='delete_message(this.id);'></button>";
            context += "</div></div>"
            context += "<small class='text-light text-right d-block'>" + msg.sender + " | " + msg.ts + "</small></div>";
            message_list.innerHTML += context;
            context = "";
          } else {
            context = "<div class='jumbotron my-1 col-8 p-2 mr-auto'>";
            context += "<p class='mb-0'>" + msg.msg + "</p>";
            context += "<small class='text-muted text-right d-block'>" + msg.sender + " | " + msg.ts + " </small></div>";
            message_list.innerHTML += context;
            context = "";
          }
        }
      })
    }
  })

  $('#send').click(function () {
    if (message_to_send.value.length < 1) {
      $('#message').addClass('is-invalid');
      $('#message').attr("placeholder", 'Please type a message.');
    } else {
      m_count++;
      context = "<div class='jumbotron bg-primary my-1 col-8 p-2 ml-auto'>";
      context += "<div class='row'>";
      context += "<p class='mb-0 col-10 text-light'>" + message_to_send.value+"</p>";
      context += "<div class='col-2 text-right'>";
      context += "<button id='m"+m_count+"' type='button' class='btn fas fa-trash-alt text-danger' style='background: none' onclick='delete_message(this.id);'></button>";
      context += "</div></div>"
      context += "<small class='text-light text-right d-block'>" + user.value +" | "+ms_ts+"</small></div>";
      
      message_list.innerHTML += context;
      context = "";

      console.log("EMIT STARTED " + message_to_send.value);
      socket.emit('msg_send', 
      { msg: {id: m_count, 
              sender: user.value, 
              msg: message_to_send.value, 
              ts: ms_ts} });

      message_to_send.value = "";
    }
  })
  //Listen for broadcast
  socket.on('update_msg_wall', function (data) {
    console.log("BROADCAST RECEIVED: " + data.msg.msg);
    context = "<div class='jumbotron my-1 col-8 p-2 mr-auto'>";
    context += "<p class='mb-0'>"+data.msg.msg+"</p>";
    context += "<small class='text-muted text-right d-block'>" + data.msg.sender + " | " + data.msg.ts +" </small></div>";
    message_list.innerHTML += context;
    context = "";
  }) 


})