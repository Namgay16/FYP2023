const express = require("express");
const route = express.Router();

const service = require("../service/render");
const allocateController = require("../controllers/Allocate");

// for thr ejs
// route.get("/", service.getBlocks);

route.get("/all", service.getAllocationbyId);

// API
route.post("/api/years/:year", allocateController.allocateRoomByYearAndBlock);
route.get("/api/years/:year", allocateController.getallocationbyYear);

exports.route = route;
