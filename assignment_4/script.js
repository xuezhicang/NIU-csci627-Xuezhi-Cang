function createVis(data)
{
    let mapData = data[0];
    Midwest_State_Map(mapData)
    
  
    let cornData = data[1];
    //prrparing data
    //list the states's name we need
    var states = ['Illinois', 'Indiana', 'Iowa', 'Minnesota', 'Nebraska', 'North Dakota', 'South Dakota', 'Wisconsin'];     

    //filter the corn data of 2020 and 2019
    var corn_2020 = {}; corn_2020 = cornData.filter( d => d.Year == 2020).sort(compare );
    

    //console.log(corn_2020);
    var corn_2019 = {}; corn_2019 = cornData.filter( d => d.Year == 2019).sort(compare );
    //console.log(corn_2019);
    var corn_diff = corn_2019; corn_diff.forEach( function(d,i){d.AcresHarvested = corn_2020[i].AcresHarvested - corn_2019[i].AcresHarvested});

    //console.log(data_selected.features[0].properties.name);
    var min_production_2020 = d3.min(corn_2020, d => d.AcresHarvested);
    var max_production_2020 = d3.max(corn_2020, d => d.AcresHarvested);
    var min_production_diff = d3.min(corn_diff, d => d.AcresHarvested);
    var max_production_diff  = d3.max(corn_diff, d => d.AcresHarvested);
    //console.log(min_production);
    //console.log(max_production)  
  
    //join(add) the corn production data to the geojson data
    // create data_selected to store the filtered states's data
    var data_selected_2020 = {};
    data_selected_2020.type="FeatureCollection";
    data_selected_2020.features = mapData.features.filter(function(d) { return states.includes(d.properties.name); });
    data_selected_2020.features.forEach( function(elements)
                                   { var production_value = 
                                       corn_2020.filter( d => d.State.toUpperCase() == elements.properties.name.toUpperCase())[0].AcresHarvested;
                                    elements.properties.value_v = production_value;});
    var color_map_1 = d3.interpolateGreens;
  
    //draw the map
    choropleth_map_visualization(data_selected_2020,"#corn-map",min_production_2020,max_production_2020,color_map_1)
  
  
    var data_selected_diff = {};
    data_selected_diff.type="FeatureCollection";
    data_selected_diff.features = mapData.features.filter(function(d) { return states.includes(d.properties.name); });
    data_selected_diff.features.forEach( function(elements)
                                   { var production_value = 
                                       corn_diff.filter( d => d.State.toUpperCase() == elements.properties.name.toUpperCase())[0].AcresHarvested;
                                    elements.properties.value_v = production_value;}); 
    
    var color_map_2 = d3.interpolateRdYlBu;
  
    //draw the map
    choropleth_map_visualization(data_selected_diff,"#corn-diff",min_production_diff,max_production_diff,color_map_2)   
    

    // this data is only used for Part 3 (627 students need to complete)
    let cornCountyData = data[2];
    Tree_map(cornCountyData);
    
    // call your own functions from here, or embed code here
}

function compare( a, b ) {
  if ( a.State < b.State ){
    return -1;
  }
  if ( a.State > b.State ){
    return 1;
  }
  return 0;
}



function choropleth_map_visualization(data_selected,id_string,min_value,max_value,current_color_map){
  

    // use the NAD83 / Iowa North (EPSG:26975) projection
    var projection1 = d3.geoConicConformal()
      .parallels([42 + 4 / 60, 43 + 16 / 60])
      .rotate([93 + 30 / 60, 0])
      .fitSize([w,h], data_selected);

    var getColor  = d3.scaleSequential(current_color_map)
										.domain([min_value,max_value]);
    //console.log(getColor(data_selected.features[0].properties.value_v));
    var w = 800;
    var h = 400;
  
     var mapSvg = d3.select(id_string).append("svg")
  	  .attr("width", w)
	    .attr("height", h);
 
    var projection = d3.geoConicConformal()
      .parallels([42 + 4 / 60, 43 + 16 / 60])
      .rotate([93 + 30 / 60, 0])
      .fitSize([w,h], data_selected); 

  

    var path = d3.geoPath()
    .projection(projection);

    // Define the div for the tooltip
    var div = d3.select(id_string).append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
   
   
    mapSvg.append("g")
      .selectAll("path")
      .data(data_selected.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "black")
      .style("fill", function(d,i){ 
      return getColor(d.properties.value_v);})
        .on("mouseover", function(event,d) 
         {
            console.log(d.properties.name)
             var x_p = event.pageX;
             var y_p = event.pageY;
            console.log(x_p);
                  div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html( d.properties.name)	
                .style("left", (x_p) + "px")		
                .style("top", (y_p) + "px");
          })
          .on("mouseout", function(event,d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
          });				


    // Legend Drawing
    var intervals = 200;
    var legendSVG = mapSvg.append("svg")  	
      .attr("width", w)
      .attr("height", h);
    var counting_lenfend_bin = [];
    for (var i = 0; i<intervals+1; i++) {counting_lenfend_bin.push(i);}
    //console.log(counting_lenfend_bin);

    var x = d3.scaleLinear()
      .domain([0, intervals])  //intervals
      .range([min_value, max_value]) // range of prodection

    legendSVG.selectAll("rect").data(counting_lenfend_bin)
      .join("rect")
      .attr("x", 700) // x
      .attr("y", (d,i) => 10 + i*((h-20)/intervals)) //y of each
      .attr("height", ((h-20)/intervals)) // hight of each rect
      .attr("width", 10) // width
      .style("fill", function(d,i){
        return getColor(x(i));});  


    var scale = d3.scaleLinear() // v4
      .domain([min_value, max_value])
      .range([10, h-10]);
    var yAxis = d3.axisRight()
                .scale(scale)
                .tickSize(6)
                .ticks(15); // create axis and attach to x scale



    legendSVG.append("g")
      .attr("transform", "translate(710, 0)")
      .call(yAxis); // draw axis

  
}



