const axios = require("axios");
const HttpError = require("../models/httperror");
const nodemailer = require("nodemailer");

const stdb = require("../models/models");
const Room = stdb.Room;
const Block = stdb.Block;
const Request = stdb.Request;
const Allocate = stdb.Allocation;
const RecentActivity = stdb.RecentActivity;

// get request

// get request by date
exports.getAllhostelChangeRequest = async (req, res) => {
  try {
    const viewMore = req.query.viewMore === "true"; // Check if view more button was clicked

    let requests;
    if (viewMore) {
      requests = await Request.find({}).sort({ Requested: -1 });
    } else {
      requests = await Request.find({}).sort({ Requested: -1 }).limit(10);
    }

    Promise.all([
      axios.get(`http://localhost:5000/api/blocks`),
      axios.get(`http://localhost:5000/room/api/rooms`),
    ])
      .then((responses) => {
        const block = responses[0].data;
        const room = responses[1].data;
        res.render("Request/index", {
          blocks: block,
          rooms: room,
          requests: requests,
        });
      })
      .catch((err) => {
        res.send(err);
      });

    // res.send(requests);
    // res.render("Request/index", { requests: requests });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};
// ///////////////////////////////
//initialize email
// send email notification to the user
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "hostelallocations@gmail.com",
    pass: "pzeqibrcubljtdrj",
  },
});
// update request////////////////////////////////////////////////////////////////////////
exports.UpdateRequest = async (req, res) => {
  const requestId = req.params.id;
  const { remarks, status } = req.body;

  // date and timeout
  const now = new Date();
  const currentDateTime = now.toLocaleString();

  let request;
  try {
    request = await Request.findOne({ _id: requestId });
  } catch (err) {
    console.error(err);
    const error = new HttpError(
      "Something went wrong, could not update request1",
      500
    );
    return res.status(error.code || 500).json({ message: error.message });
  }

  if (!request) {
    const error = new HttpError(
      "Could not find a request for the provided ID",
      404
    );
    return res.status(error.code || 500).json({ message: error.message });
  }

  if (status === "accepted") {
    const currentRoom = request.room;
    const newRoom = request.targetroom;

    const currRoom = await Room.findOne({ _id: newRoom });
    const currBlock = await Block.findOne({ _id: request.targetblock });

    console.log("newRoom", newRoom);

    // Update allocation table
    try {
      const allocation = await Allocate.findOneAndUpdate(
        { sid: request.student, year: request.student_year },
        {
          $set: {
            roomid: newRoom,
            blockid: request.targetblock,
            room_name: currRoom.room_name,
            block_name: currBlock.block_name,
          },
        },
        { new: true }
      );
      console.log(`Allocation updated: ${allocation}`);
    } catch (err) {
      console.error(err);
      const error = new HttpError(
        "Something went wrong, could not update allocation",
        500
      );
      return res.status(error.code || 500).json({ message: error.message });
    }

    // Update request table
    request.Remarks = remarks || request.Remarks;
    request.status = "accepted";
    request.clicked = true;

    // in recent table
    const recent = new RecentActivity({
      student: request.student,
      Description: "Accepted",
      date: currentDateTime,
    });
    try {
      await request.save();
      await recent.save();
      console.log(`Request updated: ${request}`);

      const mailOptions = {
        from: "hostelallocations@gmail.com",
        to: "ceedeejee9@gmail.com",
        subject: "Request Status Updated",
        text: `Dear ${request.student_name},\n\nYour request to chaneg room has been approved to ${request.status}.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong, could not update request",
        500
      );
      return res.status(error.code || 500).json({ message: error.message });
    }

    // Update room table
    try {
      const room = await Room.findByIdAndUpdate(
        newRoom,
        { $inc: { availability: -1 } },
        { new: true }
      );
      // console.log(
      //   `Availability updated for room ${room.room_name}: ${room.availability}`
      // );
    } catch (err) {
      console.error(err);
      const error = new HttpError(
        "Something went wrong, could not update availability",
        500
      );
      return res.status(error.code || 500).json({ message: error.message });
    }
  } else if (status === "rejected") {
    // Update request table
    request.Remarks = remarks || request.Remarks;
    request.status = "Rejected";
    request.clicked = true;
    //reject
    const recent = new RecentActivity({
      student: request.student,
      Description: "Rejected",
      date: currentDateTime,
    });
    try {
      await request.save();
      await recent.save();
      console.log(`Request updated: ${request}`);
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong, could not update request",
        500
      );
      return res.status(error.code || 500).json({ message: error.message });
    }
  } else {
    const error = new HttpError("Invalid status value", 400);
    return res.status(error.code || 500).json({ message: error.message });
  }

  // res.json({ message: "Request updated successfully" });
  res.send("Request Granted Successfully");
};
