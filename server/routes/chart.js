const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const { Workspace, Chart } = require("../models");

router.use(express.json());

// Bro tryna make chart on workspace
// We know Bro is Bro (authenticateToken), but does bro own Workspace?
// Chek if bro id equals workspace's bro id

router.post("/create", authenticateToken, async (req, res) => {
  const { name, workspaceID } = req.body;
  console.log("making chart");

  try {
    const workspace = await Workspace.findOne({
      where: {
        workspaceID,
        userID: req.user.userID,
      },
    });

    if (workspace == null) {
      return res.status(404).send("Workspace does not exist or you are unauthorized");
    }

    const chart = await Chart.create({
      name,
      workspaceID,
      userID: req.user.userID,
    });

    console.log(chart.chartID);

    res.status(201).json({ chartID: chart.chartID, message: "Chart created successfuly" });
  } catch (err) {
    console.log(err);
    res.status(500).send("An unknown server error occured");
  }
});

router.get("/getData/:id", authenticateToken, async (req, res) => {

});

module.exports = router;
