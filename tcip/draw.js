/////////////Thank you to Ben Best for the Astor Plot code that I built off of////////
////////////https://gist.github.com/bbest/2de0e25d4840c68f2db1////////////////

// reload on error function
// window.onerror = function() {
//     location.reload();
// }


/////timer for video page on inactivity///////
// var idleTime = 30;  //in seconds
// var idleTimeCount = 0;

// document.onclick = function(){
//   idleTimeCount = 0;
// };

// document.onmousemove = function(){
//   idleTimeCount = 0;
// };

// window.setInterval(CheckIdleTime,1000);

// function CheckIdleTime(){
//   idleTimeCount++;
//   if(idleTimeCount >= idleTime){
//     window.location.replace("vidPage/index.html");
//   }
// }



/////////////CO2 circle//////////
var width = 450,
    height = 450,
    radius = Math.min(width,height) / 3,
    innerRadius = 0;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) {
    return (radius - innerRadius) * (d.data.CO2 / 100.0) + innerRadius;
  });

var outlineArc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);



/////////SO2 circle////////////
var radius2 = width * 0.5,
    innerRadius2 = radius;

var pie2 = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var arc2 = d3.svg.arc()
  .innerRadius(innerRadius2)
  .outerRadius(function (d) {
    return (radius2 - innerRadius2) * (d.data.SO2 / 100.0) + innerRadius2;
  });

var outlineArc2 = d3.svg.arc()
    .innerRadius(innerRadius2)
    .outerRadius(radius2);




/////////NOx circle/////////////
var radiusX = width * 0.65,
    innerRadiusX = radius2;

var pieX = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var arcX = d3.svg.arc()
  .innerRadius(innerRadiusX)
  .outerRadius(function (d) {
    return (radiusX - innerRadiusX) * (d.data.NOX / 100.0) + innerRadiusX;
  });

var outlineArcX = d3.svg.arc()
    .innerRadius(innerRadiusX)
    .outerRadius(radiusX);





//tip pop up on hover CO2
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:#dadada'>" + d.data.quant.toLocaleString(undefined, {maximumFractionDigits: 1}) + "<strong> grams</strong> </span>";
  })

//tip pop up on hover SO2
var tip2 = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:#dadada'>" + d.data.quant2.toLocaleString(undefined, {maximumFractionDigits: 1}) + "<strong> grams</strong> </span>";
  })

//tip pop up on hover NOx
var tipX = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:#dadada'>" + d.data.quantX.toLocaleString(undefined, {maximumFractionDigits: 1}) + "<strong> grams</strong> </span>";
  })

//tip pop up on hover for second graph
var tipSec = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:#dadada'>" + d.value.toLocaleString(undefined, {maximumFractionDigits: 1}) + "<strong> grams</strong> </span>";
  })

/////////svg object setup(whole chart)///////////
var svg = d3.select("#mainData").append("svg")
    .attr("width", screen.width*2)
    .attr("height", height*3)
    .style("opacity", 0)
    .append("g")
    .attr("transform", "translate(" + window.innerWidth/2 + "," + height + ")");

svg.call(tip);
svg.call(tip2);
svg.call(tipX);












////////////////all variables//////////////////
var bill;
var longkWh, kWh;
var coalCO2, natGasCO2, nuclearCO2, solarCO2, windCO2;
var coalSO2, natGasSO2, nuclearSO2, solarSO2, windSO2;
var coalNOx, natGasNOx, nuclearNOx, solarNOx, windNOx;
var coalPM, natGasPM, nuclearPM, solarPM, windPM;
var coalCN, natGasCN, nuclearCN, solarCN, windCN;
var totalCO2, totalSO2, totalNOx;
var manip = false;
var popUpText;
var annualHealthCost, annualEnvirCost;

//percent of energy coming from each source//
var nucPerc = .35;  //NYC portfolio eGrid 2016 data
var natgasPerc = .65;  //NYC portfolio eGrid 2016 data
var coalPerc = 0;
var solarPerc = 0;
var windPerc = 0;


document.getElementById("nGnum").innerHTML = (100*natgasPerc).toFixed(0)+"%";
document.getElementById("Nnum").innerHTML = (100*nucPerc).toFixed(0)+"%";
document.getElementById("Cnum").innerHTML = (100*coalPerc).toFixed(0)+"%";
document.getElementById("Snum").innerHTML = (100*solarPerc).toFixed(0)+"%";
document.getElementById("Wnum").innerHTML = (100*windPerc).toFixed(0)+"%";







///////////////////////////////////////////////
///////////////////sliders/////////////////////
///////////////////////////////////////////////

// Initialize sliders
var slider1 = d3.slider().min(0).max(1).value(natgasPerc).orientation("vertical");
var slider2 = d3.slider().min(0).max(1).value(coalPerc).orientation("vertical");
var slider3 = d3.slider().min(0).max(1).value(nucPerc).orientation("vertical");
var slider4 = d3.slider().min(0).max(1).value(windPerc).orientation("vertical");
var slider5 = d3.slider().min(0).max(1).value(solarPerc).orientation("vertical");

// var arr = document.getElementsByClassName("d3-slider-handle")
// console.log(arr.child);

// // for(var i=0;i<arr.length;i++){
// //   console.log(arr[i]);
// // }
// // document.getElementsByClassName("d3-slider-handle").style = "red";

var slideVals = [slider1, slider2, slider3, slider4, slider5];

// Render the slider in the div and update on movement
d3.select('#slider-1').call(slider1.on("slide", function(evt, value){

  // set bool to true for alt. data
  manip = true;

  natgasPerc = slider1.value();

  var count = 0; //number of sliders with non zero value
  var currTotal = 0;  //total of all slider vals

  for(var i = 0; i < slideVals.length; i++){

    currTotal = currTotal + slideVals[i].value();  //add each slider val to total

    if(slideVals[i].value() != 0){  //if slider value is non zero add 1 to count
      count++;
    }
    console.log(count);
    console.log(currTotal);
  }

  slideMove(0,currTotal,count);  //get adjusted values based off slider being moved, total, and numb of non zero sliders


  runCalc();

  updateDataCO2(inputVals);
  updateDataSO2(inputVals);  //problem with inner radius changing to 0
  updateDataNOX(inputVals);

}));

