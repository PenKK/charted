require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const https = require("https");

const db = require("./models");
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

const sslOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/charted.mooo.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/charted.mooo.com/fullchain.pem"),
};

db.sequelize.sync().then(() => {
  https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at https://0.0.0.0:${PORT}/`);
  });
});
