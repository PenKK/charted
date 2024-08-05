import item from "../assets/item.svg";
import triangle from "../assets/triangle.svg";
import text from "../assets/text.svg";
import card from "../assets/card.svg";
import list from "../assets/list.svg";
import exit from "../assets/exit.svg";
import "./css/chart.css";
import { createItem, createChart, deleteItem, deleteChart, setItemDescription, moveItem } from "../util/API";
import { useState, useEffect, useRef } from "react";
import { isOverflown } from "../util/Util";

export default function ChartArea({ workspaceID, charts, setCharts }) {
  const [itemInfoOpen, setItemInfoOpen] = useState(false);
  const [currentItemInfo, setCurrentItemInfo] = useState({});

  const descriptionAreaRef = useRef(null);

  async function handleChartSubmit(e) {
    e.preventDefault();
    const formElements = Object.fromEntries(new FormData(e.target));
    formElements.workspaceID = workspaceID;
    formElements.name = formElements.chartName;

    let tempID = -new Date().getUTCMilliseconds();

    createClientChart(formElements.chartName, tempID);
    const chartCreation = await createChart(formElements);
    updateClientChartID(tempID, chartCreation.chartID);
  }

  useEffect(() => {
    const keyPressEvent = e => {
      if (e.key === "Escape") {
        setItemInfoOpen(false);
      }
    };

    if (itemInfoOpen) {
      document.addEventListener("keydown", keyPressEvent);
    }

    return () => {
      document.removeEventListener("keydown", keyPressEvent);
    };
  }, [() => setItemInfoOpen(false)]);

  return (
    <>
      {/* <div className="charts-taskbar" /> */}

      <div className="chart-container gap-3">
        {charts.map(chart => (
          <Chart title={chart.name} chartID={chart.chartID} key={chart.chartID}>
            {chart.items.map(item => (
              <Item key={item.itemID} name={item.name} itemID={item.itemID} chartID={chart.chartID} description={item.description} />
            ))}
          </Chart>
        ))}
        <Chart title={"Create new chart"} creationChart={"true"}>
          <input name="chartName" type="text" className="new-item-input form-control" placeholder="Chart name" />
        </Chart>
        <div className="horizontal-padding-bruh"></div>
      </div>

      <ItemDetails />
    </>
  );

  function ItemDetails() {
    return (
      <div className={`item-details-backdrop w-100 h-100 position-absolute top-0 d-flex justify-content-center ${itemInfoOpen ? "item-details-bg" : "pe-none"}`}>
        {itemInfoOpen && (
          <div className="item-details-container">
            <div className="d-flex ">
              <div className="item-details-row">
                <img src={card} className="item-details-title-card" />
                <h4>{currentItemInfo.name}</h4>
                <h6 className="font-color-1">
                  &nbsp;in <u>{currentItemInfo.chartName}</u>
                </h6>
              </div>
              <img src={exit} role="button" className="desc-exit" onClick={() => setItemInfoOpen(false)} />
            </div>

            <div className="item-details-row">
              <img src={text} className="item-details-title-card" />
              <h4>Description</h4>
            </div>
            <div className="d-flex justify-content-center align-content-center">
              {currentItemInfo.description == "" ? (
                <div
                  className="description-area"
                  role="button"
                  onClick={() => {
                    setCurrentItemInfo({ ...currentItemInfo, description: " " });
                  }}
                >
                  <h6>Add details...</h6>
                </div>
              ) : (
                <textarea ref={descriptionAreaRef} defaultValue={currentItemInfo.description} autoFocus={currentItemInfo.description == " "} name="description" className="description-text" />
              )}
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <button className="btn description-btn" onClick={saveDescription}>
                  <h4>Save</h4>
                </button>
                <button className="btn description-btn" onClick={cancelDescription}>
                  <h4>Cancel</h4>
                </button>
              </div>
              <button className="btn description-btn" onClick={() => handleDeleteItem(currentItemInfo.chartID, currentItemInfo.id)}>
                <h4>Delete item</h4>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function handleDeleteItem(chartID, itemID) {
    deleteClientItem(chartID, itemID);
    deleteItem(itemID, chartID);
  }

  function openItemInfo(chartID, itemID) {
    const chart = charts.find(chart => chart.chartID == chartID);
    const item = chart.items.find(item => item.itemID == itemID);
    setCurrentItemInfo({ ...item, chartID, chartName: chart.name });
    setItemInfoOpen(true);
  }

  async function saveDescription() {
    const newDescription = descriptionAreaRef.current.value;
    setCurrentItemInfo({ ...currentItemInfo, description: newDescription });
    setClientItemDescription(currentItemInfo.chartID, currentItemInfo.itemID, newDescription);
    await setItemDescription({ newDescription, chartID: currentItemInfo.chartID, itemID: currentItemInfo.itemID });
  }

  function cancelDescription() {
    setCurrentItemInfo({ ...currentItemInfo });
  }

  function TaskbarButton(props) {
    return (
      <button onClick={props.func} className="taskbar-button">
        {props.label}
      </button>
    );
  }

  function Chart(props) {
    const [scrollIconUp, setScrollIconUp] = useState(false);
    const [scrollIconDown, setScrollIconDown] = useState(false);
    const checkOverFlowRef = useRef(null);

    useEffect(() => {
      if (isOverflown(checkOverFlowRef.current)) {
        setScrollIconDown(true);
      }
    }, []);

    function checkOverflow(e) {
      const scrollPercent = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);

      if (scrollPercent <= 0.05) {
        setScrollIconUp(false);
        setScrollIconDown(true);
      } else if (scrollPercent >= 0.95) {
        setScrollIconUp(true);
        setScrollIconDown(false);
      } else {
        setScrollIconUp(true);
        setScrollIconDown(true);
      }
    }

    async function handleItemSubmit(e) {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      let tempID = -new Date().getUTCMilliseconds();

      createClientItem(formData.chartID, { name: formData.name, itemID: tempID, description: "" });
      const itemCreation = await createItem(formData);
      updateClientItemID(formData.chartID, tempID, itemCreation.itemID);
    }

    return (
      <div className="chart" onDrop={e => handleOnDrop(e, props.chartID)} onDragOver={props.creationChart ? null : handleDragOver}>
        <div className="chart-bg">
          <div className="chart-header-container">
            <h4 className="chart-header">{props.title}</h4>
            {!props.creationChart && <img src={exit} className="chart-exit-icon" role="button" onClick={() => handleDeleteChart(props.chartID)} />}
          </div>
          <span className="d-flex justify-content-center w-100">
            <img className={` scroll-icon scroll-icon ${!scrollIconUp && "opacity-0"}`} src={triangle} alt="" />
          </span>
          <div onScroll={checkOverflow} ref={checkOverFlowRef} className=" chart-item-container">
            {!props.creationChart && props.children}
          </div>
          <span className=" d-flex justify-content-center w-100">
            <img className={`scroll-icon scroll-icon-down ${!scrollIconDown && "opacity-0"}`} src={triangle} alt="" />
          </span>

          <form onSubmit={props.creationChart ? handleChartSubmit : handleItemSubmit} className="d-flex justify-content-center">
            <input type="text" name="chartID" value={props.chartID} hidden readOnly />
            {props.creationChart ? props.children : <input type="text" name="name" placeholder="New item" required className="new-item-input form-control" />}
            <input type="submit" hidden />
          </form>
        </div>
      </div>
    );
  }

  function Item(props) {
    return (
      <div
        role="button"
        className="chart-item"
        draggable={!props.creationChart && props.chartID >= 0}
        onDragStart={e => handleOnDrag(e, { itemID: props.itemID, name: props.name, description: props.description }, props.chartID)}
      >
        <div className="d-flex flex-row chart-item-header-container">
          <img src={item} className="item-img" />
          <h4 className={"item-header"}>{props.name}</h4>
          <img src={list} className="item-img" onClick={() => openItemInfo(props.chartID, props.itemID)} />
        </div>
      </div>
    );
  }

  function handleDeleteChart(chartID) {
    deleteClientChart(chartID);
    deleteChart({ chartID });
  }

  function handleOnDrag(e, itemObject, chartID) {
    e.dataTransfer.setData("itemObject", JSON.stringify(itemObject));
    e.dataTransfer.setData("originChartID", chartID);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function handleOnDrop(e, onDropChartID) {
    const itemObject = JSON.parse(e.dataTransfer.getData("itemObject"));
    const fromChartID = e.dataTransfer.getData("originChartID");

    if (onDropChartID == fromChartID) {
      return;
    }

    createClientItem(onDropChartID, itemObject); // Create duplicate item (client), atp the new item will have old id
    deleteClientItem(fromChartID, itemObject.itemID); // Delete from old chart (client)

    const moveDBItem = await moveItem({ toChartID: onDropChartID, itemID: itemObject.itemID, fromChartID });
  }

  /* CLIENT DISPLAY UTIL */

  function setClientItemDescription(chartID, itemID, newDescription) {
    let modifiedCharts = [...charts];
    modifiedCharts.find(chart => chart.chartID === chartID).items.find(item => item.itemID === itemID).description = newDescription;
    setCharts([...modifiedCharts]);
  }

  function deleteClientChart(chardID) {
    let modifiedCharts = [...charts];
    modifiedCharts.splice(
      modifiedCharts.findIndex(chart => chart.chartID == chardID),
      1
    );
    setCharts([...modifiedCharts]);
  }

  function createClientChart(chartName, chartID) {
    let modifiedCharts = charts; // Updating id only works when this is without spread operator?????????????
    modifiedCharts.push({ name: chartName, chartID: chartID, createdDate: null, items: [] });
    setCharts([...modifiedCharts]);
  }

  function createClientItem(chartID, itemObject) {
    let modifiedCharts = [...charts];
    modifiedCharts.find(chart => chart.chartID == chartID).items.push(itemObject);
    setCharts([...modifiedCharts]);
  }

  function updateClientItemID(chartID, itemID, newID) {
    let modifiedCharts = [...charts];

    modifiedCharts.find(chart => chart.chartID == chartID).items.find(item => item.itemID == itemID).itemID = newID;
    setCharts([...modifiedCharts]);
  }

  function updateClientChartID(chartID, newID) {
    let modifiedCharts = [...charts];
    modifiedCharts.find(chart => chart.chartID === chartID).chartID = newID;
    setCharts([...modifiedCharts]);
  }

  function deleteClientItem(chartID, itemID) {
    let modifiedCharts = [...charts];
    let targetItems = modifiedCharts.find(chart => chart.chartID == chartID).items;

    targetItems.splice(
      targetItems.findIndex(item => item.itemID == itemID),
      1
    );

    setCharts([...modifiedCharts]);
  }
}