d3.select('#slider-2').call(slider2.on("slide", function(evt, value){

  manip = true;
  coalPerc = slider2.value();

  var count = 0;
  var currTotal = 0;

  for(var i = 0; i < slideVals.length; i++){

    currTotal = currTotal + slideVals[i].value();

    if(slideVals[i].value() != 0){
      count++;
    }

  }

  slideMove(1,currTotal,count);


  runCalc();

  updateDataCO2(inputVals);
  updateDataSO2(inputVals);  //problem with inner radius changing to 0
  updateDataNOX(inputVals);

}));

d3.select('#slider-3').call(slider3.on("slide", function(evt, value){

  manip = true;

  nucPerc = slider3.value();

  var count = 0;
  var currTotal = 0;

  for(var i = 0; i < slideVals.length; i++){

    currTotal = currTotal + slideVals[i].value();

    if(slideVals[i].value() != 0){
      count++;
    }

  }

  slideMove(2,currTotal,count);

  runCalc();

  updateDataCO2(inputVals);
  updateDataSO2(inputVals);  //problem with inner radius changing to 0
  updateDataNOX(inputVals);

}));

d3.select('#slider-4').call(slider4.on("slide", function(evt, value){

  manip = true;
  windPerc = slider4.value();

  var count = 0;
  var currTotal = 0;

  for(var i = 0; i < slideVals.length; i++){

    currTotal = currTotal + slideVals[i].value();

    if(slideVals[i].value() != 0){
      count++;
    }

  }

  slideMove(3,currTotal,count);

  runCalc();

  updateDataCO2(inputVals);
  updateDataSO2(inputVals);  //problem with inner radius changing to 0
  updateDataNOX(inputVals);

  if(windPerc > 0.8){
    // popUpText = "***Keep in mind the wind isn't always blowing,\nand wind turbines need land area!";
    // document.getElementById('popUpText').innerHTML = popUpText;
    // document.getElementById('popUp').style.display = "block";
  }else{
    popUpText = "";
    document.getElementById('popUpText').innerHTML = popUpText;
    document.getElementById('popUp').style.display = "none";
  }

}));

d3.select('#slider-5').call(slider5.on("slide", function(evt, value){

  manip = true;
  solarPerc = slider5.value();

  var count = 0;
  var currTotal = 0;

  for(var i = 0; i < slideVals.length; i++){

    currTotal = currTotal + slideVals[i].value();

    if(slideVals[i].value() != 0){
      count++;
    }

  }

  slideMove(4,currTotal,count);


  runCalc();

  updateDataCO2(inputVals);
  updateDataSO2(inputVals);  //problem with inner radius changing to 0
  updateDataNOX(inputVals);

  if(solarPerc > 0.8){
    // popUpText = "***Keep in mind the sun isn't always shining,\nand solar panels need land area!"
    // document.getElementById('popUpText').innerHTML = popUpText;
    // document.getElementById('popUp').style.display = "block";
  }else{
    popUpText = "";
    document.getElementById('popUpText').innerHTML = popUpText;
    document.getElementById('popUp').style.display = "none";
  }

}));







function slideMove(slideNum,totalVal,count){

  for(var i = 0; i < slideVals.length; i++){

    if(i != slideNum && slideVals[i].value() != 0){  //if the slider is not the one being moved and not zero

      if(totalVal > 1){ //if the total is over upper limit
        var newVal = slideVals[i].value() - ( (totalVal-1)/(count-1) );

        if(newVal <= 0){  //if new value is under 0 update total with diff
          totalVal += Math.abs(0 - newVal);
          newVal = 0;
        }

      }else{
        var newVal = slideVals[i].value() + ( (1-totalVal)/(count-1) );

        if(newVal >= 1){  //if new value is over 1 update total with diff
          totalVal -= (newVal - 1);
          newVal = 1;
        }

      }

      slideVals[i].value(newVal);

    }

  }

  return;

}

















/////////////input function/////////////////
document.getElementById('submit').addEventListener("click", function(e){  //take input from form for breakdown

  e.preventDefault();
  bill = document.getElementById("billAmount").value;

  if(bill != 0){

    calcKWH(bill);  //bill to kWh

    document.getElementById("billApprox").innerHTML = "$"+bill+" Electric Bill Amount";
    document.getElementById('energyAmount').innerHTML = kWh+" kWh Used";

    //calculate new data from input
    runCalc();

    //update graphs with new data from input
    updateDataCO2(inputVals);
    updateDataSO2(inputVals);  //problem with inner radius changing to 0
    updateDataNOX(inputVals);

    d3.select("svg").transition().style("opacity", 1).duration(1000);
    document.getElementById('billInfo').style.display = "none";
    document.getElementById('content').style.display = "block";
    document.getElementById('line').style.display = "block";
    // document.getElementById('line2').style.display = "block";
    document.getElementById('titleBar').style.display = "block";

    }else{
      document.getElementById("billAmount").placeholder = "Please Enter a Number";
    }

});














/////////////////All data for chart kept here//////////////////////
var inputVals = [
  {id: "Solar", order: 1, color: "#80bcc0", weight: 1, CO2: 50, co2N:0, SO2: 30, so2N:0, NOX:30, noxN:0, label:"Solar"},
  {id: "Wind" , order: 2, color: "#ac95b2", weight: 1, CO2: 50, co2N:0, SO2: 30, so2N:0, NOX:30, noxN:0, label:"Wind"},
  {id: "Nuclear", order: 3, color: "#9ebdd5", weight: 1, CO2: 50, co2N:0, SO2: 30, so2N:0, NOX:30, noxN:0, label:"Nuclear"},
  {id: "Coal", order: 4, color: "#e95c67", weight: 1, CO2: 50, co2N:0, SO2: 30, so2N:0, NOX:30, noxN:0, label:"Coal"},
  {id: "Natural Gas", order: 5, color: "#f69532", weight: 1, CO2: 50, co2N:0, SO2: 30, so2N:0, NOX:30, noxN:0, label:"Natural Gas"},
]














/////////////menu buttons function/////////////////
//set all sliders and values to 20%
document.getElementById("eP").addEventListener("click", function(e){
//broken when init values of sliders are 0
  manip = true;
  eqPerc = 0.2;

  natgasPerc = eqPerc;
  coalPerc = eqPerc;
  nucPerc = eqPerc;
  windPerc = eqPerc;
  solarPerc = eqPerc;

  slideVals[4].value(eqPerc);
  slideVals[3].value(eqPerc);
  slideVals[2].value(eqPerc);
  slideVals[1].value(eqPerc);
  slideVals[0].value(eqPerc);

  //added 0.01 value set due to issues with slider transition animation
  //when setting straight to 0.2, possible due to 0 val prior
  slider5.value(0.01);
  slider5.value(eqPerc);
  slider4.value(0.01);
  slider4.value(eqPerc);
  slider3.value(0.01);
  slider3.value(eqPerc);
  slider2.value(0.01);
  slider2.value(eqPerc);
  slider1.value(0.01);
  slider1.value(eqPerc);



  runCalc();

  updateDataCO2(inputVals);
  updateDataSO2(inputVals);
  updateDataNOX(inputVals);

});


