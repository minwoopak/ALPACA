import { 
    scaleLinear, 
    scaleBand, 
    max,
    min,
    axisLeft, 
    axisBottom,
    format
  } from 'd3';
  
  export const barChart = (selection, props) => {
    const { 
      minScaleValue, 
      maxScaleValue, 
      height, 
      width, 
      margin, 
      data,
      selectedLocArea,
      setSelectedLocArea,
    } = props;
    
    const barSvg = selection.selectAll('.barSvg').data([null]);
    const barSvgMerge = barSvg.enter()
      .append('svg')
        .attr('class', 'barSvg')
      .merge(barSvg)
        .attr('width', width)
        .attr('height', height);

    const innerWidth = width - margin.right - margin.left;
    const innerHeight = height - margin.top - margin.bottom;
  
    const xValue = d => d.exprs
    const yValue = d => d.location
    const minXDomain =  !minScaleValue
                          ? min(data, xValue)
                          : minScaleValue;
    const maxXDomain =  !maxScaleValue
                          ? max(data, xValue)
                          : maxScaleValue;
    
    const xScale = scaleLinear()
      .domain([minXDomain, maxXDomain])
      .range([0, innerWidth])
      .nice();
    
    const yScale = scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.1);
    
    const g = barSvgMerge.selectAll('.barContainer').data([null]);
    const gEnter = g.enter().append('g')
            .attr('class', 'barContainer');
    gEnter
        .merge(g)
            .attr('transform', `translate(${margin.left},${margin.top})`)
    
    const xAxisTickFormat = number =>
      format('.2f')(number);
        
    const xAxis = axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight);
    
    const yAxis = axisLeft(yScale)
      .tickFormat(name => name==='Endoplasmic Reticulum'
                            ? "E.R."
                            : name);

    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
        .append('g')
            .attr('class', 'y-axis');
    yAxisGEnter
      .merge(yAxisG)
        .call(yAxis)
          .selectAll('text')
            .attr('transform', `rotate(-15)`)
          .selectAll('.domain, .tick line')
          .remove();  	
    
    const xAxisG = g.select('.x-axis')
    const xAxisGEnter = gEnter
        .append('g')
            .attr('class', 'x-axis');
    xAxisGEnter
        .merge(xAxisG)
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight} )`)
            .selectAll('.domain').remove();
    
    xAxisGEnter.append('text')
        .attr('class', 'axis-label')
        .attr('y', 40)
        .attr('x', innerWidth/2)
        .attr('fill', 'black')
        .text('Quantification')
    
      const rects = gEnter.merge(g)
      .selectAll('rect').data(data, d => d);
    const rectsEnter = rects.enter().append('rect');
    rectsEnter
        .attr('height', yScale.bandwidth())
        .merge(rects)
          .attr('y', d => yScale(yValue(d)))
        .on('click', (e,d)=>{
          setSelectedLocArea(d.location === selectedLocArea ? null : d.location);
        })
        .transition().duration(2000)
          .attr('width', d => Math.abs(xScale(xValue(d))))
          .attr('height', yScale.bandwidth())
        .attr('fill', d => ( d.location === selectedLocArea ? 'red' : '#455a64' ));
    rectsEnter
      .append('title')
      .merge(rects.select('title'))
        .text(d => d.location + ': ' + format(".4f")(+d.exprs));
    rects.exit()
      .transition().duration(1000)
        .attr('width', 0)
      .remove();
    
    gEnter.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text('Protein Quantification per Location');
  
  };
  