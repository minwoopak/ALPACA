import { format, mean, descending } from "d3"; // sum

export const differenceMetric = (selection, props) => {
  const {
    diffMetricsData,
    cancertypeOne,
    cancertypeTwo,
    selectedKeggTerms,
    // LocToValOne,
    // LocToValTwo,
    LocToValOne,
    LocToValTwo,
    proteinDataFilteredOne,
    proteinDataFilteredTwo
  } = props;

  const locations = LocToValOne.map(d => d.location);

  //// Element-wise Sqrt sum of squares
  // const allGenes = proteinDataFilteredOne.map(d => d.symbol);
  // const sqrDiffArray = []
  // allGenes.forEach(gene => {
  //   const proteinRowOne = proteinDataFilteredOne.filter(d => d.symbol === gene);
  //   const proteinRowTwo = proteinDataFilteredTwo.filter(d => d.symbol === gene);
  //   const sqrDiff = ( proteinRowOne[0].exprs - proteinRowTwo[0].exprs ) ** 2;
  //   const newRow = {
  //     symbol: gene,
  //     location: proteinRowOne[0].location,
  //     sqrDiff
  //   }
  //   sqrDiffArray.push(newRow);
  // });

  //console.log(cancertypeOne)
  const discrepData = locations.reduce(( accum, location ) => {
    const locOneValue = LocToValOne.filter(d => d.location === location)[0]['exprs'];
    const locTwoValue = LocToValTwo.filter(d => d.location === location)[0]['exprs'];
    const locDiff = Math.abs( locOneValue - locTwoValue );
    accum.push({
      location,
      discrepancy: locDiff
    });
    return accum;
  }, []);
  const maxDiffLoc = discrepData.sort((a,b) => descending(a.discrepancy, b.discrepancy)).map(d => d.location);
  // console.log("Cancer: ", cancertypeOne, "maxDiffLoc: ", maxDiffLoc)

  const metricIndicator = selection.selectAll(".metricIndicator").data([null]);
  const metricIndicatorEnter = metricIndicator
    .enter()
    .append("div")
    .attr("class", "metricIndicator");

  ////**** Fetch Pre-calculated Difference Metrics by Python ****////
  const diffMetricsCancerPair = diffMetricsData.filter(
    (d) =>
      (d.cancer1 === cancertypeOne && d.cancer2 === cancertypeTwo) ||
      (d.cancer1 === cancertypeTwo && d.cancer2 === cancertypeOne)
  );
  const diffMetricsKegg = (selectedKeggTerms.length===0)
    ? diffMetricsCancerPair.filter((d) => d.kegg === "Summary")
    : diffMetricsCancerPair.filter(row => selectedKeggTerms.some(kegg => row.kegg === kegg));
  
  const mseValue = mean(diffMetricsKegg, d => d.mse);
  const kldValue = mean(diffMetricsKegg, d => d.kld);

  ////**** Calculate Difference Metrics with JavaScript ****////
  // function mse(a, b) {
  //   let error = 0
  //   for (let i = 0; i < a.length; i++) {
  //     error += Math.pow((b[i] - a[i]), 2)
  //   }
  //   return error / a.length
  // }

  // const locations = ['Extracellular space', "Nucleus", "Cytoskeleton", "Cytosol", 'Plasma membrane', "Mitochondrion", "Endosome", "Lysosome", "Golgi apparatus", "Endoplasmic Reticulum", "Peroxisome"]

  // const locsOne = locations.reduce((accumulator, l) => {
  //   if( sum(LocToValOne.map(d => Object.values(d).indexOf(l) > -1)) === 1 ){ // if the loc is in LocToValOne
  //     accumulator.push(l);
  //   }
  //   return accumulator;
  // }, [])

  // const locsTwo = locations.reduce((accumulator, l) => {
  //   if( sum(LocToValTwo.map(d => Object.values(d).indexOf(l) > -1)) === 1 ){ // if the loc is in LocToValOne
  //     accumulator.push(l);
  //   }
  //   return accumulator;
  // }, [])

  // const intersectionLocs = locsOne.filter(value => locsTwo.includes(value));

  // const filteredLocToValOne = LocToValOne.filter(d => intersectionLocs.includes(d.location))
  // const filteredLocToValTwo = LocToValTwo.filter(d => intersectionLocs.includes(d.location))

  // // console.log("combined One:",filteredLocToValOne)
  // // console.log("combined Two:",filteredLocToValTwo)

  // const locExprsOne = intersectionLocs.reduce((accumulator, l) => {
  //   filteredLocToValOne.forEach(d => {
  //     if (d.location === l){
  //       accumulator.push(d.exprs)
  //     }
  //   })
  //   return accumulator
  // }, []);

  // const locExprsTwo = intersectionLocs.reduce((accumulator, l) => {
  //   filteredLocToValTwo.forEach(d => {
  //     if (d.location === l){
  //       accumulator.push(d.exprs)
  //     }
  //   })
  //   return accumulator
  // }, []);

  // const kldValue = math.kldivergence(locExprsOne, locExprsTwo);
  // const mseValue = mse(locExprsOne, locExprsTwo);

  metricIndicatorEnter
    .append('div')
    .attr('id', 'cancerTypeIndicatorOne')
    .merge(metricIndicator.select('#cancerTypeIndicatorOne'))
    .text(cancertypeOne);

  metricIndicatorEnter
    .append("div")
    .attr("class", "mseIndicator")
    .merge(metricIndicator.select(".mseIndicator"))
    .text("MSE: " + format(".4f")(mseValue));

  metricIndicatorEnter
    .append("div")
    .attr("class", "kldIndicator")
    .merge(metricIndicator.select(".kldIndicator"))
    .text("KLD: " + format(".4f")(kldValue));

  metricIndicatorEnter
    .append('div')
    .attr('id', 'cancerTypeIndicatorTwo')
    .merge(metricIndicator.select('#cancerTypeIndicatorTwo'))
    .text(cancertypeTwo);
};