//start over
document.getElementById("sOver").addEventListener("click", function(e){
    location.reload();
})















/////////////////initialize graphs///////////////////////
addDataCO2(inputVals);
addDataSO2(inputVals);
addDataNOX(inputVals);


////////////////////////////////////////////////////////////////////
/////////////////initialize graphs with data functions//////////////

////////data for CO2////////////
function addDataCO2(data){

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.CO2;  //val shown in pie chart
    d.width  = +d.weight;
    d.label  =  d.label;
  });

  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d) { return d.data.color; })
      .attr("class", "solidArc")
      .attr("stroke", "white")
      .attr("d", arc)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);

}


////////data for SO2////////////
function addDataSO2(data){

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.SO2;  //val shown in pie chart
    d.width  = +d.weight;
    d.label  =  d.label;
  });

  var path2 = svg.selectAll(".solidArc2")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d) { return d.data.color; })
      .attr("class", "solidArc2")
      .attr("stroke", "white")
      .attr("d", arc2)
      .on('mouseover', tip2.show)
      .on('mouseout', tip2.hide);

  var outerPath2 = svg.selectAll(".outlineArc2")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("class", "outlineArc2")
      .attr("d", outlineArc2);


}

/////////data for NOx///////////
function addDataNOX(data){

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.NOX;  //val shown in pie chart
    d.width  = +d.weight;
    d.label  =  d.label;
  });

  var pathX = svg.selectAll(".solidArcX")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d) { return d.data.color; })
      .attr("class", "solidArcX")
      .attr("stroke", "white")
      .attr("d", arcX)
      .on('mouseover', tipX.show)
      .on('mouseout', tipX.hide);

  var outerPathX = svg.selectAll(".outlineArcX")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("class", "outlineArcX")
      .attr("d", outlineArcX);
}




////////////////////////////////////////////////////////////////////
/////////////////update graphs with data functions//////////////////

////////////////update CO2 graph//////////////
function updateDataCO2(data){

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.CO2;  //val shown in pie chart
    d.quant = d.co2N;
    d.width  = +d.weight;
    d.label  =  d.label;
    console.log(d.color);
  });

  var newArc = d3.svg.arc().outerRadius(function(d) {   //attempt to make new arc with updated data
    return (radius - innerRadius) * (d.data.CO2 / 100.0) + innerRadius;
  });

  svg.selectAll(".solidArc").transition().attr("d", newArc);  //transitions and moves arc to new position

}

////////////////update SO2 graph//////////////
function updateDataSO2(data){

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.SO2;  //val shown in pie chart
    d.quant2 = d.so2N;
    d.width  = +d.weight;
    d.label  =  d.label;

  });

  var newArc = d3.svg.arc()
    .innerRadius(innerRadius2)
    .outerRadius(function(d) {   //make new arc with updated data
    return (radius2 - innerRadius2) * (d.data.SO2 / 100.0) + innerRadius2;
  });

  svg.selectAll(".solidArc2").transition().attr("d", newArc);  //transitions and moves arc to new position

}

////////////////update NOx graph//////////////
function updateDataNOX(data){

  data.forEach(function(d) {
    d.id     =  d.id;
    d.order  = +d.order;
    d.color  =  d.color;
    d.weight = +d.weight;
    d.score  = +d.NOX;  //val shown in pie chart
    d.quantX = d.noxN;
    d.width  = +d.weight;
    d.label  =  d.label;
  });

  var newArc = d3.svg.arc()
    .innerRadius(innerRadiusX)
    .outerRadius(function(d) {   //make new arc with updated data
    return (radiusX - innerRadiusX) * (d.data.NOX / 100.0) + innerRadiusX;
  });

  svg.selectAll(".solidArcX").transition().attr("d", newArc);  //transitions and moves arc to new position

}












/////////////////////second bar graph//////////////////////////
var margin = {top:20, right: 20, bottom: 90, left: 40},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercemt1 = d3.format(",");


var x = d3.scale.ordinal()
      .rangeRoundBands([0,width], .2);

var y = d3.scale.linear()
      .range([height, 0]);

var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(10)
      .orient("left")
      .tickFormat(formatPercemt1);


var xPos = window.width*1.5;

barGraph(inputVals,window.width);  //create bar graph

function barGraph(data, xPos){

    data.forEach(function(d){
        d.id     =  d.id;
        d.order  = +d.order;
        d.color  =  d.color;
        d.quant  = +d.co2N;
        d.label  =  d.label;
    });

    x.domain(data.map(function(d) { return d.label; }));
    y.domain([0, d3.max(data, function(d) { return d.quant; })]);

}









//CODE USED FOR CLICK THROUGH GRAPH, REMOVED CURRENTLY

// var poll = 0;

// ///////////////////animation code////////////////////////////

// //check which tier is being clicked
// window.onclick = function(e) {
//     // console.log(e.target.className.baseVal);
//     var tier = e.target.className.baseVal;

//     console.log(e.target);

//     if(tier == "solidArc"){ //co2 graph
//       poll = 1;
//       animateGraphs(inputVals);
//       updateText();

//     }else if(tier == "solidArc2"){ //so2 graph
//       poll = 2;
//       animateGraphs(inputVals);
//       updateText();

//     }else if(tier == "solidArcX"){  //nox graph
//       poll = 3;
//       animateGraphs(inputVals);
//       updateText();

//     }

// }

// //animate graph moving back
// document.getElementById('back').addEventListener("click", animateBack);











// // animation code
// function animateGraphs(data){
//     var graphTransition = svg.transition();
//     graphTransition.attr("transform", "translate(0,440)").duration(1000);

//     // barGraph(inputVals,window.width);  //create bar graph
//     svg.selectAll("g").transition().style('opacity',1).duration(1500);  //fade in axis' during transition
//     svg.selectAll("rect").transition().style('opacity',1).duration(1500);  //fade in bars on

//     updateSecondGraph(inputVals);

