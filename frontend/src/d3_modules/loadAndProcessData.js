import { tsv, json, csvParseRows } from "d3"; // {tsv, json}

const quantDataRow = (d) => {
  d.exprs = +d.exprs;
  return d;
};

const diffMetricsDataRow = (d) => {
  d.kld = +d.kld;
  d.mse = +d.mse;
  return d;
};

export const loadAndProcessData = (dataPath, userUploadedData) => {
  return Promise.all([
    // Protein Quant Data
    tsv(dataPath, quantDataRow),

    // Symbol to Location
    tsv(
      "../../static/data/symbol_to_location_unified_labels.txt" // "https://gist.githubusercontent.com/minwoopak/a4c44fb33705834578d17165d04734af/raw/a8790e3b9561efe6d35177b30dcfac043c2e448f/symbol_to_location_unified_labels.txt"
    ),

    // KEGG to Symbols info
    json(
      "../../static/data/keggSymbolLookup.json" // "https://gist.githubusercontent.com/minwoopak/a4c44fb33705834578d17165d04734af/raw/keggSymbolLookup.json"
    ),

    // Symbols to KEGG info
    tsv(
      "../../static/data/symbols_to_KEGG_location_available.tsv" // "https://gist.githubusercontent.com/minwoopak/a4c44fb33705834578d17165d04734af/raw/a8790e3b9561efe6d35177b30dcfac043c2e448f/symbols_to_KEGG_location_available.tsv"
    ),

    json(
      "../../static/data/pair_to_sortedKeggs_kld.kegg" // "https://gist.githubusercontent.com/minwoopak/a4c44fb33705834578d17165d04734af/raw/a8790e3b9561efe6d35177b30dcfac043c2e448f/pair_to_sortedKeggs_kld.kegg"
    ),

    tsv(
      "../../static/data/diff_metrics_hierarchical_kegg_kld_sorted.tsv", // "https://gist.githubusercontent.com/minwoopak/a4c44fb33705834578d17165d04734af/raw/a8790e3b9561efe6d35177b30dcfac043c2e448f/diff_metrics.txt",
      diffMetricsDataRow
    ),
  ]).then(
    ([
      quantData,
      symbolLoc,
      keggSymbolLookup,
      symbolKeggs,
      keggOrderLookup,
      diffMetricsData,
    ]) => {
      if (userUploadedData) {
        //** Add Loc Label to QuantData **/
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }
        quantData.forEach((quantRow, i) => {
          quantRow.locations = [];
          const matchedLocRows = symbolLoc.filter(
            (locRow) => locRow.Symbol === quantRow.Symbol
          );
          if (matchedLocRows.length > 0) {
            matchedLocRows.forEach((matchedRow) => {
              quantRow.locations.push(matchedRow.Location);
            });
          } else {
            quantRow.locations.push("none");
          }
          quantRow.locations = quantRow.locations.filter(onlyUnique).join(",");
        });

        //** Symbol to Kegg parsing **//
        symbolKeggs.forEach((row) => {
          row.kegg_terms = csvParseRows(row.kegg_terms);
        });

        //** Calculate Avg Quant for each Protein **//
        const data = [];
        quantData.forEach((row) => {
          const symbol = row["Symbol"];
          const locations = csvParseRows(row.locations);
          let n = 0;
          let sum = 0;
          for (const item in row) {
            if (item === "Symbol" || item === "locations") continue;
            +row[item] ? (sum += +row[item]) : (sum += 0);
            n += 1;
          }
          const quantAvg = sum / n; // (Object.keys(row).length - 2);
          locations[0].forEach((location) => {
            const newRow = {
              symbol: symbol,
              exprs: quantAvg,
              location: location,
            };
            data.push(newRow);
          });
        });

        //** Adding Kegg Info **//
        const proteinData = [];
        data.forEach((dataRow) => {
          // filter kegg info corresponding to current data row's symbol
          const keggList = symbolKeggs.filter(
            (d) => d.symbol === dataRow.symbol
          );

          // add kegg info to data
          if (keggList.length === 0) {
            const newRow = {
              // id: dataRow.id,
              symbol: dataRow.symbol,
              exprs: dataRow.exprs,
              location: dataRow.location,
              kegg: "none",
            };
            proteinData.push(newRow);
          } else if (keggList.length > 0) {
            keggList[0].kegg_terms[0].forEach((currentKegg) => {
              const newRow = {
                // id: dataRow.id,
                symbol: dataRow.symbol,
                exprs: dataRow.exprs,
                location: dataRow.location,
                kegg: currentKegg,
              };
              proteinData.push(newRow);
            });
          }
        });

        return [proteinData, keggSymbolLookup];
      } else {
        //** Calculate Avg Quant for each Protein **//
        // const proteinData = [];
        // quantData.forEach(row => {
        //   let n = 0;
        //   let sum = 0;
        //   for (const item in row){
        //     if (item === 'symbol' || item === 'locations') continue;
        //     +row[item]
        //       ? sum += +row[item]
        //       : sum += 0;
        //     n += 1;
        //   };
        //   const quantAvg = sum / n;

        //   const newRow = {
        //     symbol: row.symbol,
        //     exprs: quantAvg,
        //     location: row.location,
        //     kegg: row.kegg
        //   };
        //   proteinData.push(newRow);
        // });
        
        return [quantData, keggSymbolLookup, keggOrderLookup, diffMetricsData];
      }
    }
  );
};
