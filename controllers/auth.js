const AuthPost = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

module.exports.register = (req, res) => {
  const { nama, email, password, repassword } = req.body;

  if (password !== repassword) {
    return res.status(400).json({
      message: "Password dan konfirmasi password tidak cocok",
    });
  }

  AuthPost.findOne({ email: email }).then((result) => {
    if (result) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }
    bcrypt.genSalt().then((salt) => {
      bcrypt
        .hash(password, salt)
        .then((hashPw) => {
          const regAuth = new AuthPost({
            nama,
            email,
            password: hashPw,
            refresh_token: null,
          });
          return regAuth.save();
        })
        .then((final) => {
          res.status(200).json({
            message: "Registrasi Berhasil",
            data: {
              nama,
              email,
            },
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Registrasi Gagal",
            data: err,
          });
        });
    });
  });
};

//login

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  //check email
  AuthPost.findOne({ email: email }).then((result) => {
    if (!result) {
      return res.status(400).json({
        message: "Email tidak terdaftar",
      });
    }

    //compare password
    bcrypt.compare(password, result.password).then((match) => {
      if (!match) {
        return res.status(404).json({ message: "Password Salah!" });
      }

      const id = result._id;
      const nama = result.nama;
      const email = result.email;

      const accessToken = jwt.sign(
        {
          id,
          nama,
          email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      const refreshToken = jwt.sign(
        {
          id,
          nama,
          email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      AuthPost.updateOne({ _id: id }, { $set: { refresh_token: refreshToken } })
        .then(() => {
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 60 * 1000,
            secure: true,
            sameSite: "none",
          });
          res.status(201).json({
            message: "berhasil login",
            accessToken,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "gagal login!",
            data: err,
          });
        });
    });
  });
};

module.exports.logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(404);

  AuthPost.findOne({
    refresh_token: refreshToken,
  }).then((result) => {
    if (!result) return res.sendStatus(404);
    const id = result._id;

    AuthPost.updateOne({ _id: id }, { $set: { refresh_token: null } }).then(
      () => {
        res.clearCookies("refreshToken");
        res.status(200).json({ message: "Berhasil" });
      }
    );
  });
};
