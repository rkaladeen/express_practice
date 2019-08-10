//Middlewares
const express = require("express");
const app = express();
const server = app.listen(8000, () => console.log("listening on port 8000"));
const io = require('socket.io')(server);

//Global Variables
var users = [];
var epic_click = 0;

//Global Functions
function getUserId() {
  return users.length + 100;
};

function getLastUserAdded(arr) {
  var user_info = {};
  if (arr === undefined || arr.length == 0) {user_info.id = "None"}
  else if (arr.length == 1) {user_info = arr[0]}
  else {user_info = arr[arr.length-1]}
  return user_info;
}


//Required to add POST data
app.use(express.urlencoded({extended: true}));

//Init Session
const session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}));

// static files
app.use(express.static(__dirname + "/static"));

// Views
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false })

//Paths

/////////////App Counter////////////////
  app.get('/', (req, res) => {
    if (isNaN(req.session.amt) === true){
      req.session.amt = 1;
    }
    req.session.amt += 1;
    res.render('index', {visit: req.session.amt});
  });
  
  app.get('/plus_two', (req, res) => {
    req.session.amt += 2;
    res.render('partials/counter', {visit: req.session.amt});
  });

  app.get('/reset', (req, res) => {
    req.session.amt = 1;
    res.render('partials/counter', {visit: req.session.amt});
  });
////////////////////////////////////
app.get("/cars", (req, res) => {
  res.render('cars');
})

app.get("/cats", (req, res) => {
  res.render('cats');
})

app.get("/form", (req, res) => {
  res.render('register');
})

// Example of getting variables from route parameters
app.get("/cats/:cat", (req, res) => {
  var cats_details = [
    {id: 0, name: "Cuddles", fav_food: "Spagehitti", age: "3", slp_spots: ["under the bed", "in a sunbeam"]},
    {id: 1, name: "Bubbles", fav_food: "Spagehitti", age: "4", slp_spots: ["under the bed", "in a sunbeam"]},
    {id: 2, name: "Noodles", fav_food: "Spagehitti", age: "5", slp_spots: ["under the bed", "in a sunbeam"]},
  ];
  const { cat } = req.params
  res.render('details', {cat: cats_details[cat]});
})

/////////USER REGISTRATION/////////////
//Using POST
// app.post('/add_user', (req, res) => {
//   // new_user = req.body.fname;
//   user_id = getUserId();
//   user_info = req.body;
//   user_info.id = user_id;
//   users.push(user_info)
//   console.log(user_info);
//   res.redirect("/view_user/"+user_id);
// });

app.get('/view_user/:uid', (req, res) => {
  const { uid } = req.params;
  console.log("VIEWING" + users[uid-100].fname);
  res.render('user', {user: users[uid-100]});
});

app.get('/users', (req, res) => {
  res.render('users', {userss: users});
});

app.get('/delete_user/:uid', (req, res) => {
  const { uid } = req.params;
  console.log("DELTED " + users[uid-100].fname);
  users.splice(uid-100,1);
  res.redirect("/users");
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

//Socket Implemetation
io.on('connection', function (socket) { 
  socket.emit('greeting', { msg: 'Greetings, from server Node, brought to you by Sockets! -Server' }); 
  socket.on('thankyou', function (data) { 
    console.log(data.msg); 
  });

  socket.on('posting_form', function (data) { 
    console.log(data.form_info); 
    user_id = getUserId();
    user_info = data.form_info;
    user_info.id = user_id;
    users.push(user_info);
    socket.emit('updated_message', {user: getLastUserAdded(users)}); 
    socket.emit('random_number', { ran: Math.floor(Math.random() * 1000) + 1 });
  });

  socket.on('epic_click', function (data) {
    epic_click += data.click;
    // console.log(data.click);
    socket.emit('click_dis', { c_dis: epic_click });
  })

  socket.on('epic_reset', function (data) {
    epic_click = data.click;
    // console.log(data.click);
    socket.emit('click_dis', { c_dis: epic_click });
  })
});