//     document.getElementById("totals").style.display = "none";
//     document.getElementById("back").style.display = "block";

//     document.getElementById("slider-labels").style.display = "none";
//     document.getElementById("sliders").style.display = "none";

//     document.getElementById("secondTitle").style.display = "block";  //show title of second graph
//     document.getElementById("qualInfo").style.display = "block";  //show wual info as well

//     document.getElementById('line').style.display = "none";
//     document.getElementById('line2').style.display = "none";

//     svg.call(tipSec); //turn on hover values
// }

// //update the text surrounding the second graph
// function updateText(){
//   var graphTitle;
//   var graphParagraph;

//     if(poll == 1){

//         graphTitle = "Carbon Dioxide (CO"+string1.sub()+")"
//         document.getElementById("sTitle").innerHTML = graphTitle;
//         graphParagraph = "Carbon dioxide (CO"+string1.sub()+") is the primary greenhouse gas emitted through human activities. In\n2015, CO"+string1.sub()+" accounted for about 82.2% of all U.S. greenhouse gas emissions from human\nactivities. Carbon dioxide is naturally present in the atmosphere as part of the Earth's\ncarbon cycle (the natural circulation of carbon among the atmosphere, oceans, soil,\nplants, and animals). Human activities are altering the carbon cycle–both by adding more\nCO"+string1.sub()+" to the atmosphere and by influencing the ability of natural sinks, like forests, to\nremove CO"+string1.sub()+" from the atmosphere."
//         document.getElementById("para").innerHTML = graphParagraph;

//       }else if(poll == 2){

//         graphTitle = "Sulfur Dioxide (SO"+string1.sub()+")"
//         document.getElementById("sTitle").innerHTML = graphTitle;
//         graphParagraph = "Sulfer dioxide (SO"+string1.sub()+") is a harmful pollutant for both plants and humans. Sulfur dioxide can react and form\nother sulfur oxides which can harm trees and plants by damaging foliage and decreasing \ngrowth. It can also form small particles (particulate matter) which are very harmful for humans\nwhen inhaled into sensitive parts of our lungs. Sulfur dioxide by itself can harm the\nhuman respiratory system as well, by making breathing difficult. Children, the elderly, and those\nwho suffer from asthma are particularly sensitive to the effects of sulfur dioxide."
//         document.getElementById("para").innerHTML = graphParagraph;

//       }else if(poll == 3){

//         graphTitle = "Nitrogen Oxides (NO"+string2.sub()+")"
//         document.getElementById("sTitle").innerHTML = graphTitle;
//         graphParagraph = "Nitrogen Oxides (NO"+string2.sub()+") represents a family of seven compounds, of which the EPA regulates one, NO"+string1.sub()+".\nNitrogen Oxides are harmful pollutants by themselves, but are also of importance due to the fact\nthat they react with other molecules to form ozone in the troposphere, which is the air we\nbreathe, and create acid rain. Acid rain is known to be generally harmful but ozone is also a\nleading cause of smog which has many health related consequences."
//         document.getElementById("para").innerHTML = graphParagraph;

//       }

// }

// function updateSecondGraph(data){
//     var qualInfo = "Qualitative"
//       //specify which data to display

//     if(poll == 1){
//         data.forEach(function(d) {
//           d.id     =  d.id;
//           d.order  = +d.order;
//           d.color  =  d.color;
//           d.value  = d.co2N;
//           d.label  =  d.label;
//         });

//       }else if(poll == 2){
//         data.forEach(function(d) {
//           d.id     =  d.id;
//           d.order  = +d.order;
//           d.color  =  d.color;
//           d.value  = d.so2N;
//           d.label  =  d.label;
//         });

//       }else if(poll == 3){
//          data.forEach(function(d) {
//           d.id     =  d.id;
//           d.order  = +d.order;
//           d.color  =  d.color;
//           d.value  = d.noxN;
//           d.label  =  d.label;
//         });

//       }
//       y.domain([0, d3.max(data, function(d) { return d.value; })]);

//     // console.log(svg.select("g")[0][0]);
//     xPos = 550;

//     var bars = svg.selectAll(".bar").data(data, function(d){return d.label});
//     d3.selectAll('rect').remove();  //remove all rectangles from bar graph before updating
//     d3.selectAll('.axis').remove(); //clear y-axis before updating

//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate("+xPos+", 200)")
//         .attr("opacity",0)
//         .style("fill","white")
//         .call(xAxis)
//       .selectAll("text")
//         .style("text-anchor","end")
//         .style("fill","white")
//         .attr("dx", "-.8em")
//         .attr("dy", "-.55em")
//         .attr("transform", "rotate(-90)" );

//     svg.append("g")
//           .attr("class", "y axis")
//           .attr("transform", "translate("+xPos+", -190)")  //position of y-val with ticks
//           .attr("opacity",0)
//           .style("fill","white")
//           .call(yAxis)
//         .append("text")
//           .attr("transform", "rotate(-90)")
//           .attr("y", 6)
//           .attr("dy", ".71em")
//           .style("text-anchor", "end")
//           .style("fill","white")
//           .text("Emissions in grams (g)");

//       bars.enter().append("rect")
//           .attr("opacity",0)
//           .style("fill", function(d) { return(d.color); })
//           .attr("x", function(d) { return x(d.label); })
//           .attr("width", x.rangeBand())
//           .attr("y", function(d) { return y(d.value); })
//           .attr("height", function(d) { return height - y(d.value); })
//           .attr("transform", "translate("+xPos+", -190)")
//           .on('mouseover', tipSec.show)
//           .on('mouseout', tipSec.hide);

//       //fade in second graph after updating all values
//       svg.selectAll("g").transition().style('opacity',1).duration(1500);
//       bars.transition().attr("opacity",1).duration(1000);

// }

// function animateBack(){
//     var graphTransition = svg.transition();
//     graphTransition.attr("transform", "translate(800,440)").duration(1000);

//     // barGraph(inputVals,window.width);  //create bar graph
//     svg.selectAll("g").transition().style('opacity',0).duration(1000);  //fade in axis' during transition
//     svg.selectAll("rect").transition().style('opacity',0).duration(1000);  //fade in bars on

//     document.getElementById("totals").style.display = "block";
//     document.getElementById("back").style.display = "none";

//     document.getElementById("slider-labels").style.display = "block";
//     document.getElementById("sliders").style.display = "block";

//     document.getElementById("secondTitle").style.display = "none";
//     document.getElementById("qualInfo").style.display = "none";