function Tree_map(cornCountyData){
  var w = 800;
  var h = 880;
  states_name = ['Illinois', 'Indiana', 'Iowa', 'Minnesota', 'Nebraska', 'North Dakota', 'South Dakota', 'Wisconsin']
  //console.log(cornCountyData[0]);

  data_1 = d3.group(cornCountyData, d => d.State,d=>d.DistrictAbbrv);
  //console.log(data_1.get("ILLINOIS").get("C"))
  //a = data_1.get("ILLINOIS").get("C");
  
  b = d3.hierarchy(data_1).sum(function(d){ return d.AcresHarvested}).sort((a, b) => b.AcresHarvested - a.AcresHarvested);
  //console.log(b.children[0].children[0].children[0].children[1]);
  
  d3.treemap()
    .size([w, h])
    .paddingInner(1)      // Padding between each rectangle
    .paddingOuter(1)
    (b)
  
  
    var color = d3.scaleOrdinal()
    .domain(['Illinois', 'Indiana', 'Iowa', 'Minnesota', 'Nebraska', 'North Dakota', 'South Dakota', 'Wisconsin'])
    .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494','#b3b3b3'])

    var mapSvg = d3.select("#treemap").append("svg")
  	.attr("width", w)
	  .attr("height", h);
  
  
    // Define the div for the tooltip
    var div = d3.select("#treemap").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
  
    // use this information to add rectangles:
    mapSvg
      .selectAll("rect")
      .data(b.leaves())
      .enter()
      .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black") 
        .style("fill", function(d){ 
      return color(d.parent.parent.data[0]);} )        
        .on("mouseover", function(event,d) 
         {
            console.log(d.data.County);

             var x_p = event.pageX;
             var y_p = event.pageY;
            console.log(x_p);
                  div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html( d.data.County)	
                .style("left", (x_p) + "px")		
                .style("top", (y_p) + "px");
          })
          .on("mouseout", function(event,d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
          });
  
  
 
   //add label
   var label_Drawing_1 = mapSvg.append("g").attr("class","region");
    label_Drawing_1
      .selectAll("text")
      .data(b.descendants().filter(function(d){return d.depth == 2}))
      .enter()
      .append("text")
        .attr("x", function(d)
              { return d.x0 + (d.x1-d.x0)/2 })
        .attr("y", function(d)
              { return d.y0 + (d.y1-d.y0)/2})
        .text(function(d)
              { while (d.height>2) d= d.parent; return (d.data[0]); })
        .attr("font-size", "12px")
        .attr("fill",  "black")
        .attr("text-anchor","middle");
  
 var label_Drawing_2 = mapSvg.append("g").attr("class","region");
    label_Drawing_2
      .selectAll("text")
      .data(b.descendants().filter(function(d){return d.depth == 1}))
      .enter()
      .append("text")
        .attr("x", function(d)
              { return d.x0 + (d.x1-d.x0)/2 })
        .attr("y", function(d)
              { return d.y0 + (d.y1-d.y0)/2})
        .text(function(d)
              { while (d.height>2) d= d.parent; return (d.data[0]); })
        .attr("font-size", "15px")
        .attr("fill",  "white")
        .attr("text-anchor","middle");
  
}







function createMap_MidwestStateMap(data, divId, projection, w, h) { 
  
  var mapSvg = d3.select(divId).append("svg")
  	.attr("width", w)
	  .attr("height", h);

  var path = d3.geoPath()
    .projection(projection);
  
  mapSvg.append("path")
    .datum(data)
    .attr("d", path)
    .style("stroke", "black")
    .style("fill", "red");

}
function Midwest_State_Map(data){
  var w = 800;
  var h = 400;
  
  //list the states's name we need
  var states = ['Illinois', 'Indiana', 'Iowa', 'Minnesota', 'Nebraska', 'North Dakota', 'South Dakota', 'Wisconsin']; 
  
  //the format below is to get the state's name
  //console.log(data.features[0].properties.name);
  
  // create data_selected to store the filtered states's data
  var data_selected = {};
  data_selected.type="FeatureCollection";
  data_selected.features = data.features.filter(function(d) 
                                                { return states.includes(d.properties.name); });
  
  //check the information of data_selected
  //console.log(data_selected.features[0]);
  
  // use the NAD83 / Iowa North (EPSG:26975) projection
  var projection1 = d3.geoConicConformal()
    .parallels([42 + 4 / 60, 43 + 16 / 60])
    .rotate([93 + 30 / 60, 0])
    .fitSize([w,h], data_selected);
  
  //draw the map  
  createMap_MidwestStateMap(data_selected, "#states-map", projection1, w, h);    
}


Promise.all([d3.json("https://gist.githubusercontent.com/xuezhicang/fb04c8194fd035adacf9c61238598337/raw/baa23d1fb8b222e100ebbbd8e8ffd40d4b5c424c/us-states.json"),
             d3.json("https://gist.githubusercontent.com/xuezhicang/ae3d2e84d237e044e06435a4e837247c/raw/9a368984cd1afba3099fed8a6e369738f4279990/midwest-corn.json"),
            d3.json("https://gist.githubusercontent.com/xuezhicang/b25033dab27f8049a2f49c0689bac4ae/raw/2f28750c54e0ba297ecad6137474189df61b29a7/midwest-corn-county")])
    .then(createVis);