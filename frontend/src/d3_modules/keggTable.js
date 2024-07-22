import { format, ascending, descending, range } from 'd3';

export const keggTable = (selection, props) => {
  const { 
    diffMetricsData,
    cancertypeOne,
    cancertypeTwo,
    onCheckBoxClick,
    selectedKeggTerms,
    onSubCheckBoxClick,
    onTopCheckBoxClick,
    sortState,
    setSortState
  } = props;

  ////**** Fetch Pre-calculated Difference Metrics by Python ****////
  const diffMetricsCancerPair = diffMetricsData.filter(
    (d) =>
      (d.cancer1 === cancertypeOne && d.cancer2 === cancertypeTwo) ||
      (d.cancer1 === cancertypeTwo && d.cancer2 === cancertypeOne)
  );

  // Top Category Data
  let unique_XT = [];
  let topCatData = [];
  diffMetricsCancerPair.forEach(d => {
    if(!unique_XT.includes(d.XT)){
      unique_XT.push(d.XT);
      topCatData.push(d);
    }
  });

  // Sub Category Data
  let unique_XS = [];
  let subCatData = [];
  diffMetricsCancerPair.forEach(d => {
    if(!unique_XS.includes(d.XS)){
      unique_XS.push(d.XS);
      subCatData.push(d);
    }
  });
  
  const keggTableContainer = selection.selectAll(".keggTableDiv").data([null]);
  const keggTableContainerEnter = keggTableContainer
    .enter()
    .append("div")
    .attr("class", "keggTableDiv");

  //// Sort Functionality
  const sortDivEnter = keggTableContainerEnter
    .append('div')
      .attr('class', 'sort-func');
  const sortDiv = keggTableContainer.select('.sort-func');

  sortDivEnter
    .append('label')
      .text('Sort by: ');
  
  const sortOptionDiv = sortDiv.merge(sortDivEnter).selectAll('.sort-option-div').data(['Category', 'Name', 'KLD', 'MSE'], d=>d);
  const sortOptionDivEnter = sortOptionDiv.enter()
    .append('div')
      .attr('class', 'sort-option-div');
  sortOptionDivEnter
      .on('change', e => {
        setSortState(e.target.value);
      });
  
  sortOptionDivEnter
    .append('input')
      .attr('type', 'radio')
      .attr('class', 'sortOptionRadio')
      .attr('name', 'sort-option')
    .merge(sortOptionDiv.select('.sortOptionRadio'))
      .property('checked', d => d === sortState)
      .attr('id', d => d)
      .attr('value', d => d);

  sortOptionDivEnter
    .append('label')
    .merge(sortOptionDiv.select('label'))
      .attr('for', d => d)
      .text(d => d);


  // Create Table Depending on sortState
  if(sortState === 'Category'){
    //// KEGG TABLE
    // <table>
    const tableJoin = keggTableContainer.merge(keggTableContainerEnter).selectAll("#keggTable").data(['Category']);
    tableJoin.exit().remove();
    const tableEnter = tableJoin.enter()
      .append('div').attr('id', 'keggtable-div-inner')
      .append("table").attr("id", "keggTable");

    // <table> <thead> <tr/> </thead> </table>
    const tableHeaderEnter = tableEnter.append("thead").append("tr").attr('id', 'header-row');
    const tableHeader = tableJoin.select('#header-row');

    // <table> <thead> <tr> <th/> <th/> <th/>... </tr> </thead> </table>
    const tableHeaderRow = tableHeaderEnter.merge(tableHeader).selectAll(".header-cell").data(['Select', 'KEGG pathway', 'KLD', 'MSE']); // Object.keys(diffMetricsData[0])
    const tableHeaderRowEnter = tableHeaderRow.enter().append("th").attr('class', 'header-cell');
    
    tableHeaderRowEnter.merge(tableHeaderRow)
      .text(d => d);

    // <table> <body/> </table>
    const tableBodyEnter = tableEnter.append("tbody").attr('class', 'table-body');
    const tableBody = tableJoin.select('.table-body');

    // Existing rows clean up
    let indCatRows = tableBody.merge(tableBodyEnter).selectAll('.ind-kegg-row').data(range(diffMetricsCancerPair.length), d=>d.kegg);
    indCatRows.exit().remove();

    // Top Category Rows : tr
    const topCatRows = tableBody.merge(tableBodyEnter).selectAll('.top-kegg-row').data(topCatData, d=>d.top_category);
    const topCatRowsEnter = topCatRows.enter()
      .append('tr')
        .attr("class", d => ['top-kegg-row', "XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '));
    // Top Category : td : Checkboxes
    topCatRowsEnter
      .append('td')
      .append('input')
        .attr('type', 'checkbox')
      .merge(topCatRows.select('.top-kegg-row>td>input'))
        .attr('class', d => ["XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '))
        .attr('value', d => d.top_category)
        .property('checked', d => {
          const currentTopRows = diffMetricsCancerPair.filter(row => row.XT === d.XT).map(k => k.kegg); // if all the keggs corresponding to currently checked Category are all in selectedKeggTerms
          return currentTopRows.every(kegg => selectedKeggTerms.includes(kegg));
        })
        .on('change', (e,row) => {
          const selectedTopKeggs = diffMetricsCancerPair.filter(r => r.XT === row.XT).map(k => k.kegg);
          onTopCheckBoxClick(e.target, selectedTopKeggs);
        });
    // Top Category : td : Top Category Names
    topCatRowsEnter
      .append('td')
        .attr('class', 'top-kegg-row-name top-kegg-td')
        .attr('colspan', 3)
      .merge(topCatRows.select('.top-kegg-row .top-kegg-row-name'))
        .text(d => d.top_category);

    // Sub Category Rows : tr
    tableBody.merge(tableBodyEnter).selectAll('.top-kegg-row').each(topCatRow => {
      let currentSubData = subCatData.filter(d => d.top_category === topCatRow.top_category)
      
      const subCatRows = tableBody.merge(tableBodyEnter).selectAll('.sub-kegg-row').data(currentSubData.reverse(), d=>d.sub_category);
      const subCatRowsEnter = subCatRows.enter()
        .insert('tr', 'tr.XT'+topCatRow.XT +" + *")
          .attr("class", d => ["sub-kegg-row", "XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '));
      
      // Sub Category : td : Checkboxes
      subCatRowsEnter
        .append('td')
        .append('input')
          .attr('type', 'checkbox')
        .merge(subCatRows.select('.sub-kegg-row>td>input'))
          .attr('class', d => ["XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '))
          .property('checked', d => {
            const currentSubRows = diffMetricsCancerPair.filter(row => row.XS === d.XS).map(r => r.kegg);
            return currentSubRows.every(kegg => selectedKeggTerms.includes(kegg));
          })
          .on('change', (e,row)=>{
            const selectedSubKeggs = diffMetricsCancerPair.filter(r => r.XS === row.XS).map(k => k.kegg);
            onSubCheckBoxClick(e.target, selectedSubKeggs);
          });

      // Sub Category : td : Sub Category Names
      subCatRowsEnter
        .append('td')
          .attr('class', 'sub-kegg-row-name sub-kegg-td')
          .attr('colspan', 3)
        .merge(subCatRows.select('.sub-kegg-row .sub-kegg-row-name'))
          .text(d => d.sub_category);

    });
    
    // Ind Kegg Pathway : tr
    tableBody.merge(tableBodyEnter).selectAll('.sub-kegg-row').each(subCatRow => {
      let currentIndData = diffMetricsCancerPair.filter(d => d.sub_category === subCatRow.sub_category);

      const indCatRows = tableBody.merge(tableBodyEnter).selectAll('.ind-kegg-row').data(currentIndData.reverse(), d=>d.kegg);
      
      const indCatRowsEnter = indCatRows.enter()
        .insert('tr', '.sub-kegg-row.XS'+subCatRow.XS+" + *")
          .attr('class', d => ["ind-kegg-row", "XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '));
      
      // Ind Kegg Pathway : td : Checkboxes
      indCatRowsEnter
        .append('td')
        .append('input')
          .attr('type', 'checkbox')
        .merge(indCatRows.select('.ind-kegg-row>td>input'))
          .attr('class', d => ["XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '))
          .property('checked', d => selectedKeggTerms.includes(d.kegg))
          .on('change', (e,row) => {
            onCheckBoxClick(e.target, row);
          });

      // Ind Kegg Pathway : td : Ind Kegg Pathway Names
      indCatRowsEnter
        .append('td')
          .attr('class', 'ind-kegg-row-name ind-kegg-td')
        .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-name'))
          .text(d => d.kegg);
      // Ind Kegg Pathway : td : Ind Kegg Pathway KLD
      indCatRowsEnter
        .append('td')
          .attr('class', 'ind-kegg-row-kld ind-kegg-td')
        .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-kld'))
          .text(d => format(".4f")(d.kld));
      // Ind Kegg Pathway : td : Ind Kegg Pathway KLD
      indCatRowsEnter
      .append('td')
        .attr('class', 'ind-kegg-row-mse ind-kegg-td')
      .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-mse'))
        .text(d => format(".4f")(d.mse));

    });

  }else if(sortState === 'Name'){
    let currentIndData = diffMetricsCancerPair.sort((a,b) => ascending(a.kegg, b.kegg));
    //// KEGG TABLE
    // <table>
    const tableJoin = keggTableContainer.merge(keggTableContainerEnter).selectAll("#keggTable").data(['Name']);
    tableJoin.exit().remove();
    const tableEnter = tableJoin.enter()
      .append('div').attr('id', 'keggtable-div-inner')
      .append("table").attr("id", "keggTable");

    // <table> <thead> <tr/> </thead> </table>
    const tableHeaderEnter = tableEnter.append("thead").append("tr").attr('id', 'header-row');
    const tableHeader = tableJoin.select('#header-row');

    // <table> <thead> <tr> <th/> <th/> <th/>... </tr> </thead> </table>
    const tableHeaderRow = tableHeaderEnter.merge(tableHeader).selectAll(".header-cell").data(['Select', 'KEGG pathway', 'KLD', 'MSE']); // Object.keys(diffMetricsData[0])
    const tableHeaderRowEnter = tableHeaderRow.enter().append("th").attr('class', 'header-cell');
    
    tableHeaderRowEnter.merge(tableHeaderRow)
      .text(d => d);

    // <table> <body/> </table>
    const tableBodyEnter = tableEnter.append("tbody").attr('class', 'table-body');
    const tableBody = tableJoin.select('.table-body');

    // Existing rows clean up
    const topCatRows = tableBody.merge(tableBodyEnter).selectAll('.top-kegg-row').data(range(topCatData.length), d=>d);
    const subCatRows = tableBody.merge(tableBodyEnter).selectAll('.sub-kegg-row').data(range(currentIndData.length), d=>d);
    let indCatRows = tableBody.merge(tableBodyEnter).selectAll('.ind-kegg-row').data(range(currentIndData.length), d=>d);
    topCatRows.exit().remove();
    subCatRows.exit().remove();
    indCatRows.exit().remove();

    indCatRows = tableBody.merge(tableBodyEnter).selectAll('.ind-kegg-row').data(currentIndData, d=>d.kegg);

    const indCatRowsEnter = indCatRows.enter()
      .append('tr')
        .attr('class', d => ["ind-kegg-row", "XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '));

    // Ind Kegg Pathway : td : Checkboxes
    indCatRowsEnter
      .append('td')
      .append('input')
        .attr('type', 'checkbox')
      .merge(indCatRows.select('.ind-kegg-row>td>input'))
        .attr('class', d => ["XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '))
        .property('checked', d => selectedKeggTerms.includes(d.kegg))
        .on('change', (e,row) => {
          onCheckBoxClick(e.target, row);
        });

    // Ind Kegg Pathway : td : Ind Kegg Pathway Names
    indCatRowsEnter
      .append('td')
        .attr('class', 'ind-kegg-row-name ind-kegg-td')
      .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-name'))
        .text(d => d.kegg);
    // Ind Kegg Pathway : td : Ind Kegg Pathway KLD
    indCatRowsEnter
      .append('td')
        .attr('class', 'ind-kegg-row-kld ind-kegg-td')
      .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-kld'))
        .text(d => format(".4f")(d.kld));
    // Ind Kegg Pathway : td : Ind Kegg Pathway MSE
    indCatRowsEnter
    .append('td')
      .attr('class', 'ind-kegg-row-mse ind-kegg-td')
    .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-mse'))
      .text(d => format(".4f")(d.mse));

  }else if(sortState === 'KLD'){
    let currentIndData = diffMetricsCancerPair.sort((a,b) => descending(a.kld, b.kld));
    //// KEGG TABLE
    // <table>
    const tableJoin = keggTableContainer.merge(keggTableContainerEnter).selectAll("#keggTable").data(['Name']);
    tableJoin.exit().remove();
    const tableEnter = tableJoin.enter()
      .append('div').attr('id', 'keggtable-div-inner')
      .append("table").attr("id", "keggTable");

    // <table> <thead> <tr/> </thead> </table>
    const tableHeaderEnter = tableEnter.append("thead").append("tr").attr('id', 'header-row');
    const tableHeader = tableJoin.select('#header-row');

    // <table> <thead> <tr> <th/> <th/> <th/>... </tr> </thead> </table>
    const tableHeaderRow = tableHeaderEnter.merge(tableHeader).selectAll(".header-cell").data(['Select', 'KEGG pathway', 'KLD', 'MSE']); // Object.keys(diffMetricsData[0])
    const tableHeaderRowEnter = tableHeaderRow.enter().append("th").attr('class', 'header-cell');
    
    tableHeaderRowEnter.merge(tableHeaderRow)
      .text(d => d);

    // <table> <body/> </table>
    const tableBodyEnter = tableEnter.append("tbody").attr('class', 'table-body');
    const tableBody = tableJoin.select('.table-body');

    // Existing rows clean up
    const topCatRows = tableBody.merge(tableBodyEnter).selectAll('.top-kegg-row').data(range(topCatData.length), d=>d);
    const subCatRows = tableBody.merge(tableBodyEnter).selectAll('.sub-kegg-row').data(range(currentIndData.length), d=>d);
    let indCatRows = tableBody.merge(tableBodyEnter).selectAll('.ind-kegg-row').data(range(currentIndData.length), d=>d);
    topCatRows.exit().remove();
    subCatRows.exit().remove();
    indCatRows.exit().remove();
    
    indCatRows = tableBody.merge(tableBodyEnter).selectAll('.ind-kegg-row').data(currentIndData); // , d=>d.kegg
    const indCatRowsEnter = indCatRows.enter()
      .append('tr')
        .attr('class', d => ["ind-kegg-row", "XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '));

    // Ind Kegg Pathway : td : Checkboxes
    indCatRowsEnter
      .append('td')
      .append('input')
        .attr('type', 'checkbox')
      .merge(indCatRows.select('.ind-kegg-row>td>input'))
        .attr('class', d => ["XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '))
        .property('checked', d => selectedKeggTerms.includes(d.kegg))
        .on('change', (e,row) => {
          onCheckBoxClick(e.target, row);
        });

    // Ind Kegg Pathway : td : Ind Kegg Pathway Names
    indCatRowsEnter
      .append('td')
        .attr('class', 'ind-kegg-row-name ind-kegg-td')
      .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-name'))
        .text(d => d.kegg);
    // Ind Kegg Pathway : td : Ind Kegg Pathway KLD
    indCatRowsEnter
      .append('td')
        .attr('class', 'ind-kegg-row-kld ind-kegg-td')
      .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-kld'))
        .text(d => format(".4f")(d.kld));
    // Ind Kegg Pathway : td : Ind Kegg Pathway MSE
    indCatRowsEnter
    .append('td')
      .attr('class', 'ind-kegg-row-mse ind-kegg-td')
    .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-mse'))
      .text(d => format(".4f")(d.mse));

  }else if(sortState === 'MSE'){
    let currentIndData = diffMetricsCancerPair.sort((a,b) => descending(a.mse, b.mse));

    //// KEGG TABLE
    // <table>
    const tableJoin = keggTableContainer.merge(keggTableContainerEnter).selectAll("#keggTable").data(['Name']);
    const tableEnter = tableJoin.enter()
      .append('div').attr('id', 'keggtable-div-inner')
      .append("table").attr("id", "keggTable");

    // <table> <thead> <tr/> </thead> </table>
    const tableHeaderEnter = tableEnter.append("thead").append("tr").attr('id', 'header-row');
    const tableHeader = tableJoin.select('#header-row');

    // <table> <thead> <tr> <th/> <th/> <th/>... </tr> </thead> </table>
    const tableHeaderRow = tableHeaderEnter.merge(tableHeader).selectAll(".header-cell").data(['Select', 'KEGG pathway', 'KLD', 'MSE']); // Object.keys(diffMetricsData[0])
    const tableHeaderRowEnter = tableHeaderRow.enter().append("th").attr('class', 'header-cell');
    
    tableHeaderRowEnter.merge(tableHeaderRow)
      .text(d => d);

    // <table> <body/> </table>
    const tableBodyEnter = tableEnter.append("tbody").attr('class', 'table-body');
    const tableBody = tableJoin.select('.table-body');
    
    // Existing rows clean up
    const topCatRows = tableBody.merge(tableBodyEnter).selectAll('.top-kegg-row').data(range(topCatData.length), d=>d);
    const subCatRows = tableBody.merge(tableBodyEnter).selectAll('.sub-kegg-row').data(range(currentIndData.length), d=>d);
    let indCatRows = tableBody.merge(tableBodyEnter).selectAll('.ind-kegg-row').data(range(currentIndData.length), d=>d);
    topCatRows.exit().remove();
    subCatRows.exit().remove();
    indCatRows.exit().remove();

    indCatRows = tableBody.merge(tableBodyEnter).selectAll('.ind-kegg-row').data(currentIndData); // , d=>d.kegg
    const indCatRowsEnter = indCatRows.enter()
      .append('tr')
        .attr('class', d => ["ind-kegg-row", "XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '));

    // Ind Kegg Pathway : td : Checkboxes
    indCatRowsEnter
      .append('td')
      .append('input')
        .attr('type', 'checkbox')
      .merge(indCatRows.select('.ind-kegg-row>td>input'))
        .attr('class', d => ["XT"+d.XT, "XS"+d.XS, "XI"+d.XI].join(' '))
        .property('checked', d => selectedKeggTerms.includes(d.kegg))
        .on('change', (e,row) => {
          onCheckBoxClick(e.target, row);
        });

    // Ind Kegg Pathway : td : Ind Kegg Pathway Names
    indCatRowsEnter
      .append('td')
        .attr('class', 'ind-kegg-row-name ind-kegg-td')
      .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-name'))
        .text(d => d.kegg);
    // Ind Kegg Pathway : td : Ind Kegg Pathway KLD
    indCatRowsEnter
      .append('td')
        .attr('class', 'ind-kegg-row-kld ind-kegg-td')
      .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-kld'))
        .text(d => format(".4f")(d.kld));
    // Ind Kegg Pathway : td : Ind Kegg Pathway MSE
    indCatRowsEnter
    .append('td')
      .attr('class', 'ind-kegg-row-mse ind-kegg-td')
    .merge(indCatRows.select('.ind-kegg-row .ind-kegg-row-mse'))
      .text(d => format(".4f")(d.mse));

    tableJoin.exit().remove();
  };
};

