import { scaleSequential, min, max, format, interpolateYlGn, interpolateGreens } from "d3";
import { colorLegend } from "./colorLegend";

export const cellColor = (selection, props) => {
  let {
    minScaleValue,
    maxScaleValue,
    margin,
    width,
    height,
    inputData,
    selectedLocArea,
    setSelectedLocArea,
  } = props;

  const cellSvg = selection.selectAll(".cellSvg").data([null]);
  const cellSvgMerge = cellSvg
    .enter()
    .append("svg")
    .attr("class", "cellSvg")
    .merge(cellSvg)
    .attr("width", width)
    .attr("height", height);

  const cellDiagram = cellSvgMerge.selectAll(".cellDiagram").data([null]);
  const cellDiagramEnter = cellDiagram.enter().append("g");
  cellDiagramEnter
    .merge(cellDiagram)
    .attr("class", "cellDiagram")
    .attr("transform", `translate(${margin.left}, ${margin.top}) scale(0.05)`);

  cellDiagramEnter
    .append("svg:image")
    .attr(
      "xlink:href",
      "https://gist.githubusercontent.com/minwoopak/a04c07d6f7a49a2a18726b91c63c9090/raw/fb4b784abc4e51b5188088318237af487756a6f3/protein_localization_cell_graphics.svg"
    );

  let minAbsDataValue = !minScaleValue
    ? min(inputData, (d) => +d.exprs)
    : minScaleValue;

  let maxAbsDataValue = !maxScaleValue
    ? max(inputData, (d) => +d.exprs)
    : maxScaleValue;

  const myColorScale = scaleSequential(interpolateGreens).domain([
    min([minAbsDataValue, maxAbsDataValue]),
    max([minAbsDataValue, maxAbsDataValue]),
  ]);

  const compartments = cellDiagramEnter
    .merge(cellDiagram)
    .selectAll(".compartment")
    .data(inputData, (d) => d.path);
  const compartmentsEnter = compartments.enter().append("path");
  compartmentsEnter
    .attr("class", "compartment")
    .merge(compartments)
    .attr("opacity", 0.8)
    .attr("d", (d) => d.path)
    .on("click", (e, d) => {
      setSelectedLocArea(d.location === selectedLocArea ? null : d.location);
    })
    .transition()
    .duration(1000)
    .attr("fill", (d) => (d.location === selectedLocArea ? 'red' : myColorScale(+d.exprs)));

  compartmentsEnter
    .append("title")
    .merge(compartments.select("title"))
    .text((d) => d.location + ": " + format(".4f")(+d.exprs));

  compartments.exit().remove();

  ////////////// Color Legend //////////////
  // cellDiagramEnter.append('text').text('Location Enrichment Distribution');

  cellDiagramEnter
    .append("g")
    .merge(cellDiagram.select("g"))
    .attr("transform", `translate(311, 11)`)
    .call(colorLegend, {
      colorScale: myColorScale,
      spacing: 15,
      textOffset: 11,
      numTicks: 5,
      circleRadius: 6,
    });
};
