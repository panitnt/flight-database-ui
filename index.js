const sql = require("mssql");

require("dotenv").config();
const string_connection = `Server=${process.env.DB_SERVER},${process.env.DB_PORT};Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};Encrypt=false`;

const listAllFlight = async (res) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    const result = await request.query("SELECT * FROM AllFlightShow ORDER BY flight_date, departure_time");
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
    const result = await request.query("SELECT * FROM FlightEmployee fe, Employee e, FlightPlan fp, Airplane a, Airline air WHERE fe.flightPlanID = fp.PlanID and fe.emp_ID = e.emp_ID and fp.planeID = a.planeID and air.airlineID = e.airlineID ORDER BY fp.FlightNumber");
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

const seacrhFlightEmployee = async (res, flightnum) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    const result = await request.query(`SELECT * FROM FlightEmployee fe, Employee e, FlightPlan fp, Airplane a, Airline air WHERE fe.flightPlanID = fp.PlanID and fe.emp_ID = e.emp_ID and fp.planeID = a.planeID and air.airlineID = e.airlineID and fp.FlightNumber = '${flightnum}'`);
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

const sortFlight = async (res, flightNum , date) =>{
  try{
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    let sortFunc = `SELECT * FROM AllFlightShow`

    if ((flightNum != '') || (date !== null)){
      sortFunc += " WHERE"
      if (flightNum != '') sortFunc += ` (flightNumber = '${flightNum}')`
      if ((flightNum != '')&& (date !== null)) sortFunc += `and ( flight_date = '${date}')`
      else if (date !== null) sortFunc += ` (flight_date = '${date}')`
    }
    sortFunc += " ORDER BY flight_date, departure_time"
    // console.log(sortFunc)
    const result = await request.query(sortFunc);
    return result;
  }
  catch(err){
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded( { extended : false }));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/flight", async function (req, res) {
  let result = await listAllFlight(res);
  res.render("flight", {
    flightResult: result.recordset,
  });
});

app.post("/flight/sort", async function (req, res) {
  // console.log(req.body.dateSelect=='');
  // console.log(newDate);
  let dateInput = req.body.dateSelect;
  if (req.body.dateSelect == '') {
    dateInput = null
  }
  let result = await sortFlight(req, req.body.flightNum, dateInput);
  res.render("flight", {
    flightResult: result.recordset,
  });
})

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

app.post("/search-flight-employee", async function (req, res) {
  let result = await seacrhFlightEmployee(res, req.body.flightn);
  res.render("flightEmployee", {
    flightEmployeeResult: result.recordset,
  });
});


app.listen(8083, "localhost", () => {
  console.log("URL: http://localhost:8083");
});
