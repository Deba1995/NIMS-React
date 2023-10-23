const multer = require("multer");
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/assets/csv/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadCSV = multer({ storage: csvStorage });
module.exports = uploadCSV;
