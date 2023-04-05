const sql = require("mssql");

require("dotenv").config();
const string_connection = `Server=${process.env.DB_SERVER},${process.env.DB_PORT};Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};Encrypt=false`;

const listAllFlight = async (res) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    const result = await request.query("SELECT f.flight_number, f.airlineID, f.departure_airport, a.airportName as 'destination_airport' FROM desAirportSort f, Airport a WHERE (f.destination_airport = a.airportID)");
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/flight", async function (req, res) {
  let result = await listAllFlight(res);
  res.render("flight", {
    flightResult: result.recordset,
  });
});
app.listen(8083, "localhost", () => {
  console.log("URL: http://localhost:8083");
});
