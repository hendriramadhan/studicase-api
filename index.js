const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 4000;

// gambar
dotenv.config();
const multer = require("multer");
const path = require("path");

app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single("gambar")
);

// Penanganan routes harus di definisikan sesudah multer
const productRouter = require("./routes/product");
const authRouter = require("./routes/auth");

app.use("/api/v1/product", productRouter);
app.use("/api/v1/auth", authRouter);

mongoose
  .connect(
    "mongodb+srv://hendriramadhan1101:93896117@cluster0.v7lp3e5.mongodb.net/"
  )
  .then(() => {
    app.listen(port, () => {
      console.log("listening on port http://localhost:%d", port);
    });
  });
