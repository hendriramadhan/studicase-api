const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const { refreshToken } = require("../controllers/refreshToken");
const { register, login, logout } = require("../controllers/auth");
const { route } = require("./product");

router.post(
  "/register",
  [
    body("nama").isLength({ min: 3 }).withMessage("Nama  Terlalu Pendek"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("password minimal 8 karakter")
      .custom((value) => {
        if (!validator.isAlphanumeric(value)) {
          throw new Error("Password harus huruf dan angka");
        }
        return true;
      }),
  ],
  register
);

router.post(
  "/login",
  [
    body("nama").isLength({ min: 3 }).withMessage("Nama  Terlalu Pendek"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("password minimal 8 karakter")
      .custom((value) => {
        if (!validator.isAlphanumeric(value)) {
          throw new Error("Password harus huruf dan angka");
        }
        return true;
      }),
  ],
  login
);
router.delete("/logout", logout);
router.get("/token", refreshToken);

module.exports = router;
