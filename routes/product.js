const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { add, list, show, destroy, edit } = require("../controllers/product");

// get, post, put, delete
router.get("/data", list);
router.get("/show/:getId", show);
router.delete("/del/:getId", destroy);

router.post(
  "/create",
  [
    body("nama")
      .isLength({ min: 3 })
      .withMessage("Nama Product Terlalu Pendek"),
    body("desc")
      .isLength({ min: 3, max: 100 })
      .withMessage("Deskripsi Minimal 10 karakter dan Maksimal 100 karakter"),
  ],
  add
);
router.put(
  "/edit/:getId",
  [
    body("nama")
      .isLength({ min: 3 })
      .withMessage("Nama Product Terlalu Pendek"),
    body("desc")
      .isLength({ min: 10, max: 100 })
      .withMessage("Deskripsi Minimal 10 karakter dan Maksimal 100 karakter"),
  ],
  edit
);

module.exports = router;
