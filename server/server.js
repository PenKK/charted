require("dotenv").config();

const express = require("express");
const app = express();
const db = require("./models");
const authRoutes = require("./routes/auth");
const cors = require("cors");

app.use(cors());
app.use("/auth", authRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server running on 3000...");
  });
});
