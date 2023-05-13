const HttpError = require("../../models/httperror");
const axios = require("axios");

exports.GetStudents = async (req, res, years) => {
  const token = req.cookies.tokenABC;
  console.log("token ", token);

  try {
    const response = await axios.get(
      "https://gcit-user-management.onrender.com/api/v1/UM/join",
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );

    let students = response.data.filter(
      (student) => student.year === String(years) && student.isDisabled !== true
    );
    students = students.sort(() => Math.random() - 0.5);
    console.log(students);
    return students;
  } catch (e) {
    console.log(e);
    console.log("server down");
  }
};
