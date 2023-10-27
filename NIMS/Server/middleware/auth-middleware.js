const jwt = require("jsonwebtoken");
const { user } = require("../models/user");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check json web token exists & is verified
  if (token) {
    jwt.verify(token, "my secret key", (err, decodedToken) => {
      if (err) {
        // res.clearCookie("jwt"); // Clear the invalid token
        // req.user = null; // Clear user information from the request
        // next();
        return res.status(401).json({
          success: false,
          message: "Token verification failed",
        });
      } else {
        if (decodedToken.role !== "admin") {
          return res
            .status(401)
            .json({ message: "Not authorized", success: false });
        } else {
          // console.log(decodedToken);
          // Token is valid, add user information to the request
          req.user = decodedToken;
          next();
        }
      }
    });
  } else {
    // res.redirect("/login");
    return res
      .status(401)
      .json({ success: false, message: "Token not provided" });
  }
};

//check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "my secret key", async (err, decodedToken) => {
      if (err) {
        console.error(err.message);
        res.locals.user = null;
        next();
      } else {
        let userData = await user.findById(decodedToken.uid);
        res.locals.user = userData;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {
  requireAuth,
  checkUser,
};
