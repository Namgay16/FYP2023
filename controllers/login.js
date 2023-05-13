const axios = require("axios");
const { route } = require("../routes/chart");
exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await axios.post(
      "https://gcit-user-management.onrender.com/api/v1/UM/login",
      {
        username,
        password,
      }
    );
    const user = response.data;

    if (user && user.token) {
      const roleid = user.data.user.rows[0].roleid;

      // res.cookie("token", user.token, { httpOnly: true });
      const token = user.token;
      res.cookie("tokenABC", token, { httpOnly: true, secure: true });
      console.log("token", req.cookies.tokenABC);

       const userData = user.data.user.rows[0];
      res.cookie("userData", JSON.stringify(userData), { httpOnly: true, secure: true });

      if (roleid === 3) {
        res.redirect(
          `/dashboard/dash?username=${user.data.user.rows[0].name}&token=${user.token}`
        );
      } else {
        res.redirect(
          `/students?username=${user.data.user.rows[0].name}&token=${user.token}`
        );
      }
    } else {
      res.redirect("/login?error=Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/login?error=An error occurred, please try again later");
  }
};

// Handle GET requests to the login page
exports.loginpage = async (req, res) => {
  const error = req.query.error; // get the error message from the query parameters
  res.render("Login/index", { error }); // render the login page HTML and pass the error message as a local variable
};