//     document.getElementById('line').style.display = "block";
//     document.getElementById('line2').style.display = "block";

//     svg.selectAll("rect").on("mouseover",tipSec.hide);  //hide pop up info when graph is hidden
// }























//make all a class and then turn on and off depending which is clicked
// var paras = document.getElementsByClassName("1");
// console.log(x);


////////calculation functions////////////

function calcKWH(bill){  //break down electric bill into kWh

  //avg price per kWh from DoE through https://www.electricitylocal.com/states/new-york/new-york/#ref
  longkWh = bill / data_price;  //23.21 cents is avg. cost per kWh in NYC
  kWh = longkWh.toFixed(2);

  return kWh;
}

function runCalc(){

        sourceBreakDown(kWh, natgasPerc, nucPerc, coalPerc, solarPerc, windPerc);

        calcCO2(natGasPercent,nuclearPercent,coalPercent, solarPercent, windPercent, manip);
        calcSO2(natGasPercent,nuclearPercent,coalPercent, solarPercent, windPercent, manip);
        calcNOx(natGasPercent,nuclearPercent,coalPercent, solarPercent, windPercent, manip);
        calcPM(natGasPercent,nuclearPercent,coalPercent, solarPercent, windPercent, manip);

        calcHealthCosts(totalSO2, totalNOx, totalPM, manip);
        calcEnvirCosts(totalCO2, manip);
        calcLandUse(natGasPercent, nuclearPercent, coalPercent, solarPercent, windPercent, manip);

        checkEmitLevels(totalCO2,totalSO2,totalNOx, totalPM, annualHealthCost, annualEnvirCost);

        document.getElementById("nGnum").innerHTML = (100*natgasPerc).toFixed(0)+"%";
        document.getElementById("Nnum").innerHTML = (100*nucPerc).toFixed(0)+"%";
        document.getElementById("Cnum").innerHTML = (100*coalPerc).toFixed(0)+"%";
        document.getElementById("Snum").innerHTML = (100*solarPerc).toFixed(0)+"%";
        document.getElementById("Wnum").innerHTML = (100*windPerc).toFixed(0)+"%";


}

function sourceBreakDown(energy,naP,nuP,cP,sP,wP){  //break kWh into how many per energy source
        console.log(energy);

        coalPercent = energy * cP;
        solarPercent = energy * sP;
        windPercent = energy * wP;

        natGasPercent = energy * naP;

        nuclearPercent = energy * nuP;


        return natGasPercent;
        return nuclearPercent;
        return coalPercent;
        return solarPercent;
        return windPercent;
}

var string1 = "2";
var string2 = "x";
var string3 = "2";

