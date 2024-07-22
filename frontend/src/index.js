function arrayRemove(arr, value) { 
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

//////*** React Stuff ***//////
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
ReactDOM.render(<App />, document.getElementById("reactApp"));

//////*** D3 Start ***//////
import { select, min, max, extent } from "d3";
import { FileToName } from './d3_modules/mappers';
import { loadAndProcessData } from "./d3_modules/loadAndProcessData";
import { analysisPanel } from "./d3_modules/analysisPanel/analysisPanel";
import { comparisonTypeOptions, rawAndResetButton } from "./d3_modules/analysisPanel/controllers";
import { parseAndDraw } from "./d3_modules/parseAndDraw";
import { differenceMetric } from "./d3_modules/differenceMetric";
import { rankingChart } from "./d3_modules/rankingChart";
import { keggTable } from "./d3_modules/keggTable";

// Define Variables
// const width = window.innerWidth;
// const height = window.innerHeight;

const heading = select("#menus").append("h2").text("Loading...");
const dataNameOne = select("#PanelOne").append("h5");
const dataNameTwo = select("#PanelTwo").append("h5");

//** States **//
// Common
let keggSymbolLookup;
let keggOrderLookup;
let minScaleValue;
let maxScaleValue;
let diffMetricsData;
let sortState = "Category";

// View specific
let proteinDataOne;
let proteinDataTwo;
let proteinDataFilteredOne;
let proteinDataFilteredTwo;
let LocToValOne;
let LocToValTwo;
let selectedComparisonType = 'Proteomics';

let userUploadedData = null;
let selectedKeggTerms = [];
let normalize = true;

let selectedDataOne = "../../static/data/3.exprs_agg_by_proteins/Brca_Luma_Tumor_Proteomics.exp.labeled";
let selectedDataTwo = "../../static/data/3.exprs_agg_by_proteins/Brca_Basal_Tumor_Proteomics.exp.labeled";
let cancerOne = FileToName[selectedDataOne];
let cancerTwo = FileToName[selectedDataTwo];;
let selectedLocAreaOne;
let selectedLocAreaTwo;

//** Event Handler Definition **//
const fetchBoth = async (selectedDataOne, selectedDataTwo) => {
  [proteinDataOne, keggSymbolLookup, keggOrderLookup, diffMetricsData] = await loadAndProcessData(selectedDataOne, userUploadedData);
  [proteinDataTwo, keggSymbolLookup, keggOrderLookup, diffMetricsData] = await loadAndProcessData(selectedDataTwo, userUploadedData);

  return [
    proteinDataOne,
    proteinDataTwo,
    keggSymbolLookup,
    keggOrderLookup,
    diffMetricsData,
  ];
};

const setCancerpair = (cancerPair) => {
  [cancerOne, cancerTwo] = cancerPair.split(", ");
  selectedDataOne = Object.keys(FileToName).find(
    (key) => FileToName[key] === cancerOne
  );
  selectedDataTwo = Object.keys(FileToName).find(
    (key) => FileToName[key] === cancerTwo
  );

  fetchBoth(selectedDataOne, selectedDataTwo).then((data) => {
    [
      proteinDataOne,
      proteinDataTwo,
      keggSymbolLookup,
      keggOrderLookup,
      diffMetricsData,
    ] = data;

    dataNameOne.text(cancerOne);
    dataNameTwo.text(cancerTwo);

    renderCommon();
    renderOne();
    renderTwo();
  });
};

const setSelectedComparisonType = comparisonType => {
  selectedComparisonType = comparisonType;
  renderCommon();
};

const setSelectedDataOne = (selectedDatatype) => {
  selectedDataOne = selectedDatatype;

  loadAndProcessData(selectedDataOne, userUploadedData).then((data) => {
    [proteinDataOne, keggSymbolLookup, keggOrderLookup, diffMetricsData] = data;
    dataNameOne.text(FileToName[selectedDatatype]);
    renderCommon();
    renderOne();
    renderTwo();
  });
};

const setSelectedDataTwo = (selectedDatatype) => {
  selectedDataTwo = selectedDatatype;

  loadAndProcessData(selectedDataTwo, userUploadedData).then((data) => {
    [proteinDataTwo, keggSymbolLookup, keggOrderLookup, diffMetricsData] = data;
    dataNameTwo.text(FileToName[selectedDatatype]);
    renderCommon();
    renderOne();
    renderTwo();
  });
};

const onResetButtonClick = () => {
  selectedDataOne = "../../static/data/3.exprs_agg_by_proteins/Brca_Luma_Tumor_Proteomics.exp.labeled";
  selectedDataTwo = "../../static/data/3.exprs_agg_by_proteins/Brca_Basal_Tumor_Proteomics.exp.labeled";
  selectedKeggTerms = [];
  selectedLocAreaOne = null;
  selectedLocAreaTwo = null;
  normalize = true;
  sortState = "Category";
  selectedComparisonType = 'Proteomics';
  renderCommon();
  renderOne();
  renderTwo();
};

const onNormalizeClick = () => {
  normalize = !normalize;
  renderCommon();
  renderOne();
  renderTwo();
};

const setSelectedKeggTerms = (keggTerm) => {
  selectedKeggTerms.push(keggTerm);
  
  renderCommon();
  renderOne();
  renderTwo();
};

const onCheckBoxClick = (target, row) => {
  if(target.checked){
    setSelectedKeggTerms(row.kegg);
  }else{
    selectedKeggTerms = arrayRemove(selectedKeggTerms, row.kegg);
    renderCommon();
    renderOne();
    renderTwo();
  };
};

const onSubCheckBoxClick = (target, selectedSubKeggs) => {
  if(target.checked){
    selectedKeggTerms = selectedKeggTerms.concat(selectedSubKeggs);
  }else{
    selectedSubKeggs.forEach(k => {
      if(selectedKeggTerms.includes(k)){
        selectedKeggTerms = arrayRemove(selectedKeggTerms, k)
      }
    });
  };
  renderCommon();
  renderOne();
  renderTwo();
};

const onTopCheckBoxClick = (target, selectedTopKeggs) => {
  if(target.checked){
    selectedKeggTerms = selectedKeggTerms.concat(selectedTopKeggs)
  }else{
    selectedTopKeggs.forEach(k => {
      if(selectedKeggTerms.includes(k)){
        selectedKeggTerms = arrayRemove(selectedKeggTerms, k)
      }
    });
  };
  renderCommon();
  renderOne();
  renderTwo();
};

const setSortState = selectedSortState => {
  sortState = selectedSortState;
  renderCommon();
};

const setSelectedLocAreaOne = (locArea) => {
  selectedLocAreaOne = locArea;
  renderOne();
};

const setSelectedLocAreaTwo = (locArea) => {
  selectedLocAreaTwo = locArea;
  renderTwo();
};


// Data Loading : load and process data & sets a state & invoke rendering
fetchBoth(selectedDataOne, selectedDataTwo).then((data) => {
  [ proteinDataOne, proteinDataTwo, keggSymbolLookup, keggOrderLookup, diffMetricsData ] = data;

  heading.text("Parameter Settings");
  dataNameOne.text(cancerOne);
  dataNameTwo.text(cancerTwo);

  renderCommon();
  renderOne();
  renderTwo();
});

//** Render **//
const renderCommon = () => {
  
  select("#menus").call(comparisonTypeOptions, {
    selectedComparisonType,
    setSelectedComparisonType,
    setSelectedDataOne,
    setSelectedDataTwo,
    selectedDataOne,
    selectedDataTwo
  });
  
  select("#menus").call(keggTable, {
    diffMetricsData,
    cancertypeOne: FileToName[selectedDataOne],
    cancertypeTwo: FileToName[selectedDataTwo],
    onCheckBoxClick,
    selectedKeggTerms,
    onSubCheckBoxClick,
    onTopCheckBoxClick,
    sortState,
    setSortState
  });

  select("#menus").call(rawAndResetButton, { onNormalizeClick, onResetButtonClick });

  select("#menus").call(rankingChart, {
    diffMetricsData,
    selectedKeggTerms,
    width: 450,  // $("#rankingChartSection").width(),
    height: 220, // $("#rankingChartSection").height()
    cancerOne,
    cancerTwo,
    setCancerpair,
  });

  //** Min, Max Scale Limit Value Calculation **//
  [proteinDataFilteredOne, LocToValOne] = parseAndDraw({
    proteinData: proteinDataOne,
    selectedKeggTerms: selectedKeggTerms,
    normalize,
  });
  
  [proteinDataFilteredTwo, LocToValTwo] = parseAndDraw({
    proteinData: proteinDataTwo,
    selectedKeggTerms: selectedKeggTerms,
    normalize,
  });
  
  select('#diff-metrics').call(differenceMetric, {
    diffMetricsData,
    cancertypeOne: FileToName[selectedDataOne],
    cancertypeTwo: FileToName[selectedDataTwo],
    selectedKeggTerms,
    // LocToValOne,
    // LocToValTwo,
    LocToValOne,
    LocToValTwo,
    proteinDataFilteredOne,
    proteinDataFilteredTwo
  });

  let [minOne, maxOne] = extent(LocToValOne, (d) => +d.exprs);
  let [minTwo, maxTwo] = extent(LocToValTwo, (d) => +d.exprs);

  minScaleValue = min([minOne, minTwo]);
  maxScaleValue = max([maxOne, maxTwo]);
};

const renderOne = () => {
  select('#panelOne').call(analysisPanel, {
    barMargin: { top: 40, right: -15, bottom: 20, left: 145 },
    // barMargin: { top: 40, right: 10, bottom: 20, left: 115 },
    cellMargin: { top: 10, right: 10, bottom: 10, left: 100 },
    proteinDataFiltered: proteinDataFilteredOne,
    LocToVal: LocToValOne,
    selectedLocArea: selectedLocAreaOne,
    setSelectedLocArea: setSelectedLocAreaOne,
    minScaleValue,
    maxScaleValue,
  });
};

const renderTwo = () => {
  select('#panelTwo').call(analysisPanel, {
    barMargin: { top: 40, right: -15, bottom: 20, left: 145 },
    cellMargin: { top: 10, right: 10, bottom: 10, left: 10 },
    proteinDataFiltered: proteinDataFilteredTwo,
    LocToVal: LocToValTwo,
    selectedLocArea: selectedLocAreaTwo,
    setSelectedLocArea: setSelectedLocAreaTwo,
    minScaleValue,
    maxScaleValue,
  });
};
