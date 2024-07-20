const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const { Workspace, Chart } = require("../models");

router.use(express.json());

router.get("/getDisplay", authenticateToken, async (req, res) => {
  const workspaces = await Workspace.findAll({
    where: {
      userID: req.user.userID,
    },
  });

  res.status(201).json(workspaces);
});

router.post("/create", authenticateToken, async (req, res) => {
  const { name, isPublic } = req.body;
  const workspace = await Workspace.create({ name, isPublic, userID: req.user.userID });

  res.status(201).json( {workspaceID: workspace.workspaceID,message: "Workspace successfuly created"});
});

router.get("/getData/:workspaceID", authenticateToken, async (req, res) => {
  const data = await Workspace.findOne({
    where: { WorkspaceID: req.params.workspaceID },
  });

  try {
    if (data.userID != req.user.userID) {
      res.status(403).send("You do not have access to this workspace");
    }
  } catch (err) {
    res.status(404).send("Workspace not found");
  }

  res.status(200).json(data);
});

router.get("/getCharts/:workspaceID", authenticateToken, async (req, res) => {
  console.log(req.params.workspaceID);

  const workspace = await Workspace.findOne({
    where: { WorkspaceID: req.params.workspaceID, UserID: req.user.userID },
  });

  if (workspace == null) {
    res.status(404).json({ message: "Workspace does not exist or you are unauthorized" });
  }

  const charts = await Chart.findAll({
    where: { workspaceID: workspace.workspaceID },
  });

  res.status(200).json(charts);
});

module.exports = router;
