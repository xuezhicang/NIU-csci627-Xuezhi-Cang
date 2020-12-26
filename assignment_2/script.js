var sec1 = document.getElementById("table");
var h2 = document.createElement("h4")

h2.appendChild(document.createElement("h5"));
h2.appendChild(document.createTextNode("Year-Month\xa0#Inspections"));

sec1.appendChild(h2);



var inspectInfo = data = inspectionData
function  getTotalsNum(elem)
{
  return {date: elem["Inspection Date"],total_number:elem["Fail"] +     elem["Not Inspected"] + elem["Pass"] + elem["Pass with Conditions"]} 
}
function getTotals(inspectionData)
{  
  var date_and_total = inspectInfo.map(getTotalsNum)  
  return date_and_total
}

date_and_total = getTotals(inspectionData)//creat the table data
console.log(date_and_total)//print the month and number in the console

//print the month and number to the table div
date_and_total.forEach(function(date_and_total) 
{
  var p = sec1.appendChild(document.createElement("p"));
  p.setAttribute('margin-left','100px'); 
  p.appendChild(document.createTextNode(date_and_total["date"] + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'));
  p.appendChild(document.createTextNode(date_and_total["total_number"]));
});




//section 2
var sec2 = document.getElementById("barchart1");
svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
w = 500;
h = 600;
svg.setAttribute("width", w);
svg.setAttribute("height", h);
sec2.appendChild(svg);
function addEltToSVG(svg, name, attrs) 
{
  var element = document.createElementNS("http://www.w3.org/2000/svg", name);
  if (attrs === undefined) attrs = {};
  for (var key in attrs) 
  {
    element.setAttribute(key, attrs[key]);
  }
  svg.appendChild(element);
}
date_and_total.forEach(function(d,i) {
  addEltToSVG(svg, "rect", {x: 80, 
                            y: 10+((h-40)/date_and_total.length)*(i), 
                            width:  d["total_number"]/6, 
                            height: (h-40)/(date_and_total.length), 
                            fill: "green",
                            stroke: "black"});

});



var text_1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_1.textContent = 'Jan 2018';
text_1.setAttribute('x', '5');
text_1.setAttribute('y', '25');
text_1.setAttribute('fill', '#000');
text_1.setAttribute('font-size',"18px");
svg.appendChild(text_1);

var text_2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_2.textContent = 'Month';
text_2.setAttribute('x', '0');
text_2.setAttribute('y', '285');
text_2.setAttribute('fill', '#000');
text_2.setAttribute('font-size',"18px");
svg.appendChild(text_2);

var text_3 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_3.textContent = 'Jun 2020';
text_3.setAttribute('x', '0');
text_3.setAttribute('y', '565');
text_3.setAttribute('fill', '#000');
text_3.setAttribute('font-size',"18px");
svg.appendChild(text_3);


var text_4 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_4.textContent = '0';
text_4.setAttribute('x', '75');
text_4.setAttribute('y', '585');
text_4.setAttribute('fill', '#000');
text_4.setAttribute('font-size',"18px");
svg.appendChild(text_4);

var text_5 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_5.textContent = '#Inspections';
text_5.setAttribute("font-weight","bold");
text_5.setAttribute('x', '203');
text_5.setAttribute('y', '585');
text_5.setAttribute('fill', '#000');
text_5.setAttribute('font-size',"18px");
svg.appendChild(text_5);

var text_6 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_6.textContent = '2000';
text_6.setAttribute('x', '403');
text_6.setAttribute('y', '585');
text_6.setAttribute('fill', '#000');
text_6.setAttribute('font-size',"18px");
svg.appendChild(text_6);


//section 3
var sec3 = document.getElementById("barchart2");
svg_1 = document.createElementNS("http://www.w3.org/2000/svg","svg")
w = 500;
h = 600;
svg_1.setAttribute("width", w);
svg_1.setAttribute("height", h);
sec3.appendChild(svg_1);

date_and_total.forEach(function(d,i) {
  addEltToSVG(svg_1, "rect", {x: 100+((w-140)/date_and_total.length)*(i), 
                            y: 550 - d["total_number"]*0.275, 
                            width: ((w-140)/date_and_total.length),  
                            height: d["total_number"]*0.275, 
                            fill: "green",
                            stroke: "black"});

});

var text_7 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_7.textContent = '2000';
text_7.setAttribute('x', '0');
text_7.setAttribute('y', '59');
text_7.setAttribute('fill', '#000');
text_7.setAttribute('font-size',"18px");
svg_1.appendChild(text_7);

var text_8 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_8.textContent = '0';
text_8.setAttribute('x', '0');
text_8.setAttribute('y', '559');
text_8.setAttribute('fill', '#000');
text_8.setAttribute('font-size',"18px");
svg_1.appendChild(text_8);

var text_9 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_9.textContent = '#Inspections';
text_9.setAttribute('x', '0');
text_9.setAttribute('y', '279');
text_9.setAttribute('fill', '#000');
text_9.setAttribute('font-size',"18px");
svg_1.appendChild(text_9);

var text_10 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_10.textContent = 'Jan 2018';
text_10.setAttribute('x', '70');
text_10.setAttribute('y', '565');
text_10.setAttribute('fill', '#000');
text_10.setAttribute('font-size',"18px");
svg_1.appendChild(text_10);

var text_11 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_11.textContent = 'Jun 2020';
text_11.setAttribute('x', '430');
text_11.setAttribute('y', '565');
text_11.setAttribute('fill', '#000');
text_11.setAttribute('font-size',"18px");
svg_1.appendChild(text_11);

var text_12 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text_12.textContent = 'Month';
text_12.setAttribute('x', '215');
text_12.setAttribute('y', '565');
text_12.setAttribute('fill', '#000');
text_12.setAttribute('font-size',"18px");
svg_1.appendChild(text_12);

function highlightMonth(num)
{
  console.log(num)
date_and_total.forEach(function(d,i) {
  //console.log(num)
  if (d["date"] == num)
  {
  addEltToSVG(svg_1, "rect", {x: 100+((w-140)/date_and_total.length)*(i), 
                            y: 550 - d["total_number"]*0.275, 
                            width: ((w-140)/date_and_total.length),  
                            height: d["total_number"]*0.275, 
                            fill: "red",
                            stroke: "black"});
   }
  else
  {
  addEltToSVG(svg_1, "rect", {x: 100+((w-140)/date_and_total.length)*(i), 
                            y: 550 - d["total_number"]*0.275, 
                            width: ((w-140)/date_and_total.length),  
                            height: d["total_number"]*0.275, 
                            fill: "green",
                            stroke: "black"});
   }    
  
  
  

})  
}