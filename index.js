const sql = require("mssql");

require("dotenv").config();
const string_connection = `Server=${process.env.DB_SERVER},${process.env.DB_PORT};Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};Encrypt=false`;

const listAllFlight = async (res) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    const result = await request.query(
      "SELECT * FROM AllFlightShow ORDER BY flight_date, departure_time"
    );
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

const passengerSort = async (res, passportNum) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    let searchSQL = `SELECT * FROM Passenger`;
    if (passportNum != "") {
      searchSQL += ` WHERE (passportNum = '${passportNum}')`;
    }
    const result = await request.query(searchSQL);
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
    const result = await request.query(
      "SELECT * FROM Reserve r, FlightPlan f, Airplane p, Airline a, Passenger pass WHERE r.flightPlanID = f.PlanID and f.planeID = p.planeID and a.airlineID = p.airlineID and pass.passportNum = r.passengerID ORDER BY f.FlightNumber"
    );
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

const reserveSort = async (res, passportNum, flightNum) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    let findList = `SELECT * FROM Reserve r, FlightPlan f, Airplane p, Airline a, Passenger pass WHERE (r.flightPlanID = f.PlanID) and (f.planeID = p.planeID) and (a.airlineID = p.airlineID) and (pass.passportNum = r.passengerID)`;
    if (passportNum != "") {
      findList += ` and (pass.passportNum = '${passportNum}')`;
    }
    if (flightNum != "") {
      findList += ` and (f.FlightNumber = '${flightNum}')`;
    }
    findList += ` ORDER BY f.FlightNumber`;
    // console.log(findList)
    const result = await request.query(findList);
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
    const result = await request.query(
      "SELECT * FROM FlightEmployee fe, Employee e, FlightPlan fp, Airplane a, Airline air WHERE fe.flightPlanID = fp.PlanID and fe.emp_ID = e.emp_ID and fp.planeID = a.planeID and air.airlineID = e.airlineID ORDER BY fp.FlightNumber"
    );
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
    const result = await request.query(
      `SELECT * FROM FlightEmployee fe, Employee e, FlightPlan fp, Airplane a, Airline air WHERE fe.flightPlanID = fp.PlanID and fe.emp_ID = e.emp_ID and fp.planeID = a.planeID and air.airlineID = e.airlineID and fp.FlightNumber = '${flightnum}' ORDER BY fp.FlightNumber`
    );
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

const sortFlight = async (res, flightNum, date) => {
  try {
    let con = await sql.connect(string_connection);
    let request = new sql.Request(con);
    let sortFunc = `SELECT * FROM AllFlightShow`;

    if (flightNum != "" || date !== null) {
      sortFunc += " WHERE";
      if (flightNum != "") sortFunc += ` (flightNumber = '${flightNum}')`;
      if (flightNum != "" && date !== null)
        sortFunc += `and ( flight_date = '${date}')`;
      else if (date !== null) sortFunc += ` (flight_date = '${date}')`;
    }
    sortFunc += " ORDER BY flight_date, departure_time";
    // console.log(sortFunc)
    const result = await request.query(sortFunc);
    return result;
  } catch (err) {
    console.log(string_connection);
    res.status(500).send("Error connecting to the database");
  } finally {
    sql.close();
  }
};

const insertFlightPlan = async (res, planID, flightNum, planeID, date) => {
  var dbConn = new sql.ConnectionPool(string_connection);
  var transactionResult = ``;
  dbConn.connect().then(function () {
    var transaction = new sql.Transaction(dbConn);
    transaction
      .begin()
      .then(function () {
        var request = new sql.Request(transaction);
        request
          .query(
            `INSERT INTO FlightPlan (PlanID,FlightNumber,planeID,flight_date) VALUES ('${planID}','${flightNum}', '${planeID}', '${date}')`
          )
          .then(function () {
            transaction
              .commit()
              .then(function (resp) {
                console.log("transaction completed");
                transactionResult += `transaction completed`
                dbConn.close();
              })
              .catch(function (err) {
                console.log("Error in Transaction Commit " + err);
                transactionResult += `Error in Transaction Commit`
                dbConn.close();
              });
          })
          .catch(function (err) {
            transactionResult += `Error in Transaction Begin`
            console.log("Error in Transaction Begin " + err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        console.log(err);
        dbConn.close();
      })
      .catch(function (err) {
        console.log(err);
      });
  });
  console.log(transactionResult)
  return transactionResult
};

var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

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
  if (req.body.dateSelect == "") {
    dateInput = null;
  }
  let result = await sortFlight(res, req.body.flightNum, dateInput);
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

app.post("/passenger/sort", async function (req, res) {
  let result = await passengerSort(res, req.body.passportNum);
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

app.post("/reserve/sort", async function (req, res) {
  let result = await reserveSort(res, req.body.passportNum, req.body.flightNum);
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
app.get("/flightplan/add", async function (req, res) {
  res.render("addFLightPlan");
});

app.post("/flightplan/add", async function (req, res) {
  let status = await insertFlightPlan(res, req.body.planID, req.body.flightNum, req.body.planeNum, req.body.dateSelect);
  console.log(status)
  res.render("addFLightPlanStatus", {
    addResult: status
  })
});


app.listen(8083, "localhost", () => {
  console.log("URL: http://localhost:8083");
});
