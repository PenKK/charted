require("dotenv").config();

const express = require("express");
const fs = require("fs");
const app = express();

const cors = require("cors");
const https = require("https");

const db = require("./models");
const authRoutes = require("./routes/auth");
const workspaceRoutes = require("./routes/workspace");
const chartRoutes = require("./routes/chart");
const userRoutes = require("./routes/user");

const developmentMode = process.env.NODE_ENV === "development";

app.use(
  cors({
    origin: developmentMode ? "http://localhost:5173" : "https://charted.mooo.com",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use("/auth", authRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/chart", chartRoutes);
app.use("/user", userRoutes);
app.get("/health", (req, res) => res.send("API running"));

if (developmentMode) {
  console.log("DEVELOPMENT MODE");
  db.sequelize.sync().then(() => {
    app.listen(3001, "0.0.0.0", () => {
      console.log(`Server running on port 3001`);
    });
  });
  return;
}

const PORT = 3000;

const sslOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/charted.mooo.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/charted.mooo.com/fullchain.pem"),
};

db.sequelize.sync().then(() => {
  https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});
