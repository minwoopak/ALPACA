import { cellColor } from "./cellColor";
import { barChart } from "./barChart";
import { proteinTable } from "./proteinTable";

const topNumProteins = 100;
const cellSvgWidth = 500;
const cellSvgHeight = 250;
const barChartWidth = 570;
const barChartHeight = 310;

export const analysisPanel = (selection, props) => {
  let {
    barMargin,
    cellMargin,
    proteinDataFiltered,
    LocToVal,
    selectedLocArea,
    setSelectedLocArea,
    minScaleValue,
    maxScaleValue,
  } = props;

  //** Controllers **//
  // const controllers = selection.selectAll(".controllers").data([null]);
  // const controllerSelection = controllers
  //   .enter()
  //   .append("div")
  //   .attr("class", "controllers")
  //   .merge(controllers);

  //** Diagrams **//
  selection.call(cellColor, {
    minScaleValue,
    maxScaleValue,
    margin: cellMargin,
    width: cellSvgWidth,
    height: cellSvgHeight,
    inputData: LocToVal,
    selectedLocArea,
    setSelectedLocArea,
  });

  selection.call(barChart, {
    minScaleValue,
    maxScaleValue,
    height: barChartHeight,
    width: barChartWidth,
    margin: barMargin,
    data: LocToVal,
    selectedLocArea,
    setSelectedLocArea,
  });

  selection.call(proteinTable, {
    proteinDataFiltered,
    topNumProteins,
    selectedLocArea,
  });
};
