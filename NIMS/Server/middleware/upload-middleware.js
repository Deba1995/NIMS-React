const path = require("path");
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profilePic") {
      cb(null, "./uploads/assets/img/profilePic/");
    } else {
      cb(null, "./uploads/assets/img/govId/");
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

let upload = multer({
  storage: storage,
});

module.exports = { upload };
