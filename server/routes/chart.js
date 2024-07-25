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

router.post("/delete", authenticateToken, async (req, res) => {
  const { chartID } = req.body;

  const chart = await Chart.findOne({ where: { chartID } });

  if (chart == null) return res.status(404).send("Could not delete the chart as it was not found");

  if (chart.userID != req.user.userID) return res.status(401).send("You are not authorized to delete this chart");

  chart.destroy();

  res.status(200).send(`Chart with ID ${chartID} has been deleted`);
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

router.post("/deleteItem", authenticateToken, async (req, res) => {
  const { itemID, chartID } = req.body;

  const chart = await Chart.findOne({ where: { chartID } });

  if (chart == null) {
    return res.status(404).send("Chart not found");
  }

  if (chart.userID != req.user.userID) {
    return res.status(401).send("You are not authorized to delete this item");
  }

  chart.items.splice(
    chart.items.findIndex(item => item.itemID == itemID),
    1
  );

  chart.changed("items", true);
  chart.save();

  res.send(200);
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

router.post("/changeDescription", authenticateToken, async (req, res) => {
  const { itemID, chartID, newDescription } = req.body;

  const chart = await Chart.findOne({
    where: { chartID, userID: req.user.userID },
  });

  chart.items.find(item => item.itemID == itemID).description = newDescription;
  chart.changed("items", true);
  chart.save();

  return res.status(200).json({ message: "Successfully updated description of item" });
});

module.exports = router;
