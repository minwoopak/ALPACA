import { FileToName, sampleDatasetList } from '../mappers';

export const comparisonTypeOptions = (selection, props) => {
  const {
    selectedComparisonType, 
    setSelectedComparisonType, 
    selectedDataOne, 
    selectedDataTwo, 
    setSelectedDataOne, 
    setSelectedDataTwo
  } = props;
  // Container div
  const comparisonSelect = selection.selectAll(".comparison-select").data([null]);
  const comparisonSelectEnter = comparisonSelect.enter()
    .append('div')
      .classed('comparison-select', true);
  // Container div > Container Table
  const comparisonTableEnter = comparisonSelectEnter
    .append('table')
      .classed('comparison-table', true);
  // Container div > Container Table > tr
  const comparisonTableRowEnter = comparisonTableEnter
    .append('tr')
     .classed('comparison-row', true);
  // Container div > Container Table > tr > td (Menu Name)
  const comparisonTypeInfo = comparisonTableRowEnter
    .append('td').attr('id', 'comparison-name');
  comparisonTypeInfo
    .append('div')
      .text('Between Cancer Comparison: ');
  comparisonTypeInfo
    .append('div')
      .text('Within Cancer Comparison: ');
  // Container div > Container Table > tr > td (Container for Radios)
  const comparisonOptionsEnter = comparisonTableRowEnter
    .append('td')
      .attr('class', 'comparison-option-td');
  const comparisonOptions = comparisonSelect.select('.comparison-option-td');
  // Container div > Container Table > tr > td > divs (Options for each radio)
  const comparisonOptionsDiv =  comparisonOptions.merge(comparisonOptionsEnter)
    .selectAll('.comparison-option-div').data(['Proteomics', 'Transcriptomics', 'Trans vs Prot'], d=>d);
  const comparisonOptionsDivEnter = comparisonOptionsDiv.enter()
    .append('div')
      .attr('class', 'comparison-option-div');
  comparisonOptionsDivEnter
    .merge(comparisonOptionsDiv)
      .on("change", (e) => {
        setSelectedComparisonType(e.target.value);
        if (e.target.value === 'Transcriptomics'){
          let cancerOneFile = Object.keys(FileToName).find(key => FileToName[key] === 'Brca LumA Tumor Transcriptomics');
          let cancerTwoFile = Object.keys(FileToName).find(key => FileToName[key] === 'Brca Basal Tumor Transcriptomics');
          setSelectedDataOne(cancerOneFile);
          setSelectedDataTwo(cancerTwoFile);
        }else if (e.target.value === 'Proteomics'){
          let cancerOneFile = Object.keys(FileToName).find(key => FileToName[key] === 'Brca LumA Tumor Proteomics');
          let cancerTwoFile = Object.keys(FileToName).find(key => FileToName[key] === 'Brca Basal Tumor Proteomics');
          setSelectedDataOne(cancerOneFile);
          setSelectedDataTwo(cancerTwoFile);
        }else if (e.target.value === 'Trans vs Prot') {
          let cancerOneFile = Object.keys(FileToName).find(key => FileToName[key] === 'Brca Basal Tumor Transcriptomics');
          let cancerTwoFile = Object.keys(FileToName).find(key => FileToName[key] === 'Brca Basal Tumor Proteomics');
          setSelectedDataOne(cancerOneFile);
          setSelectedDataTwo(cancerTwoFile);
        };
      });
  // Container div > Container Table > tr > td > div (each) > radio
  comparisonOptionsDivEnter
    .append('input')
      .attr('class', 'comparison-option-radio')
      .attr('type', 'radio')
      .attr('name', 'comparison-option-radio')
    .merge(comparisonOptionsDiv.select('.comparison-option-radio'))
      .property('checked', d => d === selectedComparisonType)
      .attr('id', d => 'option-'+d)
      .attr('value', d => d);
  // Container div > Container Table > tr > td > div (each) > label
  comparisonOptionsDivEnter
    .append('label')
      .attr('class', 'comparison-option-label')
    .merge(comparisonOptionsDiv.select('.comparison-option-label'))
      .attr('for', d => 'option-'+d)
      .text(d => d);
  
  // DataType Dropdowns : Cancer1, Cancer2
  const dataSelectDivEnter = comparisonSelectEnter
    .append('div')
      .attr('class', 'datatype-menu-div');
  const dataSelectDiv = comparisonSelect.select('.datatype-menu-div')

  if (selectedComparisonType === 'Proteomics'){
    const dataOptionList = sampleDatasetList.filter(d => {
      const nameList = d.dataName.split(' ');
      const omics = nameList[nameList.length-1]
      return omics === 'Proteomics'
    });

    const dataSelectDivInner = dataSelectDiv.merge(dataSelectDivEnter).selectAll('.datatype-menu-div-inner').data([selectedComparisonType], d=>d);
    dataSelectDivInner.exit().remove();
    const dataSelectDivInnerEnter = dataSelectDivInner.enter().append('div').attr('class', 'datatype-menu-div-inner');

    //// Data Dropdown: Cancer1
    const dataSelectMenuOneEnter = dataSelectDivInnerEnter
      .append('div')
        .attr('class', 'datatype-menu-one');
    dataSelectMenuOneEnter.append('label').attr('class', 'datatype-menu-label-one mr-3').text('Choose Data 1: ');
    // Dropdown div > select
    const dataSelectDropdownOneEnter = dataSelectMenuOneEnter
      .append('select')
        .attr('class', 'datatype-menu-dropdown-one');
    const dataSelectDropdownOne = comparisonSelect.select('.datatype-menu-dropdown-one');
    dataSelectDropdownOneEnter
      .merge(dataSelectDropdownOne)
        .on("change", function () {
          setSelectedDataOne(this.value);
        });
    
    // Dropdown div > select > options
    const dataSelectDropdownOptionOne = dataSelectDropdownOne.merge(dataSelectDropdownOneEnter)
      .selectAll('option').data(dataOptionList);
    dataSelectDropdownOptionOne.enter()
      .append('option')
      .merge(dataSelectDropdownOptionOne)
        .attr('value', d => d.fileName)
        .property('selected', d => d.fileName === selectedDataOne)
        .text(d => d.dataName);

    //// Data Dropdown: Cancer2
    const dataSelectMenuTwoEnter = dataSelectDivInnerEnter
      .append('div')
        .attr('class', 'datatype-menu-two');
    dataSelectMenuTwoEnter.append('label').attr('class', 'datatype-menu-label-two mr-3').text('Choose Data 2: ');
    // Dropdown div > select
    
    const dataSelectDropdownTwoEnter = dataSelectMenuTwoEnter
      .append('select')
        .attr('class', 'datatype-menu-dropdown-two');
    const dataSelectDropdownTwo = comparisonSelect.select('.datatype-menu-dropdown-two');
    dataSelectDropdownTwoEnter
      .merge(dataSelectDropdownTwo)
        .on("change", function () {
          setSelectedDataTwo(this.value);
        });
    
    // Dropdown div > select > options
    const dataSelectDropdownOptionTwo = dataSelectDropdownTwo.merge(dataSelectDropdownTwoEnter)
      .selectAll('option').data(dataOptionList);
    dataSelectDropdownOptionTwo.enter()
      .append('option')
      .merge(dataSelectDropdownOptionTwo)
        .attr('value', d => d.fileName)
        .property('selected', d => d.fileName === selectedDataTwo)
        .text(d => d.dataName);

  } else if (selectedComparisonType === 'Transcriptomics'){
    const dataOptionList = sampleDatasetList.filter(d => {
      const nameList = d.dataName.split(' ');
      const omics = nameList[nameList.length-1]
      return omics === 'Transcriptomics'
    });
    
    const dataSelectDivInner = dataSelectDiv.merge(dataSelectDivEnter).selectAll('.datatype-menu-div-inner').data([selectedComparisonType], d=>d);
    dataSelectDivInner.exit().remove();
    const dataSelectDivInnerEnter = dataSelectDivInner.enter().append('div').attr('class', 'datatype-menu-div-inner');

    //// Data Dropdown: Cancer1
    const dataSelectMenuOneEnter = dataSelectDivInnerEnter
      .append('div')
        .attr('class', 'datatype-menu-one');
    dataSelectMenuOneEnter.append('label').attr('class', 'datatype-menu-label-one mr-3').text('Choose Data 1: ');
    // Dropdown div > select
    const dataSelectDropdownOneEnter = dataSelectMenuOneEnter
      .append('select')
        .attr('class', 'datatype-menu-dropdown-one');
    const dataSelectDropdownOne = comparisonSelect.select('.datatype-menu-dropdown-one');
    dataSelectDropdownOneEnter
      .merge(dataSelectDropdownOne)
        .on("change", function () {
          setSelectedDataOne(this.value);
        });
    // Dropdown div > select > options
    const dataSelectDropdownOptionOne = dataSelectDropdownOne.merge(dataSelectDropdownOneEnter)
      .selectAll('option').data(dataOptionList);
    dataSelectDropdownOptionOne.enter()
      .append('option')
      .merge(dataSelectDropdownOptionOne)
        .attr('value', d => d.fileName)
        .property('selected', d => d.fileName === selectedDataOne)
        .text(d => d.dataName);

    //// Data Dropdown: Cancer2
    const dataSelectMenuTwoEnter = dataSelectDivInnerEnter
      .append('div')
        .attr('class', 'datatype-menu-two');
    dataSelectMenuTwoEnter.append('label').attr('class', 'datatype-menu-label-two mr-3').text('Choose Data 2: ');
    // Dropdown div > select
    const dataSelectDropdownTwoEnter = dataSelectMenuTwoEnter
      .append('select')
        .attr('class', 'datatype-menu-dropdown-two');
    const dataSelectDropdownTwo = comparisonSelect.select('.datatype-menu-dropdown-two');
    dataSelectDropdownTwoEnter
      .merge(dataSelectDropdownTwo)
        .on("change", function () {
          setSelectedDataTwo(this.value);
        });
    
    // Dropdown div > select > options
    const dataSelectDropdownOptionTwo = dataSelectDropdownTwo.merge(dataSelectDropdownTwoEnter)
      .selectAll('option').data(dataOptionList);
    dataSelectDropdownOptionTwo.enter()
      .append('option')
      .merge(dataSelectDropdownOptionTwo)
        .attr('value', d => d.fileName)
        .property('selected', d => d.fileName === selectedDataTwo)
        .text(d => d.dataName);

  } else if (selectedComparisonType === 'Trans vs Prot') {
    const dataList = sampleDatasetList.map(d => {
      const nameList = d.dataName.split(' ');
      const omics = nameList.slice(0, nameList.length-1).join(' ');
      return omics
    });
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    const dataOptionList = dataList.filter(onlyUnique);

    const dataSelectDivInner = dataSelectDiv.merge(dataSelectDivEnter).selectAll('.datatype-menu-div-inner').data([selectedComparisonType], d=>d);
    dataSelectDivInner.exit().remove();
    const dataSelectDivInnerEnter = dataSelectDivInner.enter().append('div').attr('class', 'datatype-menu-div-inner');

    // Data Dropdown: both Cancers
    const dataSelectMenuEnter = dataSelectDivInnerEnter
      .append('div')
        .attr('class', 'datatype-menu');
    
    dataSelectMenuEnter.append('label').attr('class', 'datatype-menu-label mr-3').text('Choose Data: ');

    // Dropdown div > select
    const dataSelectDropdownEnter = dataSelectMenuEnter
      .append('select')
        .attr('class', 'datatype-menu-dropdown');
    const dataSelectDropdown = comparisonSelect.select('.datatype-menu-dropdown');

    dataSelectDropdownEnter
      .merge(dataSelectDropdown)
        .on("change", function () {
          // Set Both Selected Data
          const cancerData1 = this.value + " Transcriptomics";
          const cancerData2 = this.value + " Proteomics";
          setSelectedDataOne(sampleDatasetList.filter(d => d.dataName === cancerData1)[0].fileName);
          setSelectedDataTwo(sampleDatasetList.filter(d => d.dataName === cancerData2)[0].fileName);
        });

    // Dropdown div > select > options
    const dataSelectDropdownOption = dataSelectDropdown.merge(dataSelectDropdownEnter)
      .selectAll('option').data(dataOptionList);
    dataSelectDropdownOption.enter()
      .append('option')
      .merge(dataSelectDropdownOption)
        .attr('value', d => d)
        .property('selected', d => d === selectedDataOne)
        .text(d => d);
  };
};

export const rawAndResetButton = (selection, { onNormalizeClick, onResetButtonClick }) => {
  // Raw (/Normalize) Button
  const controlButtonsDiv = selection.selectAll('.control-button-div').data([null]);
  const controlButtonsDivEnter = controlButtonsDiv.enter().append('div').attr('class', 'control-button-div');
  controlButtonsDivEnter.selectAll(".normalizeButton").data([null])
    .enter().append("button")
      .attr("class", "normalizeButton btn btn-outline-info")
      .attr("type", "button")
      .text("Raw")
      .on("click", onNormalizeClick);

  // Reset Button
  controlButtonsDivEnter.selectAll(".resetButton").data([null])
    .enter().append("button")
      .attr("class", "btn btn-outline-info resetButton")
      .attr("type", "button")
      .text("Reset Parameters")
      .on("click", onResetButtonClick);
};

