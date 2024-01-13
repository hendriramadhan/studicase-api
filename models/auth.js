const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthPost = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: false,
    },
    transaction: {
      type: Array,
      required: false,
    },
    wishlist: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Auth", AuthPost);
