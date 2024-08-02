require("dotenv").config();

const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const workspaceRoutes = require("./routes/workspace");
const chartRoutes = require("./routes/chart");
const userRoutes = require("./routes/user");

app.use(
  cors({
    origin: "https://charted.mooo.com",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use("/auth", authRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/chart", chartRoutes);
app.use("/user", userRoutes);

const PORT = 3000;

db.sequelize.sync().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
  });
});