function calcCO2(natGas, nuclear, coal, solar, wind, manip){  //calculate CO2 emissions total and by energy source
        //console.log(natGas, nuclear);
        natGasCO2 = natGas * data_naturalgasCO2;  //460 g CO2 eq/kWh on average from DoE 2010
        inputVals[4].co2N = natGasCO2;  //add value to data set

        nuclearCO2 = nuclear * data_nuclearCO2;  //66 g CO2 eq/kWh from DoE 2010
        inputVals[2].co2N = nuclearCO2;

        coalCO2 = coal * data_coalCO2; //avg. 915g CO2 eq from DoE 2010
        inputVals[3].co2N = coalCO2;

        solarCO2 = solar * data_solarCO2;  //37.5 avg from DoE 2010
        inputVals[0].co2N = solarCO2;

        windCO2 = wind * data_windCO2;  //15.5 avg from DoE 2010
        inputVals[1].co2N = windCO2;

        totalCO2 = nuclearCO2 + natGasCO2 + coalCO2 + solarCO2 + windCO2;
        totalCO2forText = totalCO2.toLocaleString(undefined, {maximumFractionDigits: 1});

        if(manip){
          document.getElementById("manipTotalTitle").innerHTML = "Your Energy Solution:";
          document.getElementById("myTotalCO2").innerHTML = totalCO2forText+" grams of CO"+string1.sub()+"-eq";

          // document.getElementById("myTotalHealth").innerHTML = "$"+totalCO2forText;  //health costs
          // document.getElementById("myTotalEnvir").innerHTML = "$"+totalCO2forText;  //environmental costs
        }else{
          document.getElementById("totalTitle").innerHTML = "NYC's Energy Portfolio:";

          document.getElementById("emissionTitle").innerHTML = "Emissions Produced:";
          document.getElementById("totalCO2").innerHTML = totalCO2forText+" grams of CO"+string1.sub()+"-eq";

          document.getElementById("healthTitle").innerHTML = "Annual Health Costs:";  //insert health costs here
          // document.getElementById("totalHealth").innerHTML = "$"+totalCO2forText;

          document.getElementById("envirTitle").innerHTML = "Annual Environmental Costs:";  //insert environmental costs here
          // document.getElementById("totalEnvir").innerHTML = "$"+totalCO2forText;
        }

        inputVals[2].CO2 = 100 * (nuclearCO2/totalCO2);  //update input array with percentage of total for nuclear
        inputVals[4].CO2 = 100 * (natGasCO2/totalCO2);  //update input array with percentage of total for natGAs

        inputVals[0].CO2 = 100 * (solarCO2/totalCO2);
        inputVals[1].CO2 = 100 * (windCO2/totalCO2);
        inputVals[3].CO2 = 100 * (coalCO2/totalCO2);


        return natGasCO2;
        return nuclearCO2;

 }

 function calcSO2(natGas, nuclear, coal, solar, wind, manip){

        natGasSO2 = natGas * data_naturalgasSO2; //avg g/kWh of SO2 from DoE 2010
        inputVals[4].so2N = natGasSO2;

        nuclearSO2 = nuclear * data_nuclearSO2; //avg g/kWh of SO2 from DoE Denmark 2013
        inputVals[2].so2N = nuclearSO2;

        coalSO2 = coal * data_coalSO2;  //1.395 g avg DoE 2010
        inputVals[3].so2N = coalSO2;

        solarSO2 = solar * data_solarSO2;  // .21 g avg DoE Denmark 2013
        inputVals[0].so2N = solarSO2;

        windSO2 = wind * data_windSO2;  // .055 g avg DoE Denmark 2013
        inputVals[1].so2N = windSO2;

        totalSO2 = natGasSO2 + nuclearSO2 + coalSO2 + solarSO2 + windSO2;

        if(manip){
          document.getElementById("myTotalSO2").innerHTML = totalSO2.toFixed(2)+" grams of SO"+string3.sub()
        }else{
          document.getElementById("totalSO2").innerHTML = totalSO2.toFixed(2)+" grams of SO"+string3.sub()
        }

        inputVals[2].SO2 = 100 * (nuclearSO2/totalSO2);
        inputVals[4].SO2 = 100 * (natGasSO2/totalSO2);

        //will be updated once sliders added
        inputVals[0].SO2 = 100 * (solarSO2/totalSO2);
        inputVals[1].SO2 = 100 * (windSO2/totalSO2);
        inputVals[3].SO2 = 100 * (coalSO2/totalSO2);

  }

  function calcNOx(natGas, nuclear, coal, solar, wind, manip){

        natGasNOx = natGas * data_naturalgasNOX; //avg g/kWh of NOx from DoE 2010
        inputVals[4].noxN = natGasNOx;

        nuclearNOx = nuclear * data_nuclearNOX; //avg g/kWh of NOx from DoE Denmark
        inputVals[2].noxN = nuclearNOx;

        coalNOx = coal * data_coalNOX; // 1.16 g avg DoE 2010
        inputVals[3].noxN = coalNOx;

        solarNOx = solar * data_solarNOX; // 0.275 g avg DoE Denmark
        inputVals[0].noxN = solarNOx;

        windNOx = wind * data_windNOX; // 0.065 DoE Denmark
        inputVals[1].noxN = windNOx;

        totalNOx = natGasNOx + nuclearNOx + coalNOx + solarNOx + windNOx;

        if(manip){
          document.getElementById("myTotalNOx").innerHTML = totalNOx.toFixed(2)+" grams of NO"+string2.sub()
        }else{
          document.getElementById("totalNOx").innerHTML = totalNOx.toFixed(2)+" grams of NO"+string2.sub()
        }

        inputVals[2].NOX = 100 * (nuclearNOx/totalNOx);
        inputVals[4].NOX = 100 * (natGasNOx/totalNOx);

        //will be updated once sliders added
        inputVals[0].NOX = 100 * (solarNOx/totalNOx);
        inputVals[1].NOX = 100 * (windNOx/totalNOx);
        inputVals[3].NOX = 100 * (coalNOx/totalNOx);

  }

  function calcPM(natGas, nuclear, coal, solar, wind, manip){

      svg.selectAll("circle").remove();

      //all are in g/kWh from National Academy of Sciences 2010 Source
      natGasPM = natGas * data_naturalgasPM;

      nuclearPM = nuclear * data_nuclearPM;

      coalPM = coal * data_coalPM;

      solarPM = solar * data_solarPM;

      windPM = wind * data_windPM;

      totalPM = natGasPM + nuclearPM + coalPM + solarPM + windPM;

      if(manip){
        document.getElementById("myTotalPM").innerHTML = totalPM.toFixed(2)+" grams of PM";
      }else{
        document.getElementById("totalPM").innerHTML = totalPM.toFixed(2)+" grams of PM";
      }

      var nGPMA = Math.round(natGasPM);
      var nPMA = Math.round(nuclearPM);
      var cPMA = Math.round(coalPM);
      var sPMA = Math.round(solarPM);
      var wPMA = Math.round(windPM);

      //natural gas
      for(var i = 1; i < nGPMA; i+=5){
         var cx = 98 + i;
         var cxNeg = 245 + (i*2.5);

         var circle = svg.append("circle")  //natural gas
              .attr("cx", -cxNeg)
              .attr("cy", -cxNeg * 0.73)
              .attr("r", 5)
              .attr("fill", "white");
      }

      //nuclear
      for(var i = 1; i < nPMA; i+=5){
         var cx = 98 + i;
         var circle = svg.append("circle")  //nuclear
                          .attr("cx", cx)
                          .attr("cy", cx * 2.94)
                          .attr("r", 5)
                          .attr("fill", "white");
      }

      //coal
      for(var i = 1; i < cPMA; i+=5){
         var cx = 98 + i;
         var cxNeg = 245 + (i*2.5); //adjusted x-val for these angles
         var circle = svg.append("circle")  //coal
                          .attr("cx", -cxNeg)
                          .attr("cy", cxNeg * 0.73)
                          .attr("r", 5)
                          .attr("fill", "white");
      }

      //solar
      for(var i = 1; i < sPMA; i+=5){
         var cx = 98 + i;
         var circle = svg.append("circle")  //solar
                          .attr("cx", cx)
                          .attr("cy", -cx * 2.94)
                          .attr("r", 5)
                          .attr("fill", "white");
      }

      //wind
      for(var i = 1; i < wPMA; i+=5){
         var cx = 98 + i;
         var circle = svg.append("circle")  //wind
                          .attr("cx", 304 + 3*i)
                          .attr("cy", 0)
                          .attr("r", 5)
                          .attr("fill", "white");
      }

      // console.log(natGasPM,nuclearPM,coalPM,solarPM,windPM);
      // console.log(natGas);

  }




function calcHealthCosts(SO2, NOX, PM, manip){
    //all of the below are $/gram
    SO2Cost = SO2 * data_healthSO2;
    NOXCost = NOX * data_healthNOX;
    PMCost = PM * data_healthPM;

    healthCost = SO2Cost + NOXCost + PMCost;
    annualHealthCost = healthCost * 12; //(healthCost = monthly costs for individual)
    console.log("$"+annualHealthCost);

    if(manip){
      document.getElementById("myTotalHealth").innerHTML = "$" + annualHealthCost.toFixed(2)
    }else{
      document.getElementById("totalHealth").innerHTML = "$" + annualHealthCost.toFixed(2)
    }
}

function calcEnvirCosts(CO2, manip){
    envirCost = CO2 * data_envirCO2; //($0.00004/gram of CO2)
    annualEnvirCost = envirCost* 12
    console.log("$"+annualEnvirCost);

    if(manip){
      document.getElementById("myTotalEnvir").innerHTML = "$" + annualEnvirCost.toFixed(2)
    }else{
      document.getElementById("totalEnvir").innerHTML = "$" + annualEnvirCost.toFixed(2)
    }
}

var landUse = [
  {id: "NYCLand", order: 1, color: "#1f3f58", weight: 1, land: 22.82, label:"Area of Manhattan"},
  {id: "NYCEnergy" , order: 2, color: "#a03973", weight: 1, land: 50, label:"NYC Energy Portfolio"},
  {id: "ManipEnergy", order: 3, color: "#9ebdd5", weight: 1, land: 0,  label:"Your Energy Portfolio"},
]

