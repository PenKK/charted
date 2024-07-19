const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const { Workspace } = require("../models");

router.use(express.json());

router.get("/getData", authenticateToken, async (req, res) => {
  const workspaceData = await Workspace.findAll({
    where: {
      userID: req.user.userID,
    },
  });

  console.log(workspaceData);

  res.status(201).json(workspaceData);
});

module.exports = router;
