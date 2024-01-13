const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductPost = new Schema(
  {
    gambar: {
      type: String,
      required: true,
    },
    nama: {
      type: String,
      required: true,
    },
    harga: {
      type: Number,
      required: true,
    },
    stok: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductPost);
