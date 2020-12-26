function getTotals(data) {
    ranges = Object.keys(data[0]).filter(d => d != "Inspection Date");
    return data.map(function(d) { 
	return {"Inspection Date": d["Inspection Date"],
		"total": ranges.reduce(function(t, s) { return t + d[s]; }, 0)};
    });
}



function makeChart(data) {
    console.log("Data:", data);

    // -- your code here --
var height = 400;
var width = 600;
margin = ({top: 10, right: 50, bottom: 90, left: 50})


var stack = d3.stack() 
    .keys([ "Pass","Pass with Conditions","Fail", "Not Inspected" ])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

var series = stack(inspectionData); //stackmy data


date_and_total = getTotals(inspectionData)// get total number


// x scale
var bandScale = d3.scaleBand()  
    .domain(inspectionData.map(d =>d["Inspection Date"])  )
    .range([margin.left, width - margin.right])
    .padding(0.1)

//y scale
var y = d3.scaleLinear()  
    .domain([0,d3.max(date_and_total, d => d.total)])
    .rangeRound([height - margin.bottom, margin.top])

var highest =  y(d3.max(date_and_total, d => d.total));


var svg = d3.select("#barchart1").append("svg")
  .attr("width", width)
  .attr("height", height);


// plot pass number
svg.selectAll("rect") 
    .data(inspectionData)
    .join("rect")
    .attr("x", d => bandScale(d["Inspection Date"]))
    .attr('y', (d,i) =>y(series[0][i][1]))
    .attr('height', (d,i) =>(y(highest)-y(series[0][i][1])))
    .attr('width', bandScale.bandwidth())
    .style("fill", "green");

// plot  pass with conditions data
for (var j = 0; j < series[0].length; j++) 
  {
  svg.append("rect")
      .data(inspectionData)
      .join("rect")
      .attr("x", bandScale(inspectionData[j]["Inspection Date"]))
      .attr('y', y(series[1][j][1]))
      .attr('height', y(series[1][j][0])-y(series[1][j][1]))
      .attr('width', bandScale.bandwidth())
      .style("fill", "blue");
  }

// plot fail number
for (var j = 0; j < series[0].length; j++) 
  {
  svg.append("rect")
      .data(inspectionData)
      .join("rect")
      .attr("x", bandScale(inspectionData[j]["Inspection Date"]))
      .attr('y', y(series[2][j][1]))
      .attr('height', y(series[2][j][0])-y(series[2][j][1]))
      .attr('width', bandScale.bandwidth())
      .style("fill", "red");
  }

// plot not inspected
for (var j = 0; j < series[0].length; j++) 
  {
  svg.append("rect")
      .data(inspectionData)
      .join("rect")
      .attr("x", bandScale(inspectionData[j]["Inspection Date"]))
      .attr('y', y(series[3][j][1]))
      .attr('height', y(series[3][j][0])-y(series[3][j][1]))
      .attr('width', bandScale.bandwidth())
      .style("fill", "gray");
  }

// plot y axis
var y_axis = d3.axisLeft().scale(y); 
svg.append("g").attr("transform", "translate(40, 0)").call(y_axis);

// plot x axis
var x_axis = d3.axisBottom().scale(bandScale); 
svg.append("g")
    .attr("transform", "translate(0, 310)")
    .call(x_axis)
    .selectAll("text")
    .attr("transform", "rotate(90)")
    .attr("dx", "30")
    .attr("dy", "-5")

//add lengend
svg.append("text").attr("x", 505).attr("y", 10).style("font-size", "10px").text("Results");
svg.append("rect").join("rect").attr("x", 505).attr('y', 20).attr('height', 10).attr('width', 10).style("fill", "gray");
svg.append("text").attr("x", 516).attr("y", 28).style("font-size", "8px").text("Not Inspected");
svg.append("rect").join("rect").attr("x", 505).attr('y', 35).attr('height', 10).attr('width', 10).style("fill", "red");
svg.append("text").attr("x", 516).attr("y", 44).style("font-size", "8px").text("Fail");
svg.append("rect").join("rect").attr("x", 505).attr('y', 50).attr('height', 10).attr('width', 10).style("fill", "blue");
svg.append("text").attr("x", 516).attr("y", 58).style("font-size", "8px").text("Pass with Conditions");
svg.append("rect").join("rect").attr("x", 505).attr('y', 65).attr('height', 10).attr('width', 10).style("fill", "green");
svg.append("text").attr("x", 516).attr("y", 73).style("font-size", "8px").text("Pass");
}





// this loads the data, do not change
d3.json("https://gist.githubusercontent.com/dakoop/1c5d0c3410bbb994b8d7446bf60776ba/raw/de73bd1306193caa77a110825c54ffd695d3e467/inspectionData.json").then(makeChart);