const express = require("express");
const router = express.Router();
const { User, Sequelize } = require("../models");
const jwt = require("jsonwebtoken");

router.use(express.json());
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET),
    (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    };
}

router.post("/register", async (req, res) => {
  const userObject = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  try {
    await User.create(userObject);
    res.send("Account added successfully");
  } catch (err) {
    console.error(err);

    if (err instanceof Sequelize.UniqueConstraintError) {
      if (err.errors[0].path === "username") {
        return res.status(409).send("Username already exists. Please choose a different username.");
      }
      if (err.errors[0].path === "email") {
        return res.status(409).send("Email already exists. Please log in to the existing account instead.");
      } else {
        return res.status(409).send("Duplicate entry error. Please try again.");
      }
    } else {
      return res.status(500).send("An unexpected error occurred.");
    }
  }
});

router.get("/getPass", authenticateToken, (req, res) => {
  User.findAll().then(users => {
    res.send(users);
  });
});

router.get("/login", (req, res) => {
  const loginData = {
    username: "bob",
    password: "password",
    email: "bob@gmail.com",
  };

  const accessToken = jwt.sign({ username: loginData.username }, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

module.exports = router;
