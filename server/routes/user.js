const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const { User } = require("../models");
const bcrypt = require("bcrypt");

router.use(express.json());

router.post("/changeUsername", authenticateToken, async (req, res) => {
  const newUsername = req.body.username;

  try {
    const user = await User.findOne({
      where: {
        userID: req.user.userID,
      },
    });

    user.username = newUsername;
    await user.save();
  } catch (err) {
    if (err.errors[0].path === "username") {
      return res.status(409).json({ message: "Username already exists, please choose a different one" });
    } else {
      return res.status(500).json({ message: "An unexpected error occured" });
    }
  }

  res.status(200).json({ newUsername });
});

router.post("/changeEmail", authenticateToken, async (req, res) => {
  const newEmail = req.body.email;

  try {
    const user = await User.findOne({
      where: {
        userID: req.user.userID,
      },
    });

    user.email = newEmail;
    await user.save();
  } catch (err) {
    if (err.errors[0].path === "email") {
      return res.status(409).json({ message: "This email already in use" });
    } else {
      return res.status(500).json({ message: "An unexpected error occured" });
    }
  }

  res.status(200).json({ newEmail });
});

router.post("/changePassword", authenticateToken, async (req, res) => {
  const { previousPassword, password } = req.body;

  const user = await User.findOne({
    where: {
      userID: req.user.userID,
    },
  });

  if (await bcrypt.compare(previousPassword, user.password)) {
    user.password = password && (await bcrypt.hash(password, 10));
    user.save();
    return res.status(200).json({ message: `Password changed successfully for userID ${user.userID}` });
  } else {
    return res.status(401).json({ message: "Previous password is invalid" });
  }
});

module.exports = router;
