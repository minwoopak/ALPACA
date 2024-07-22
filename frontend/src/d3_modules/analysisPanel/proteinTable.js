import { format, descending } from "d3";

export const proteinTable = (selection, props) => {
  let { proteinDataFiltered, topNumProteins, selectedLocArea } = props;

  const proteinDataSorted = proteinDataFiltered.sort((a,b) => descending(a.exprs, b.exprs));

  const protTableContainer = selection.selectAll(".protTableDiv").data([null]);
  const protTableContainerEnter = protTableContainer
    .enter()
    .append("div")
    .attr("class", "protTableDiv");
  
  const LocProteinDataFiltered = selectedLocArea
    ? proteinDataSorted.filter((r) => r.location === selectedLocArea)
    : proteinDataSorted;
  let topProteinData = LocProteinDataFiltered.filter(
    (r, i) => i < topNumProteins
  );

  // <table>
  const tableJoin = protTableContainer.merge(protTableContainerEnter).selectAll("#proteinTable").data([null]);
  const tableEnter = tableJoin.enter().append("table").attr("id", "proteinTable");
  
  // <table> <thead> <tr/> </thead> </table>
  const tableHeaderEnter = tableEnter.append("thead").append("tr").attr('class', 'header-row');
  const tableHeader = tableJoin.select('.header-row');

  const tableHeaderRow = tableHeaderEnter.merge(tableHeader).selectAll(".header-cell").data(Object.keys(topProteinData[0]));
  const tableHeaderRowEnter = tableHeaderRow.enter().append("th").attr('class', 'header-cell');
  
  tableHeaderRowEnter.merge(tableHeaderRow)
    .text(d => d);

  // <table> <body/> </table>
  const tableBodyEnter = tableEnter.append("tbody").attr('class', 'table-body');
  const tableBody = tableJoin.select('.table-body');

  const tableBodyRows = tableBodyEnter.merge(tableBody).selectAll("tr").data(topProteinData);
  const tableBodyRowsEnter = tableBodyRows.enter().append('tr');

  // <body> <tr/> <tr/> <tr/>... </body> : For each <tr/>, create a new data join => append td for each value of the data row
  tableBodyRowsEnter.merge(tableBodyRows)
    .selectAll("td").data((d) => Object.values(d)) // returns array of values of each data row
    .join("td")
    .text(cellValue =>
      typeof cellValue === "number" ? format(".4f")(cellValue) : cellValue
    );

  tableJoin.exit().remove();
  tableBody.exit().remove();
  tableBodyRows.exit().remove();
};
