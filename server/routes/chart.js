const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const { Workspace, Chart } = require("../models");
const crypto = require("crypto");

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

    res.status(201).json({ chartID: chart.chartID, message: "Chart created successfuly" });
  } catch (err) {
    console.log(err);
    res.status(500).send("An unknown server error occured");
  }
});

router.post("/createItem", authenticateToken, async (req, res) => {
  const { name, chartID } = req.body;

  const chart = await Chart.findOne({
    where: { chartID, userID: req.user.userID },
  });

  const newItemID = crypto.randomUUID();

  chart.items = [
    ...chart.items,
    {
      itemID: newItemID,
      name,
      description: "",
    },
  ];

  chart.save();

  return res.status(201).json({ itemID: newItemID, message: "Successfully created item" });
});

router.post("/moveItem", authenticateToken, async (req, res) => {
  const { toChartID, itemID, fromChartID } = req.body;

  const fromChart = await Chart.findOne({
    where: {
      chartID: fromChartID,
    },
  });

  const toChart = await Chart.findOne({
    where: {
      chartID: toChartID,
    },
  });

  if (fromChart.items.findIndex(item => item.itemID == itemID) == -1) {
    console.log("stuff not found ye");
    console.log(`From chart ${fromChart.name} to ${toChart.name}\nSearching for itemID ${itemID}`);
    console.log(`\n${JSON.stringify(fromChart.items)}\n\n${JSON.stringify(toChart.items)}`);
  }

  const targetItem = fromChart.items.splice(
    fromChart.items.findIndex(item => item.itemID == itemID),
    1
  );

  toChart.items = [...toChart.items, targetItem[0]];

  fromChart.changed("items", true);
  toChart.changed("items", true);
  fromChart.save();
  toChart.save();

  res.send(200);
});

module.exports = router;
