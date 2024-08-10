const express = require("express");
const router = express.Router();
const { User, Sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const dayjs = require("dayjs");

router.use(express.json());
router.use(cookieParser());

function clearCookies(response) {
  response.cookie("api-auth", "", {
    secure: true,
    httpOnly: true,
    expires: dayjs().toDate(),
  });

  response.cookie("username", "", {
    secure: true,
    expires: dayjs().toDate(),
  });

  response.cookie("email", "", {
    secure: true,
    expires: dayjs().toDate(),
  });
}

function authenticateToken(req, res, next) {
  try {
    const token = req.headers["cookie"]
      .split(`; `)
      .find(row => row.startsWith("api-auth="))
      .split("=")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        clearCookies(res);
        return res.sendStatus(401).send("Invalid api-auth key");
      }

      req.user = user;
      next();
    });
  } catch (error) {
    clearCookies(res);
    return res.status(401).send("Error reading api-auth key");
  }
}

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const userObject = {
    username,
    email,
    password: password && (await bcrypt.hash(password, 10)),
  };

  try {
    await User.create(userObject);
    res.send("Account created successfully");
  } catch (err) {
    console.log(err);
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(404).send("Invalid email or password");
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return res.status(404).send("Invalid email or password");
  }

  const jwtToken = jwt.sign({ userID: user.userID }, process.env.ACCESS_TOKEN_SECRET);

  res.cookie("api-auth", jwtToken, {
    secure: true,
    httpOnly: true,
    expires: dayjs().add(7, "days").toDate(),
    sameSite: "none",
  });

  res.cookie("username", user.username, {
    secure: true,
    expires: dayjs().add(7, "days").toDate(),
    sameSite: "none",
  });

  res.cookie("email", user.email, {
    secure: true,
    expires: dayjs().add(7, "days").toDate(),
    sameSite: "none",
  });

  console.log(user.email);
  

  res.status(200).json({ message: `Login successful` });
});

router.post("/logout", (req, res) => {
  clearCookies(res);
  res.sendStatus(200);
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
