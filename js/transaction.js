let trans = []; // dataset from tsv file

let tranData = [];

let myLocations =[];
let myHours = [];



let margin = {top: 0, right: 30, bottom: 30, left: 140},
  width = 1000 - margin.left - margin.right,
  height = 570 - margin.top - margin.bottom;

let tooltipT = d3.select("body").select(".tran-figure")
.append("div")
.style('position', 'absolute')
.style("z-index", "10")
.style("visibility", "hidden")
.style("background-color", "white")
.text("a simple tooltip");

//Create SVG element
let svgT = d3.select("body").select(".tran-figure") 
    .append("svg")
    .attr("class","svg_trans")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



d3.csv("data/cc_data.csv")
    .row( (d, i) => {
       //1/6/2014 7:28

        let dateParse = d3.timeParse("%m/%d/%Y %H:%M");
        let timeobj=dateParse(d.timestamp);
        let months = timeobj.getMonth()+1;
        let days = timeobj.getDate();
        let dates = months+"/"+days;
        let hours = timeobj.getHours();
        let fullName = d.FirstName + " " + d.LastName;

        return {
        timeStamp: d.timestamp,
        location: d.location,
        price: +d.price,
        name: fullName,
        date: dates,
        day: days,
        hour: hours
        };
        
    })
    .get( (error, rows) => {
        console.log("Transaction!");
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ", rows[0])
            console.log("Last  row: ", rows[rows.length-1])
        }
        
        transData(rows);

        
        // Build X scales and axis:
        let x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myHours)
        .padding(0.01);

        svgT.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))



        // Build X scales and axis:
        let y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myLocations)
        .padding(0.01);
        
        svgT.append("g")
        .call(d3.axisLeft(y));



        // Build color scale
        let myColor = d3.scaleLinear()
        //.range(["white", "#69b3a2"])
        .range(["white", "#008B8B"])
        .domain([1,100])

        //Read the data


        svgT.selectAll()
        .data(tranData, function(d) {return d.hour+':'+d.location;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.hour) })
        .attr("y", function(d) { return y(d.location) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.number)} )
        .on('mouseover', function(d, i) {
            //console.log("mouseover", d);
            return tooltipT.style("visibility", "visible").style("color","black").style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
            //.text("Number of Records: "+d.number);
            .html("Location: " +d.location+"<br/>"+"Hour: "+d.hour+"<br/>"+"Number of Records: "+d.number);
        })
        .on('click', function(d) {



            //console.log("click!");
            //console.log(d.str);
            //console.log(d);

            d3.select("#chosen").text("");
            d3.select(".svgE").remove();




            let chosen = d3.select("body").select("#chosen")
                .append("h3")
                //.attr("class", "chosen")
                .style('position', 'absolute')
                .style("z-index", "10")
                .style("background-color", "white")
                .text("Details for transactions on "+d.location+" around "+d.hour+" o'clock");

            let treemap = d3.treemap()
                .tile(d3.treemapResquarify)
                .size([900, 270])
                .round(true)
                .paddingInner(10);
                
            let hi = d3.hierarchy(d.str)
                .sum(function(d){ return d.count; });
                //.sort(function(a,b){return b.value-a.value;})
                    
            treemap(hi);

            var tooltipE = d3.select("body").select(".details")
                .append("div")
                .style('position', 'absolute')
                .style("z-index", "10")
                .style("visibility", "hidden")
                .style("background-color", "white")
                .text("a simple tooltip");


            let svgE = d3.select(".details")
                .append('svg')
                .attr("class", "svgE")
                .attr('width', 900)
                .attr('height', 270);

                
            let cell = svgE.selectAll("g")
                .data(hi.leaves())
                .enter().append("g")
                //.attr('transform', 'translate(100, 0)');


            cell.append("rect")
                .attr("x",function(d){ return d.x0; })
                .attr("y",function(d){ return d.y0; })
                .attr("width",function(d){ return d.x1-d.x0; })
                .attr("height",function(d){ return d.y1-d.y0; })
                .attr("fill", "grey")
                
                .on('mouseover', function(d, i) {
                    //console.log(d);
                    return tooltipE.style("visibility", "visible").style("color","black").style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
                    //.text(d.data.name+": "+d.data.count);
                    .html("Employee: "+d.data.name+"<br/>"+"Number of records: "+d.data.count+"<br/>"+"Date: "+d.data.date);
                })

                
            cell.append("text")
                .attr("x",function(d) {return d.x0;})
                .attr("y",function(d) {return d.y0;})
                .attr("dx","0.5em")
                .attr("dy","1.5em")
                .attr("fill","white")
                .attr("font-size",14)  
                .text(function(d){   return d.data.name+": "+d.data.count;});
                //.html(function(d){   return d.data.name+"<br/>"+"Number of records: "+d.data.count;});
                //.html(d.data.name+"<br/>"+"Number of records: "+d.data.count);
        })



    });

    


function transData(rows) {
    //employees = [];
    

    //let locations = d3.map(rows, function(d){return(d.location)}).keys();
    let locations = [];
    for(let i = 0; i < rows.length; i++) {
        if(locations.includes(rows[i].location) == false) {
            locations.push(rows[i].location);
        }

    }
    console.log(locations);
    myLocations = locations;
    

    for(let i = 0; i < locations.length; i++) {
        for(let j = 0; j < 24; j++) {
            myHours.push(j);
            //let numRecord = d3.map(rows, function(d){return(d.location == locations[i] && d.hour == j)}).size();
            let re1 = rows.filter(function(d){return d.location == locations[i]});
            let re2 = re1.filter(function(d){return d.hour == j});
            //console.log(re2);
            let num = re2.length;
            let people = d3.map(re2, function(d){return(d.name)}).keys();
            let eTree = [];
            for(let i = 0; i < people.length; i++) {
                let l1 = re2.filter(function(d){return d.name == people[i]});
                let dateE = d3.map(l1, function(d){return(d.date)}).keys();
                //console.log(dateE);
                eTree.push({
                    name: people[i],
                    count: l1.length,
                    date: dateE
                });
            }

            eTreeStructure = {
                "name": locations[i],
                "children": eTree
            }
           
            
            tranData.push({
                location: locations[i],
                hour: j,
                price: 0,
                number: num,
                people: people,
                str: eTreeStructure
            });
            
        }
    }


    
}

