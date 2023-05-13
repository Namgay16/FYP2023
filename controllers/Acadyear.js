const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const HttpError = require("../models/httperror");
const database = require("../models/models");
const AcadYear = database.AcadYear;

// create
// create
exports.createdYear = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs, please check your data. ",
      422
    );
    return res.status(error.code || 500).json({ message: error.message });
  }
  const { year, description } = req.body;
  console.log(year, description);

  let existingyear;

  try {
    const count = await AcadYear.countDocuments();
    if (count !== 0) {
      existingyear = await AcadYear.findOne({ Year: year });
    }
  } catch (err) {
    const error = new HttpError("Creating year Failed, Try again later", 500);
    return res.status(error.code || 500).json({ message: error.message });
  }

  if (existingyear) {
    const error = new HttpError(
      "Already created Academic year for the year " + year,
      422
    );
    console.log(error.message);
    return res.status(error.code || 500).json({ message: error.message });
  }

  const createdYear = new AcadYear({
    Year: year,
    Description: description,
    Created_by: "Admin-SSO",
    date: new Date(),
  });

  try {
    await createdYear.save();
    res.status(201).json(createdYear);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating Academic year failed, for some unknown reason",
      500
    );
    return res.status(error.code || 500).json({ message: error.message });
  }
};

// fghjkl;
// get all allocate
exports.report = async (req, res, next) => {
  // assuming room name is passed as a query parameter

  let Acad;
  try {
    Acad = await AcadYear.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find allocation.",
      500
    );
    return res.status(error.code || 500).json({ message: error.message });
  }

  if (!Acad) {
    const error = new HttpError(
      "Could not find a room with the provided name.",
      404
    );
    return res.status(error.code || 500).json({ message: error.message });
  }

  // res.json({ year: room });
  res.send(Acad);
  // return res.render("Allocation/index", { Acad: Acad });
};
