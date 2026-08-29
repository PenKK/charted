const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const { Workspace, Chart } = require("../models");
const crypto = require("crypto");

router.use(express.json());

function getItemsArray(chart) {
  if (Array.isArray(chart.items)) return chart.items;
  try {
    const parsed = JSON.parse(chart.items || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setItemsArray(chart, itemsArray) {
  chart.items = itemsArray;
  chart.changed("items", true);
}

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

  await chart.destroy();

  res.status(200).send(`Chart with ID ${chartID} has been deleted`);
});

router.post("/createItem", authenticateToken, async (req, res) => {
  const { name, chartID } = req.body;

  const chart = await Chart.findOne({
    where: { chartID, userID: req.user.userID },
  });

  if (!chart) {
    return res.status(404).send("Chart not found");
  }

  const newItemID = crypto.randomUUID();
  const items = getItemsArray(chart);
  items.push({
    itemID: newItemID,
    name,
    description: "",
  });
  setItemsArray(chart, items);
  await chart.save();

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

  const items = getItemsArray(chart);
  const idx = items.findIndex(item => item.itemID == itemID);
  if (idx === -1) {
    return res.status(404).send("Item not found");
  }
  items.splice(idx, 1);
  setItemsArray(chart, items);
  await chart.save();

  res.sendStatus(200);
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

  if (!fromChart || !toChart) {
    return res.status(404).send("Chart not found");
  }

  const fromItems = getItemsArray(fromChart);
  const toItems = getItemsArray(toChart);

  const idx = fromItems.findIndex(item => item.itemID == itemID);
  if (idx === -1) {
    return res.status(404).send("Item not found");
  }
  const [targetItem] = fromItems.splice(idx, 1);
  toItems.push(targetItem);

  setItemsArray(fromChart, fromItems);
  setItemsArray(toChart, toItems);
  await fromChart.save();
  await toChart.save();

  res.sendStatus(200);
});

router.post("/changeDescription", authenticateToken, async (req, res) => {
  const { itemID, chartID, newDescription } = req.body;

  const chart = await Chart.findOne({
    where: { chartID, userID: req.user.userID },
  });

  if (!chart) {
    return res.status(404).send("Chart not found");
  }

  const items = getItemsArray(chart);
  const item = items.find(it => it.itemID == itemID);
  if (!item) {
    return res.status(404).send("Item not found");
  }
  item.description = newDescription;
  setItemsArray(chart, items);
  await chart.save();

  return res.status(200).json({ message: "Successfully updated description of item" });
});

module.exports = router;