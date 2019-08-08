const express = require("express");
const app = express();

app.listen(8000, () => console.log("listening on port 8000"));

// static files
app.use(express.static(__dirname + "/static"));

app.get('/', (req, res) => {
  res.render('index');
});

// Views
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Paths
app.get("/cars", (req, res) => {
  res.render('cars');
})

app.get("/cats", (req, res) => {
  res.render('cats');
})

app.get("/form", (req, res) => {
  res.render('form');
})

app.get("/cats/:cat", (req, res) => {
  var cats_details = [
    {id: 0, name: "Cuddles", fav_food: "Spagehitti", age: "3", slp_spots: ["under the bed", "in a sunbeam"]},
    {id: 1, name: "Bubbles", fav_food: "Spagehitti", age: "4", slp_spots: ["under the bed", "in a sunbeam"]},
    {id: 2, name: "Noodles", fav_food: "Spagehitti", age: "5", slp_spots: ["under the bed", "in a sunbeam"]},
  ];
  
  res.render('details', {cat: cats_details[req.params.cat]});
})