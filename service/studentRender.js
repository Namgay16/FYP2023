const axios = require("axios");

exports.StudentDashboard = (req, res) => {
  // calling student to get their detail
  const userdata = req.cookies.userData;
  const user = JSON.parse(userdata);
  console.log(user);

  axios
    .all([
      axios.get("http://localhost:5000/api/blocks"),
      axios.get(`http://localhost:5000/students/get-roommate/${user.sid}`),
      axios.get("http://localhost:5000/room/api/rooms"),
    ])
    .then(
      axios.spread(function (blocksResponse, roomsResponse, room) {
        res.render("students/index", {
          userdata: user,
          block: blocksResponse.data,
          roommate: roomsResponse.data,
          room: room.data,
        });
      })
    )
    .catch((err) => {
      console.log(err);
      res.send(err);
    });

  // calling to get Roommate
};

//Student Profile
exports.StudentProfile = (req, res) => {
  // calling student to get their detail
  const userdata = req.cookies.userData;
  const user = JSON.parse(userdata);
  console.log(user);

  axios
    .all([
      axios.get("http://localhost:5000/api/blocks"),
      axios.get("http://localhost:5000/room/api/rooms"),
    ])
    .then(
      axios.spread(function (blocksResponse, roomsResponse, room) {
        res.render("/profile", {
          userdata: user,
          block: blocksResponse.data,
          room: room.data,
        });
      })
    )
    .catch((err) => {
      console.log(err);
      res.send(err);
    });

  // calling to get Roommate
};
