
var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/flight", function (req, res) {
  res.render("flight");
});
app.listen(8083, "localhost", () => {
  console.log("URL: http://localhost:8083");
});
