const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Import the cors package
require("dotenv").config();
require("./db/connectDB");
const authRoutes = require("./routes/auth-routes");

const app = express();
// const templatePath = path.join(__dirname, "templates/views");

// app.set("view engine", "ejs");
// app.set("views", templatePath);
// Middleware to enable CORS
// Curb Cores Error by adding a header here
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
app.use(authRoutes.routes);
// 404 page
// app.use((req, res) => {
//   res.status(404).render("auth/error404");
// });

const PORT = process.env.port || 8080;

app.listen(PORT, (err) => {
  if (err) console.error(`Error in server setup: ${err}`);
  console.log(`Server listening on url http://localhost:${PORT}`);
});
