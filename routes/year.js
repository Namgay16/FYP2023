const express = require("express");
const route = express.Router();

const service = require("../service/render");
const yearController = require("../controllers/Acadyear");

// for thr ejs
// route.get("/", service.getBlocks);

route.get("/add-year", service.add_year);
route.get("/all-allocations", service.getWholeAllocationYear);
route.get("/create-allocations", service.displaycreateallocation);
route.get("/allocations", yearController.report);

// API
route.post("/api/years", yearController.createdYear);

exports.route = route;
