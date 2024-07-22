export const colorLegend = (selection, props) => {
  const { 
    colorScale,
    spacing, 
    textOffset,
    numTicks,
    circleRadius
  } = props;
  
  const ticks = colorScale.ticks(numTicks)
    .filter(d => d != 0)
    .reverse();  // usable array data for size legend
  
  const groups = selection.selectAll('g').data(ticks);
  const groupsEnter = groups
    .enter().append('g')
      .attr('class', 'tick');
  groupsEnter
  	.merge(groups)
  		.attr('transform', (d, i) => 
    		`translate(0, ${i * spacing})`
		  );
  groups.exit().remove();
  
  groupsEnter.append('circle')
    .merge(groups.select('circle'))
  		.attr('r', circleRadius)
      .attr('fill', colorScale);  // equivalent to d => colorScale(d)
  // add text labels
  groupsEnter.append('text')
  .merge(groups.select('text'))
  	.text(d => d+"")
    .attr('dy', '0.32em')  // magic value for aligning text vertically to the middle of DOMs
	  .attr('x', d => d + textOffset);
}