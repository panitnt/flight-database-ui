const sql = require("mssql");

require("dotenv").config();
const string_connection = `Server=${process.env.DB_SERVER},${process.env.DB_PORT};Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};Encrypt=false`;

const listAllFlight = async (res) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    const result = await request.query("SELECT * FROM Flight");
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

const passenger = async (res) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    const result = await request.query("SELECT * FROM Passenger");
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

const reserve = async (res) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    const result = await request.query("SELECT * FROM Reserve r, FlightPlan f, Airplane p, Airline a, Passenger pass WHERE r.flightPlanID = f.PlanID and f.planeID = p.planeID and a.airlineID = p.airlineID and pass.passportNum = r.passengerID");
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

const flightEmployee = async (res) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    const result = await request.query("SELECT * FROM FlightEmployee fe, Employee e, FlightPlan fp, Airplane a, Airline air WHERE fe.flightPlanID = fp.PlanID and fe.emp_ID = e.emp_ID and fp.planeID = a.planeID and air.airlineID = e.airlineID");
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
app.get("/passenger", async function (req, res) {
  let result = await passenger(res);
  res.render("passenger", {
    passengerResult: result.recordset,
  });
});
app.get("/reserve", async function (req, res) {
  let result = await reserve(res);
  res.render("reserve", {
    reserveResult: result.recordset,
  });
});
app.get("/flight-employee", async function (req, res) {
  let result = await flightEmployee(res);
  res.render("flightEmployee", {
    flightEmployeeResult: result.recordset,
  });
});
app.listen(8083, "localhost", () => {
  console.log("URL: http://localhost:8083");
});
