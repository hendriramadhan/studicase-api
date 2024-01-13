const AuthPost = require("../models/auth");
const jwt = require("jsonwebtoken");

module.exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(404);

  AuthPost.findOne({
    refresh_token: refreshToken,
  }).then((result) => {
    if (!result) return res.sendStatus(404);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.sendStatus(403);

        const id = result._id;
        const nama = result.nama;
        const email = result.email;
        const accessToken = jwt.sign(
          { id, nama, email },
          proccess.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.json({ accessToken });
      }
    );
  });
};
