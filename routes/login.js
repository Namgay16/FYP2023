const express = require("express");
const { check } = require("express-validator");

const route = express.Router();
const logincontrol = require("../controllers/login");

route.get("/", logincontrol.loginpage);
route.post("/", logincontrol.Login);

module.exports = route;
