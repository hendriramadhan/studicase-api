const ProductPost = require("../models/product");
const { validationResult } = require("express-validator");

const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const path = require("path");

module.exports.add = (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("invalid Value");
    err.errorStatus = 400;
    err.data = error.array();
  }

  // if (!req.file) return res.send("Please upload a file");

  const { nama, harga, desc, stok } = req.body;
  const gambar = req.file.path;

  const ProductAdd = new ProductPost({
    nama,
    gambar,
    harga,
    desc,
    stok,
    status: 1,
    proses: 0,
  });

  ProductAdd.save().then((result) => {
    res.status(200).json({
      message: "berhasil",
      data: result,
    });
  });
};

module.exports.list = (req, res) => {
  ProductPost.find()
    .then((result) =>
      res.status(201).json({
        message: "berhasil Memanggil Data",
        data: result,
      })
    )
    .catch((error) => {
      res.status(400).json({
        message: "gagal Memanggil data",
        data: error,
      });
    });
};

module.exports.show = (req, res) => {
  let productID = req.params.getId;

  ProductPost.findById(productID)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: "Data Tidak Ditemukan",
        });
      }
      res.status(203).json({
        message: "berhasil Memanggil Data",
        data: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "gagal Memanggil data",
        data: error,
      });
    });
};

module.exports.destroy = (req, res) => {
  let productID = req.params.getId;
  ProductPost.findByIdAndDelete(productID)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Data Tidak Ditemukan",
        });
      }
      fs.unlinkSync(path.join(product.gambar), (err) => {
        if (err) {
          return res.status(404).json({
            message: "Data Tidak Ditemukan",
          });
        }
      });
      return ProductPost.findByIdAndDelete(productID);
    })
    .then(() => {
      res.status(201).json({
        message: "berhasil menghapus data",
      });
    })

    .catch((error) => {
      res.status(400).json({
        message: "gagal Memanggil data",
        data: error,
      });
    });
};

module.exports.edit = (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("invalid Value");
    err.errorStatus = 400;
    err.data = error.array();
  }

  let productID = req.params.getId;

  const { nama, harga, desc, stok } = req.body;
  const gambar = req.file.path;

  ProductPost.findById(productID)
    .then((result) => {
      // let update = result;

      if (!result) {
        return res.json({
          message: "Product tidak di temukan",
        });
      }
      fs.unlinkSync(path.join(result.gambar), (err) => {
        if (err) {
          return res.status(404).json({
            message: "Data Tidak Ditemukan",
          });
        }
      });

      result.nama = nama;
      result.harga = harga;
      result.desc = desc;
      result.gambar = gambar;

      return result.save();
    })
    .then((up) => {
      res.json({
        message: "berhasil update",
        data: up,
      });
    });
};
