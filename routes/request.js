const express = require("express");
const route = express.Router();

const requestget = require("../controllers/requestController");

route.get("/", requestget.getAllhostelChangeRequest);

route.put("/update/:id", requestget.UpdateRequest);

exports.route = route;
