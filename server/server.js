require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const db = require("./models");
const authRoutes = require("./routes/auth");
const workspaceRoutes = require("./routes/workspace");
const chartRoutes = require("./routes/chart");
const userRoutes = require("./routes/user");

const developmentMode = process.env.NODE_ENV === "development";
const PORT = developmentMode ? 3001 : 3000; // Use 3000 for production, 3001 for dev

app.set('trust proxy', 1);
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


db.sequelize.sync().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${developmentMode ? "development" : "production"} mode`);
  });
});