// D3 Challenge

// Chart Details
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Parse Chart
var chart = d3
  .select("#scatter")
  .append("div")
  .classed("chart", true);

// Create SVG Group
var svg = chart.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create Chart Group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);  

// Create first X & Y axes
var chosenXAxis = "healthcare";
var chosenYAxis = "obesity";

// Set MIN/MAX of X Axis Scale
function xScale(data, chosenXAxis) {
  var xAxisScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);
  return xAxisScale;
}

// Set MIN/MAX of Y Axis Scale 
function yScale(data, chosenYAxis) {
  var yAxisScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);
  return yAxisScale;
}

// Set new X Axis and transition timer
function renderAxesX(newXScale, newXAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  newXAxis.transition()
    .duration(500)
    .call(bottomAxis);
  return newXAxis;
}

// Set new Y Axis and transition Timer
function renderAxesY(newYScale, newYAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  newYAxis.transition()
    .duration(500)
    .call(leftAxis);
  return newYAxis;
}

// Link scatter plots to data for transition (1st Axes)
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(500)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// Add text to scatter plots to change with plots (1st Axes)
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis){
  textGroup.transition()
    .duration(500)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
  return textGroup;
}

// Label the axes (1st)
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  // X Axis
  if (chosenXAxis === "healthcare") {
    var xLabel = "Lacks Healthcare";
  }
  
  else if (chosenXAxis === "smokes"){
    var xLabel = "Smokers";
  }
  
  else {
    var xLabel = "Median Age";
  }

  // Y Axis
  if (chosenYAxis === "obesity") {
    var yLabel = "Obesity";
  }
  
  else if (chosenYAxis === "poverty"){
    var yLabel = "Poverty";
  }
  
  else {
    var yLabel = "Income";
  }

// Add .tip for info to show on mouseover 
var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br> ${yLabel}${d[chosenYAxis]}`);
  });

circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function(data) {
  toolTip.show(data);
})

  .on("mouseout", function(data) {
    toolTip.hide(data);
  });

return circlesGroup;
}

// Create Transitioning X Labels
//Call CSV data 
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

data.forEach(function(data) {
  data.healthcare = +data.healthcare;
  data.obesity = +data.obesity;
  data.smokes = +data.smokes;
  data.age = +data.age;
  data.poverty = +data.poverty;
  data.income = +data.income;
});

// Define new variables to link data
var xLinearScale = xScale(data, chosenXAxis);
var yLinearScale = yScale(data, chosenYAxis);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

// Load data to the plots
var circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .classed("stateCircle", true)
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 12)
  .attr("opacity", ".5");

// Load state "abbr" information
var textGroup = chartGroup.selectAll(".stateText")
  .data(data)
  .enter()
  .append("text")
  .classed("stateText", true)
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .attr("dy", 3)
  .attr("font-size", "10px")
  .text(function(d){return d.abbr});

var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

// Load "healthcare" information
var healthcare = xlabelsGroup.append("text")
  .classed("aText", true)
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "healthcare")
  .classed("active", true)
  .text("% Lack of Healthcare");

// Load "smokes" information 
var smokers = xlabelsGroup.append("text")
  .classed ("aText", true)
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "smokes") 
  .classed("inactive", true)
  .text("% of Smokers");

// Load "age" information
var age = xlabelsGroup.append("text")
  .classed ("aText", true)
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "age") 
  .classed("inactive", true)
  .text("Median Age");

// Create Transitioning Y Labels 
var yLabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${0 - margin.left/4}, ${height/2})`);

//Load "obesity" information 
var obesity = yLabelsGroup.append("text")
  .classed("aText", true)
  .classed("active", true)
  .attr("x", 0)
  .attr("y", 0 - 80)
  .attr("dy", "1em")
  .attr("transform", "rotate(-90)")
  .attr("value", "obesity")
  .text("% of Obesity");

// Load "income" information
var income = yLabelsGroup.append("text")
  .classed("aText", true)
  .classed("inactive", true)
  .attr("x", 0)
  .attr("y", 0 - 60)
  .attr("dy", "1em")
  .attr("transform", "rotate(-90)")
  .attr("value", "income")
  .text("Median Household Income");

// Load "poverty" information
var poverty = yLabelsGroup.append("text")
  .classed("aText", true)
  .classed("inactive", true)
  .attr("x", 0)
  .attr("y", 0 - 40)
  .attr("dy", "1em")
  .attr("transform", "rotate(-90)")
  .attr("value", "poverty")
  .text("% of Poverty");

// Initiate the switch
var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
// Create event
xlabelsGroup.selectAll("text")
.on("click", function() {
  var value = d3.select(this).attr("value");
  
// For X Axis  
  if (value != chosenXAxis) {
    chosenXAxis = value;
      
    xLinearScale = xScale(data, chosenXAxis);
      
    xAxis = renderAxesX(xLinearScale, xAxis);
      
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
    textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


  if (chosenXAxis === "smokes") {
    smokers
      .classed("active", true)
      .classed("inactive", false);
      
    healthcare
      .classed("active", false)
      .classed("inactive", true);
    
    age
      .classed("active", false)
      .classed("inactive", true);
    }
          
  else if (chosenXAxis=== "healthcare") {
    smokers
      .classed("active", false)
      .classed("inactive", true);
    
    healthcare
      .classed("active", true)
      .classed("inactive", false);
      
    age
      .classed("active", false)
      .classed("inactive", true);
    }
          
  else {
    smokers
      .classed("active", false)
      .classed("inactive", true);
    
    healthcare
      .classed("active", false)
      .classed("inactive", true);
      
    age
      .classed("active", true)
      .classed("inactive", false);
    }
  }
});

// For Y Axis
yLabelsGroup.selectAll("text")
.on("click", function() {
  var value = d3.select(this).attr("value");
  
  if (value !== chosenYAxis) {
    chosenYAxis = value;
      
    yLinearScale = yScale(data, chosenYAxis);
      
    yAxis = renderAxesY(yLinearScale, yAxis);
      
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
    textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
  if (chosenYAxis === "obesity") {
    obesity
      .classed("active", true)
      .classed("inactive", false);
      
    income
      .classed("active", false)
      .classed("inactive", true);
      
    poverty
      .classed("active", false)
      .classed("inactive", true);
    }
    
  else if (chosenYAxis=== "income") {
    obesity
      .classed("active", false)
      .classed("inactive", true);
      
    income
      .classed("active", true)
      .classed("inactive", false);
      
    poverty
      .classed("active", false)
      .classed("inactive", true);
    }
    
  else {
    obesity
      .classed("active", false)
      .classed("inactive", true);
      
    income
      .classed("active", false)
      .classed("inactive", true);
      
    poverty
      .classed("active", true)
      .classed("inactive", false);
    }
  }
}); 
}); 
