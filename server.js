const express = require("express");
const app = express();

//Settings
app.listen(8000, () => console.log("listening on port 8000"));
//Required to add POST data
app.use(express.urlencoded({extended: true}));

//Init Session
const session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
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
    req.session.amt += 1;
    res.render('index', {visit: req.session.amt});
  });
  
  app.get('/plus_two', (req, res) => {
    req.session.amt += 1;
    res.redirect('/');
  });

  app.get('/reset', (req, res) => {
    req.session.amt = 0;
    res.redirect('/');
  });
////////////////////////////////////
app.get("/cars", (req, res) => {
  res.render('cars');
})

app.get("/cats", (req, res) => {
  res.render('cats');
})

app.get("/form", (req, res) => {
  res.render('form');
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

//Using Session POST
app.post('/add_user', (req, res) => {
  console.log(req.body)
  req.session.fname = req.body.fname;
  req.session.lname = req.body.lname;
  req.session.em = req.body.em;
  res.redirect('/view_user')
});

//Using Session GET
app.get('/view_user', (req, res) => {
  console.log("First Name: ", req.session.fname);
  console.log("Last Name: ", req.session.lname);
  console.log("Email: ", req.session.em);
  res.render('user', {title: "my profile page", user: {fname: req.session.fname, lname: req.session.lname, em: req.session.em}});
});