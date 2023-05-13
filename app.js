const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const blockRoute = require("./routes/router");
const HttpError = require("./models/httperror");
const RoomRoutes = require("./routes/roomRoutes");
const yearRoute = require("./routes/year");
const request = require("./routes/request");
const student = require("./routes/students");
const allocate = require("./routes/allocate");
const chart = require("./routes/chart");
const login = require("./routes/login");
// const profile = require("./routes/profile");
const app = express();

// set up se

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", blockRoute.route);

app.use("/room", RoomRoutes.route);

app.use("/year", yearRoute.route);

app.use("/Allocate", allocate.route);

app.use("/request", request.route);

app.use("/dashboard", chart);

app.use("/login", login);

// app.use("/profile", profile);

// students
app.use("/students", student.route);

// app.get("*", function (req, res) {
//   res.status(404).render("pagenotfound/index");
// });

app.set("view engine", "ejs");

// load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

// app.use((req, res, next) => {
//   const error = new HttpError("could not find this route", 404);
//   throw error;
// });

app.use((error, req, res, next) => {
  if (!res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An error occurred! " });
});

mongoose
  .connect(
    "mongodb+srv://Choki:Bumthap123@cluster0.7i7nwco.mongodb.net/HostelAllocation?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
    console.log("connect to database");
  })
  .catch((error) => {
    console.log(error);
  });
