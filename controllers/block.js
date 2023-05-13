// importing
const { validationResult } = require("express-validator");

const HttpError = require("../models/httperror");
const database = require("../models/models");
const Block = database.Block;

// create
exports.createBlock = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs, please check your data. ",
      422
    );
    return res.status(error.code || 500).json({ message: error.message });
  }
  const { block_name, type, status } = req.body;

  if (Block.countDocuments() !== 0) {
    let existingBlock;
    try {
      existingBlock = await Block.findOne({ block_name: block_name });
    } catch (err) {
      const error = new HttpError(
        "Creating Block Failed, Try again later",
        500
      );
      return res.status(error.code || 500).json({ message: error.message });
    }

    if (existingBlock) {
      const error = new HttpError(
        "Block with the provided name already exist",
        422
      );
      return res.status(error.code || 500).json({ message: error.message });
    }
  }

  const createdBlock = new Block({
    block_name: block_name,
    no_of_rooms: 0,
    rooms: [],
    type: type,
    status: status,
  });

  try {
    await createdBlock.save();
    // res.redirect("/");
  } catch (err) {
    console.log(err);
    const error = new HttpError("creating Block failed, please try again", 500);
    return res.status(error.code || 500).json({ message: error.message });
  }

  // res.status(201).json({ block: createdBlock.toObject({ getters: true }) });
  // res.send("block created successfully");
};

// ***********************READ aLL******************************************8**********///
exports.getBlock = async (req, res, next) => {
  let blocks;
  try {
    blocks = await Block.find({});
  } catch (err) {
    const error = new HttpError("Fetching Block failed", 500);
    return res.status(error.code || 500).json({ message: error.message });
  }
  // res.json({ Block: blocks.map((block) => block.toObject({ getters: true })) });
  res.send(blocks);
};

// *****************************READ BY ID******************************************************//
exports.getBlockById = async (req, res, next) => {
  const blockId = req.params.id;

  let blocks;
  try {
    blocks = await Block.findById(blockId);
  } catch (err) {
    const error = new HttpError(
      "something went wrong, could not find a block",
      500
    );
    return res.status(error.code || 500).json({ message: error.message });
  }

  if (!blocks) {
    const error = new HttpError(
      "Could not find an block for the provided id",
      404
    );
    return res.status(error.code || 500).json({ message: error.message });
  }

  // res.json({
  //   block: blocks.toObject({ getters: true }),
  // });
  res.send(blocks);
};

// delete
exports.delete = (req, res) => {
  const id = req.params.id;

  Block.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
      } else {
        res.send({
          message: "Block was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Block with id=" + id,
      });
    });
};

// get block by particulat id

// update
exports.update = (req, res) => {
  console.log("inside update block");
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }

  const id = req.params.id;
  // console.log(id);
  Block.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update user with ${id}. Maybe user not found!`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update user information" });
    });
};
