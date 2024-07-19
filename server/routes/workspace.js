const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const { Workspace } = require("../models");

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
  await Workspace.create({ name, isPublic, userID: req.user.userID });
});

router.post("/getData", authenticateToken, async (req, res) => {
  const { workspaceID } = req.body;
  const data = await Workspace.findOne({
    where: { workspaceID },
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

module.exports = router;
