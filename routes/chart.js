const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const chartjs = require("../controllers/chart");
const service = require("../service/render");

// router.get('/', blockController.getBlock)

// router.get("/dash", service.getchart);
router.get("/dash", service.getBlocks);

router.get("/", chartjs.ChartJS);
// router.put("/:id", requestController.UpdateRequest);

module.exports = router;
