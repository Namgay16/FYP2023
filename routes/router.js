const express = require("express");
const route = express.Router();
const { check } = require("express-validator");
const service = require("../service/render");
const blockController = require("../controllers/block");
const chart = require("../controllers/chart");

// for thr ejs
route.get("/", service.getBlock);
route.get("/dashboard", service.getBlocks);
route.get("/view-block", service.getBlockById);
// route.get("/add-block", service.add_block);
route.get("/update-block", service.update_block);

// API for Block
route.post(
  "/api/blocks",
  // [
  //   check("block_name").not().isEmpty(),
  //   check("no_of_rooms").not().isEmpty(),
  // ],
  blockController.createBlock
);
route.get("/api/blocks", blockController.getBlock);
route.get("/api/blocks/:id", blockController.getBlockById);
route.delete("/api/blocks/:id", blockController.delete);
route.put("/api/blocks/:id", blockController.update);

exports.route = route;
