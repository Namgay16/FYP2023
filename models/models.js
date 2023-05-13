const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Block
const Block = new Schema({
  block_name: { type: String, required: true },
  no_of_rooms: { type: String, required: true },
  type: { type: String, enum: ["boys", "girls"], required: true },
  status: { type: String, enum: ["available", "unavailable"], required: true },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
});

// Room
const Room = new mongoose.Schema({
  room_name: { type: String, required: true },
  room_capacity: { type: Number, required: true },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "students", required: false },
  ],
  availability: { type: Number, required: true },
  isDisabled: { type: Boolean, required: false },
  blockid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",
    required: true,
  },
  status: { type: String, enum: ["available", "unavailable"], required: true },
  type: { type: String, enum: ["boys", "girls"], required: true },
});

// AcademicYear
const AcadYear = new Schema({
  Year: { type: String, required: true, unique: true },
  Description: { type: String, required: true },
  Created_by: { type: String, required: true },
  date: { type: Date, required: true },
});

// Allocation
const Allocation = new mongoose.Schema({
  student: { type: String, required: true },
  student_name: { type: String, required: true },
  student_email: { type: String, required: true }, // as of now i will keep it dummy later from lakshey
  roomid: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  room_name: { type: String, required: true },
  blockid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  student_gender: { type: String, required: true },
  course: { type: String, required: true },
  sid: { type: String, required: true },
  block_name: { type: String, required: true },
  year: { type: String, required: true },
  created: { type: String, required: true },
  academicyear: { type: String, required: true },
  isDisabled: { type: Boolean, required: false },
});

// Request

const Request = new mongoose.Schema({
  student: { type: String, required: true },
  student_name: { type: String, required: true },
  student_email: { type: String, required: true },
  student_gender: { type: String, required: true },
  student_course: { type: String, required: true },
  student_year: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  block: { type: mongoose.Schema.Types.ObjectId, ref: "Block", required: true },
  targetroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  targetblock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",
    required: true,
  },
  Requested: { type: Date, required: true },
  image: { type: String, required: true },
  clicked: { type: Boolean, required: false },
  reason: {type: String, required: true}
});

const RecentActivity = new Schema({
  student: { type: String, required: true },
  Description: { type: String, required: true },
  date: { type: Date, required: true },
});

exports.Block = mongoose.model("Block", Block);
exports.Room = mongoose.model("Room", Room);
exports.AcadYear = mongoose.model("AcadYear", AcadYear);
exports.Allocation = mongoose.model("Allocation", Allocation);
exports.Request = mongoose.model("Request", Request);
exports.RecentActivity = mongoose.model("RecentActivity", RecentActivity);
