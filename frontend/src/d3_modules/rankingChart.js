import {
  descending,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format,
} from "d3";

export const rankingChart = (selection, props) => {
  const {
    diffMetricsData,
    selectedKeggTerms,
    width,
    height,
    cancerOne,
    cancerTwo,
    setCancerpair,
  } = props;

  const diffMetricsFiltered = (selectedKeggTerms.length===0)
    ? diffMetricsData.filter((d) => d.kegg === "Summary")
    : diffMetricsData.filter(row => selectedKeggTerms.some(kegg => row.kegg === kegg));    //.filter((d) => d.kegg === selectedKeggTerms)
  const keggFilteredSorted = diffMetricsFiltered.sort((a, b) =>
    descending(a.kld, b.kld)
  );
  const topTwentyDiffMetrics = keggFilteredSorted.slice(0, 30);
  
  const margin = { top: 22, right: 22, bottom: 5, left: 15 };
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales Definitions
  const yValue = (d) => d.kld;
  const xValue = (d) => d.cancer1 + ", " + d.cancer2 + ", " + d.kegg;

  const yScale = scaleLinear()
    .domain([0, max(topTwentyDiffMetrics, yValue)])
    .range([height - margin.bottom, margin.top])
    .nice();

  const xScale = scaleBand()
    .domain(topTwentyDiffMetrics.map(xValue))
    .range([0, innerWidth])
    .padding(0.1);

  const rankingChartSection = selection.selectAll('#ranking-chart-section').data([null]);
  const rankingChartSectionEnter = rankingChartSection.enter()
    .append('div').attr('id', 'ranking-chart-section-div')
    .append('svg').attr('id', 'ranking-chart-section');

  const g = rankingChartSection.merge(rankingChartSectionEnter).selectAll(".rankingChart").data([null]);
  const gEnter = g.enter().append("g").attr("class", "rankingChart");
  gEnter.attr("transform", `translate(${margin.left + 40},${margin.top})`);

  // Y-Axis
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickFormat((number) => format(".2f")(+number));

  const yAxisGEnter = gEnter.append("g").attr("class", "y-axis");

  const yAxisG = g.select(".y-axis");

  yAxisGEnter.merge(yAxisG).call(yAxis).selectAll(".domain").remove();

  yAxisGEnter
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -30)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .merge(yAxisG.select(".axis-label"))
    .attr("x", -innerHeight / 2)
    .text("KLD");

  // X-Axis
  const xAxis = axisBottom(xScale);
  
  const xAxisGEnter = gEnter
    .append("g")
    .attr("class", "x-axis-ranking")
    .attr("transform", `translate(0, ${innerHeight + 25} )`);
  const xAxisG = g.select(".x-axis-ranking");
  
  xAxisGEnter
    .merge(xAxisG)
      .call(xAxis)
      .selectAll(".tick>text")
        .attr("text-anchor", "end")
        .attr("transform", `rotate(-60)`)
        .attr("dy", "-0.3em")
        .attr("x", -10)
        .text((d,i)=> "Pair "+i);

  xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 62)
      .attr('x', innerWidth/2)
      .text('Cancer Pairs');

  const bars = g.merge(gEnter).selectAll(".rankingRect").data(topTwentyDiffMetrics);
  const barsEnter = bars.enter().append("rect").attr('class', 'rankingRect');
  barsEnter
    .merge(bars)
      .attr("x", (d) => xScale(xValue(d)))
      .attr("y", (d) => yScale(yValue(d)))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - margin.bottom - yScale(yValue(d)))
      .attr("stroke-width", (d) =>
        xValue(d) === cancerOne + ", " + cancerTwo ? 5 : "none"
      )
      .on("click", (e, d) => {
        setCancerpair(xValue(d));
      });
  barsEnter.append("title").attr("class", "bar_tooltip").merge(bars.select(".bar_tooltip")).text(xValue);

  gEnter
    .append("text")
    .attr("class", "title")
    .attr("y", 5)
    .text("Top 30 Most Different Cancer Pairs");
};
