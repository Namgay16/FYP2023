const express = require("express");
const route = express.Router();
const service = require("../service/studentRender");

route.get("/", service.StudentDashboard);


// API

exports.route = route;