function calcLandUse(natGas, nuclear, coal, solar, wind, manip){

  //source = https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5015902/  (2016)
  //all figures are measured in km^2 / kWh
  //alculate all for population of nyc (assume everyone us using the amount of energy you are)

  nGLand = natGas * data_naturalgasland;

  nLand = nuclear * data_nuclearland;

  cLand = coal * data_coalland;

  sLand = solar * data_solarland;

  wLand = wind * data_windland;

  totalLandUse = nGLand + nLand + cLand + sLand + wLand;
  nycTotalLandUse = totalLandUse * 3000000; //3M households in NYC http://www.baruch.cuny.edu/nycdata/income-taxes/hhold_income-numbers.htm

  if(manip){
    landUse[2].land = nycTotalLandUse;
  }else{
    landUse[1].land = nycTotalLandUse;
  }

  // console.log(nycTotalLandUse);
  landUseChart(landUse);

}





///////////////land area graph set up//////////////////////
var marginL = {top: 20, right: 20, bottom: 70, left: 40},
    width = 450 - marginL.left - marginL.right,
    height = 350 - marginL.top - marginL.bottom;

var xL = d3.scale.ordinal().rangeRoundBands([0, width - 50], .05);

var yL = d3.scale.linear().range([height, 0]);

var xAxisL = d3.svg.axis()
    .scale(xL)
    .orient("bottom");

var yAxisL = d3.svg.axis()
    .scale(yL)
    .orient("left")
    .ticks(10)
    .tickFormat(formatPercemt1);

var svgL = d3.select("#landGraphPos").append("svg")
    .attr("width", width + marginL.left + marginL.right)
    .attr("height", height + marginL.top + marginL.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");




//////////////land area graph func////////////////////
function landUseChart(data){
  d3.selectAll('rect').remove();  //remove all rectangles from bar graph before updating
  d3.selectAll('.axis').remove(); //clear y-axis before updating

  data.forEach(function(d) {
        d.id     =  d.id;
        d.order  = +d.order;
        d.color  =  d.color;
        d.value  = d.land;
        d.label  =  d.label;
    });

  xL.domain(data.map(function(d) { return d.label; }));
  yL.domain([0, d3.max(data, function(d) { return d.value; })]);


  svgL.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", function(d) { return d.color; })
      .attr("x", function(d) { return xL(d.label); })
      .attr("width", xL.rangeBand())
      .attr("y", function(d) { return yL(d.value); })
      .attr("height", function(d) { return height - yL(d.value); });

  svgL.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, "+height+")")
      .style("fill","white")
      .call(xAxisL)
    .selectAll(".tick text")
      .call(wrap, xL.rangeBand());

  svgL.append("g")
      .attr("class", "y axis")
      .style("fill","white")
      .call(yAxisL)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill","white")
      .text("Land Area (km^2)");

}

////wrapping label text of land graph//////
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function type(d) {
  d.value = +d.value;
  return d;
}

//////




        var newCO2;
        var newSO2;
        var newNOX;
        var newPM;
        var initCO2;
        var initSO2;
        var initNOX;
        var initPM;


        var newHealth;
        var newEnvir;
        var initHealth;
        var initEnvir;

        var newLand;
        var initLand;



  ////////////change color of text if larger than NYC levels////////////
  function checkEmitLevels(co2,so2,nox,pm,health,envir){

      //save initial totals and update new ones
      if(manip){
        newCO2 = co2;
        newSO2 = so2;
        newNOX = nox;
        newPM = pm;
        document.getElementById("circ1").style.display = "block";
        document.getElementById("circ2").style.display = "block";
        document.getElementById("circ3").style.display = "block";
        document.getElementById("circ4").style.display = "block";
      }else{
        initCO2 = co2;
        initSO2 = so2;
        initNOX = nox;
        initPM = pm;
      }

      //change color if less or more than nyc
      if(newCO2 > initCO2){
        document.getElementById("circ1").style.background = "#FF4D4D";
      } else if(newCO2 < initCO2){
        document.getElementById("circ1").style.background = "#9bbb71";
      }

      if(newSO2 > initSO2){
        document.getElementById("circ2").style.background = "#FF4D4D";
      }else{
        document.getElementById("circ2").style.background = "#9bbb71";
      }

      if(newNOX > initNOX){
        document.getElementById("circ3").style.background = "#FF4D4D";
      }else{
        document.getElementById("circ3").style.background = "#9bbb71";
      }
      if(newPM > initPM){
        document.getElementById("circ4").style.background = "#FF4D4D";
      }else{
        document.getElementById("circ4").style.background = "#9bbb71";
      }


      //same as above for health and envir costs
      if(manip){
        newHealth = health;
        newEnvir = envir;
        document.getElementById("circ5").style.display = "block";
        document.getElementById("circ6").style.display = "block";
      }else{
        initHealth = health;
        initEnvir = envir;
      }

      if(newHealth > initHealth){
        document.getElementById("circ5").style.background = "#FF4D4D";
      }else{
        document.getElementById("circ5").style.background = "#9bbb71";
      }

      if(newEnvir > initEnvir){
        document.getElementById("circ6").style.background = "#FF4D4D";
      }else{
        document.getElementById("circ6").style.background = "#9bbb71";
      }


      newLand = landUse[2].land;
      initLand = landUse[1].land;

      //same as above but for land use
      if(newLand > initLand){
        landUse[2].color = "#FF4D4D";
      }else if (newLand < initLand){
        landUse[2].color = "#9bbb71";
      }

  }



////////////////////// popUp information //////////////////////////
var popUpWindow = document.getElementById("categoryInfo");
var popUpTitle = document.getElementById("catTitle");
var popUpBody = document.getElementById("catBody");

document.getElementById("Q1").addEventListener("click", function(){

  popUpWindow.style.display = "inline-block";
  popUpTitle.innerHTML = "Emissions Produced"
  popUpBody.innerHTML = "These values were calculated through a comparison of multiple Life Cycle Analysis studies. Keeping this in mind, technology like solar power generation may not create any pollution while in operation but the construction of a solar panel can be very energy intensive and create air pollution. These emissions are included in these figures."


});


