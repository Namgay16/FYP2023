const axios = require("axios");

const ChartJS = async (req, res) => {
  let response;
  try {
    // get student data
    response = await axios.get("http://localhost:3000/students");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error fetching student data");
  }

  //   console.log(response.data);
  // if get student data, group them based on year and gender
  let groupedData = {};
  if (response && response.data.students && response.data.students.length > 0) {
    groupedData = response.data.students.reduce((acc, student) => {
      const year = `year${student.year}`;
      const gender = student.gender;
      if (!acc[year]) {
        acc[year] = { male: 0, female: 0 };
      }
      acc[year][gender]++;
      return acc;
    }, {});
  }
  // render the chart view and pass the grouped data as a parameter
  // res.render("chart", { chart: groupedData });
  req.locals.chart = groupedData;
};

exports.ChartJS = ChartJS;
