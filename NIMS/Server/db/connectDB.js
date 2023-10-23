const mongoose = require("mongoose");

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
};

mongoose
  .connect(process.env.dbURI, options)
  .then((result) => console.log("Database successfully connected :)"))
  .catch((err) => console.log(err));
