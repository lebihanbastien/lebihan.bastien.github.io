(function foodChart() {

//---------------------------------------------------------------------------------------------------------------
// ToDo
//---------------------------------------------------------------------------------------------------------------
// See https://www.d3-graph-gallery.com/graph/custom_responsive.html for interactive resizing
// Add title on graph, and creates the corresponding option in Liquid tag (no figcaption)
// Add the logistics steps, with right color, and hovering
// Add tooltips.

//---------------------------------------------------------------------------------------------------------------
// Build general layout
//---------------------------------------------------------------------------------------------------------------
// Fonts
var font_size = "18"
var font_family = "Roboto"//, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif;"

// Get size of parent element, with id 'fresque_food_parent'
var element = document.getElementById('fresque_food_parent');
var positionInfo = element.getBoundingClientRect();
var height_parent = positionInfo.height;
var width_parent = positionInfo.width;

//var font_family = element.style.fontFamily;

if(width_parent == 0) {
  width_parent = 800;
} else {
}

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 80, left: 160},
width = width_parent - margin.left - margin.right,
height = width_parent*0.8 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg = d3.select("#fresque_food")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");




//---------------------------------------------------------------------------------------------------------------
// Parse the Data
//---------------------------------------------------------------------------------------------------------------
d3.csv("/assets/javascript/fresque/GHG-emissions-by-life-cycle-stage-OurWorldinData-upload_fr.csv", function(data) {

  //---------------------------------------------------------------------------------------------------------------
  // Prepare data
  //---------------------------------------------------------------------------------------------------------------
  // Sort data
  function computeTotal(d){
    return +d.LUC + +d.AnimalFeed + +d.Farm + +d.Processing + +d.Transport + +d.Packaging + +d.Retail;
  }
  data.sort(function(a, b) { return computeTotal(b) - computeTotal(a); });  

  // List of subgroups = header of the csv files 
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()

  //---------------------------------------------------------------------------------------------------------------
  // X-axis elements
  //---------------------------------------------------------------------------------------------------------------
  // Add X axis
  var x = d3.scaleLinear()
  .domain([0, 60])
  .range([0, width]);

  // X label
  svg.append("text") 
  .attr("font-family", font_family)            
  .attr("transform",
    "translate(" + (width/2) + " ," + 
    (height + margin.top + margin.bottom*0.6) + ")")
  .style("text-anchor", "middle")
  .text("Emissions de gaz à effet de serre par kg de produit (kg CO2-equivalent/kg)");

  // X grid
  const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(5);

  svg.append('g')
  .attr('class', 'x axis-grid')
  .attr('transform', 'translate(0,' + height + ')')
  .attr('stroke', '#def')
  .attr('stroke-opacity', '0.1')
  .call(xAxisGrid);

  // Draw X-axis
  var xPadding = 5
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickPadding(xPadding))
  .attr("font-size", font_size)
  .attr("font-family", font_family)
    //.selectAll("text")
      //.attr("transform", "translate(-10,0)rotate(-45)")
      //.style("text-anchor", "end");

  //---------------------------------------------------------------------------------------------------------------
  // Y-axis elements
  //---------------------------------------------------------------------------------------------------------------
  // Y axis
  var y = d3.scaleBand()
  .range([ 0, height])
  .domain(groups)
    .paddingInner(0.3) // edit the inner padding value in [0,1]
    .paddingOuter(0)
    .align(0.5);

  // Draw
  var yPadding = 5
  svg.append("g")
  .attr("transform", "translate(0,0)")
  .call(d3.axisLeft(y).tickSize(0).tickPadding(yPadding))
  .attr("font-size", font_size)
  .attr("font-family", font_family)
    .attr("x", "-20"); // moves the text to the left by 20


    // ----------------
  // Create a tooltip
  // ----------------
  var tooltip = d3.select("#fresque_food")
    .append("div")
    .style("visibility", "hidden")
    .style("position", "absolute")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  //---------------------------------------------------------------------------------------------------------------
  // Draw data
  //---------------------------------------------------------------------------------------------------------------
  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#1fa345','#a3745d','#f36f32','#407aac','#ef4b55','#f3ca16','#fbdb0ac'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
  .keys(subgroups)
  (data)

  // What happens when user hover a bar
  var mouseover = function(d) {
    // what subgroup are we hovering?
    var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
    var subgroupValue = d.data[subgroupName];
    // Reduce opacity of all rect to 0.2
    d3.selectAll(".myRect").style("opacity", 0.2)
    // Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.
    d3.selectAll("."+subgroupName)
    .style("opacity", 1)

    d3.select(this).style("cursor", "pointer"); 

    
     tooltip
        .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
        //.style("visibility", "visible");
  }

  var mousemove = function(d) {
    var xMouse = event.pageX//d3.select(this).attr("x")
    var yMouse = event.pageY//d3.select(this).attr("y")

    tooltip
      .style("left", (xMouse) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (yMouse) + "px")
  }

  // When user do not hover anymore
  var mouseleave = function(d) {
    // Back to normal opacity: 0.8
    d3.selectAll(".myRect")
    .style("opacity",1.0)

    d3.select(this).style("cursor", "default"); 

    tooltip
      .style("visibility", "hidden")
  }

  //Get class
  function setClass(d){ return ("myRect " + d.key);}
  function setColor(d){ return color(d.key);}

  // Show the bars
  svg.append("g")
  .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function(d)  { return setColor(d)})
      .attr("class", function(d) {return setClass(d)}) // Add a class to each subgroup: their name
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return x(d[0]); })
      .attr("y", function(d) { return y(d.data.group); })
      .attr("height", y.bandwidth())
      .attr("width",function(d) { return x(d[1]) - x(d[0]); })
      .attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
      .on("mousemove", mousemove)

      var widthButton = 200;
      var heighButton = 50
      var xPosButton = width - 6*width/20
      var yPosButton = height- 6*height/10
      var dyPosButton = heighButton+10;


      //LUC,AnimalFeed,Farm,Processing,Transport,Packaging,Retail,
      var dataLUC = [{LUC: 0, text: "Usage des sols", xPos: xPosButton, yPos: yPosButton, height:heighButton, width:widthButton}];
      var stackedDataLUC = d3.stack().keys(["LUC"])(dataLUC);

      var dataAnimalFeed = [{AnimalFeed: 0, text: "Alimentation animale", xPos: xPosButton, yPos: yPosButton+dyPosButton, height:heighButton, width:widthButton}];
      var stackedDataAnimalFeed = d3.stack().keys(["AnimalFeed"])(dataAnimalFeed);

      var dataFarm = [{Farm: 0, text: "Exploitation", xPos: xPosButton, yPos: yPosButton+2*dyPosButton, height:heighButton, width:widthButton}];
      var stackedDataFarm = d3.stack().keys(["Farm"])(dataFarm);

      var dataProcessing = [{Processing: 0, text: "Transformation", xPos: xPosButton, yPos: yPosButton+3*dyPosButton, height:heighButton, width:widthButton}];
      var stackedDataProcessing = d3.stack().keys(["Processing"])(dataProcessing);

      var dataTransport = [{Transport: 0, text: "Transport", xPos: xPosButton, yPos: yPosButton+4*dyPosButton, height:heighButton, width:widthButton}];
      var stackedDataTransport = d3.stack().keys(["Transport"])(dataTransport);

      var dataPackaging = [{Packaging: 0, text: "Emballage", xPos: xPosButton, yPos: yPosButton+5*dyPosButton, height:heighButton, width:widthButton}];
      var stackedDataPackaging = d3.stack().keys(["Packaging"])(dataPackaging);

      var dataRetail = [{Retail: 0, text: "Vente", xPos: xPosButton, yPos: yPosButton+6*dyPosButton, height:heighButton, width:widthButton}];
      var stackedDataRetail = d3.stack().keys(["Retail"])(dataRetail);

      

      function addButton(stackedDataButton)
      {

        //Add rectangle
        svg.append("g")
        .selectAll("g")
        .data(stackedDataButton)
        .enter().append("g")
        .attr("fill", function(d)  { return setColor(d)})
          .attr("class", function(d) {return setClass(d)}) // Add a class to each subgroup: their name
          .selectAll("rect")
          .data(function(d) { return d; })
          .enter().append("rect")
          .attr("x", function(d) { return d.data.xPos; })
          .attr("y", function(d) { return d.data.yPos; })
          .attr("height", function(d) { return d.data.height; })
          .attr("width",  function(d) { return d.data.width; })
          .attr("stroke", "grey")
          .on("mouseover", mouseover)
          .on("mouseleave", mouseleave)
          .on("mousemove", mousemove)

        // Add text
        svg.append("g")
        .selectAll("g")
        .data(stackedDataButton)
        .enter().append("g")
        .attr("fill", function(d)  { return setColor(d)})
          .attr("class", function(d) {return setClass(d)}) // Add a class to each subgroup: their name
          .selectAll("rect")
          .data(function(d) { return d; })
          .enter()
          .append("text")
          .attr("x", function(d) { return d.data.xPos+d.data.width/2; })
          .attr("y", function(d) { return d.data.yPos+d.data.height/2; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .attr('fill', "white")
          .text(function(d) { return d.data.text; })
          .on("mouseover", mouseover)
          .on("mouseleave", mouseleave)
          .on("mousemove", mousemove)
    }
    
    addButton(stackedDataLUC);
    addButton(stackedDataAnimalFeed);
    addButton(stackedDataFarm);
    addButton(stackedDataProcessing);
    addButton(stackedDataTransport);
    addButton(stackedDataPackaging);
    addButton(stackedDataRetail);

    svg.append("text")
    .attr("x", xPosButton+widthButton/2)
    .attr("y", yPosButton-1*dyPosButton)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text("Passer la souris sur chaque élément");

    svg.append("text")
    .attr("x", xPosButton+widthButton/2)
    .attr("y", yPosButton-0.5*dyPosButton)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text("pour isoler sa contribution ");


    svg.append("text")
    .attr("x", xPosButton+widthButton)
    .attr("y", yPosButton+7.5*dyPosButton)
    .attr("dy", ".35em")
    .attr("font-style", "italic")
    .attr("text-anchor", "end")
    .attr('fill', "grey")
    .text("Source: Our World in Data, d'après Poore & Nemecek (2018)");

  })
}());