document.getElementById("Q2").addEventListener("click", function(){

  popUpWindow.style.display = "inline-block";
  popUpTitle.innerHTML = "Annual Health Costs"
  popUpBody.innerHTML = "Sulfur dioxide, nitrogen oxides, and particulate matter can all be attributed to physical impacts on humans at different concentrations. These impacts are then valued, using the accepted approach of mortality risk valuation, and are then broken down to price per gram of each pollutant. The costs shown reflect the calculated health costs due to the impact of the amount of pollutants attributed to your energy use. Keep in mind this number gets much bigger when multiplied by the number of households throughout the entire city. Source:  Jaramillo & Muller, Energy Policy, 90 (2016) 202-211";

});

document.getElementById("Q3").addEventListener("click", function(){

  popUpWindow.style.display = "inline-block";
  popUpTitle.innerHTML = "Annual Environmental Costs";
  popUpBody.innerHTML = "Environmental costs are the present value of future damages due to the harmful effects of increased carbon dioxide emissions on the environment. Some of the impacts used in the calculation of the figure shown here are: climate change effects, spreading of disease, decreased food production, coastal destruction, etc. (Source: US EPA)";

});

document.getElementById("Q4").addEventListener("click", function(){

  popUpWindow.style.display = "inline-block";
  popUpTitle.innerHTML = "Land Required";
  popUpBody.innerHTML = "Every electrical energy source requires space where their related generation technology, turbines, or panels will reside. The numbers represented here are an estimation of the amount of space needed for New York City’s energy portfolio as well as the portfolio you create. The graph reflects the amount of land needed if everyone in NYC used as much energy as you. Keep in mind that things like wind turbines, while requiring a lot of land, do leave open space in between them. Source: Trainor, Anne et. al., PLoS One, 2016";

});

document.getElementById("catClose").addEventListener("click", function(){

  popUpWindow.style.display = "none";

});



























///////labels////////
var text5 = svg.selectAll("text5")
  .data(inputVals)
  .enter()
  .append("text");

var text1 = svg.selectAll("text1")
  .data(inputVals)
  .enter()
  .append("text");

var text2 = svg.selectAll("text2")
  .data(inputVals)
  .enter()
  .append("text");

var text3 = svg.selectAll("text3")
  .data(inputVals)
  .enter()
  .append("text");

var text4 = svg.selectAll("text4")
  .data(inputVals)
  .enter()
  .append("text");


var arcMid1 = ((radiusX + 60)/2);
var arcMid2 = (-(0 + 500)/2);

var arcMid3 = ((radiusX + 290)/2);
var arcMid4 = ((0 + 190)/2);

var arcMid5 = (-20);
var arcMid6 = ((0 + 630)/2);

var arcMid7 = (-(radiusX + 340)/2);
var arcMid8 = ((0 + 220)/2);

var arcMid9 = (-(radiusX + 230)/2);
var arcMid10 = (-(0 + 480)/2);

var textLabels0 = text1  //solar
                  .attr("font-size","16px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", arcMid1 )
                  .attr("y", arcMid2 )
                  .attr("fill","white")
                  .text(inputVals[0].id);

var textLabels1 = text2 //wind
                  .attr("font-size","16px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", arcMid3 )
                  .attr("y", arcMid4 )
                  .attr("fill","white")
                  .text(inputVals[1].id);

var textLabels2 = text3  //nuclear
                  .attr("font-size","16px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", arcMid5 )
                  .attr("y", arcMid6 )
                  .attr("fill","white")
                  .text(inputVals[2].id);

var textLabels3 = text4  //coal
                  .attr("font-size","16px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", arcMid7 )
                  .attr("y", arcMid8 )
                  .attr("fill","white")
                  .text(inputVals[3].id);

var textLabels4 = text5  //natural gas
                  .attr("font-size","16px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", arcMid9 )
                  .attr("y", arcMid10 )
                  .attr("fill","white")
                  .text(inputVals[4].id);






var rectN = svg.append("rect")  //rectangle for NOx
                .attr("x", -1)
                .attr("y", -radiusX + 6)
                .attr("width", 3)
                .attr("height", 15)
                .attr("fill", "#3973a0");

var rectS = svg.append("rect") //rectangle for SO2
                .attr("x", -1)
                .attr("y", -radiusX + 74)
                .attr("width", 3)
                .attr("height", 15)
                .attr("fill", "#3973a0");

var rectC = svg.append("rect")  //rectangle for CO2
                .attr("x", -1)
                .attr("y", -radiusX + 147)
                .attr("width", 3)
                .attr("height", 15)
                .attr("fill", "#3973a0");


var textN = svg.selectAll("textN")  //text for NOx
  .data(inputVals)
  .enter()
  .append("text");
var textNSub = svg.selectAll("textNSub")  //subscripted x
  .data(inputVals)
  .enter()
  .append("text");

var textLabelsN = textN  //NOx
                  .attr("font-size","16px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", -15 )
                  .attr("y", -radiusX + 18 )
                  .attr("fill","white")
                  .text("NO");
var textLabelsNSub = textNSub  //NOx subscript
                  .attr("font-size","14px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", 11 )
                  .attr("y", -radiusX + 18 )
                  .attr("fill","white")
                  .attr("baseline-shift","sub")
                  .text("X");

var textS = svg.selectAll("textS")  //text for SO2
  .data(inputVals)
  .enter()
  .append("text");

var textSSub = svg.selectAll("textSSub")  //subscripted 2
  .data(inputVals)
  .enter()
  .append("text");

var textLabelsS = textS  //SO2
                  .attr("font-size","16px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", -15 )
                  .attr("y", -radiusX + 86 )
                  .attr("fill","white")
                  .text("SO");

var textLabelsSSub = textSSub  //SO2 subscript
                  .attr("font-size","14px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", 9 )
                  .attr("y", -radiusX + 86 )
                  .attr("fill","white")
                  .attr("baseline-shift","sub")
                  .text("2");



var textC = svg.selectAll("textC") //text for CO2
  .data(inputVals)
  .enter()
  .append("text");
var textCSub = svg.selectAll("textCSub") //subscripted 2
  .data(inputVals)
  .enter()
  .append("text");

var textLabelsC = textC  //CO2
                  .attr("font-size","16px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", -15 )
                  .attr("y", -radiusX + 160 )
                  .attr("fill","white")
                  .html("CO");

var textLabelsCSub = textCSub  //CO2 subscript
                  .attr("font-size","14px")
                  .attr("font-family","Avenir Next")
                  .attr("font-weight","lighter")
                  .attr("x", 11 )
                  .attr("y", -radiusX + 160 )
                  .attr("fill","white")
                  .attr("baseline-shift","sub")
                  .html("2");
