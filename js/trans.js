const w = 1000;
const h = 600;

let trans = []; // dataset from tsv file
//let logging = []; // interactions logging
let tranData = [];

let myLocations =[];
let myHours = [];

//let x;
//let y;

let margin = {top: 30, right: 30, bottom: 30, left: 140},
  width = 1000 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

var tooltip = d3.select("body").select(".tran-figure")
.append("div")
.style('position', 'absolute')
.style("z-index", "10")
.style("visibility", "hidden")
.style("background-color", "white")
.text("a simple tooltip");

//Create SVG element
let svg = d3.select("body").select(".tran-figure") 
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    //.append("svg")
    //.attr("width", w)
    //.attr("height", h);


d3.csv("data/cc_data.csv")
    .row( (d, i) => {
        /** 
        let mark = 1;
        if(d.x == "NaN" || d.y == "NaN") {
            mark = 0;
        }
        */
       //1/6/2014 7:28

        let dateParse = d3.timeParse("%m/%d/%Y %H:%M");
        let timeobj=dateParse(d.timestamp);
        let days = timeobj.getDate();
        let hours = timeobj.getHours();
        let fullName = d.FirstName + " " + d.LastName;

        return {
        timeStamp: d.timestamp,
        location: d.location,
        price: +d.price,
        name: fullName,
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
        
        //trans = rows;
        transData(rows);
        //rows = wrangleData(rows);
        //console.log("After dealing with missing data: Loaded " + rows.length + " rows");
        
        // Build X scales and axis:
        let x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myHours)
        .padding(0.01);

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

        // Build X scales and axis:
        let y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myLocations)
        .padding(0.01);
        
        svg.append("g")
        .call(d3.axisLeft(y));

        // Build color scale
        let myColor = d3.scaleLinear()
        //.range(["white", "#69b3a2"])
        .range(["white", "#008B8B"])
        .domain([1,100])

        //Read the data


        svg.selectAll()
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
            return tooltip.style("visibility", "visible").style("color","black").style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("Number of Records: "+d.number);
        })

        
            
        
        
        /** 
        gps = rows;





        for(let i = 0; i < gps.length; i++) {
            
            
            //$('#filter_carID').append('<option value="'+gps[i].carID+'" selected="selected">'+gps[i].carID+'</option>');
            if(filter_carID.includes(gps[i].carID) == false) {
                filter_carID.push(gps[i].carID);
                console.log(gps[i].carID);
                //$('select').append('<option>'+gps[i].carID+'</option>');

                let $append = $("<option value='" + gps[i].carID + "'>" + gps[i].carID + "</option>");
                //let $append = $("<option value= gps[i].carID>" + gps[i].carID + "</option>");
                $("#filter_carID").append($append);
                $('#filter_carID').selectpicker('refresh');
            }
            
        }

        

        //window.location.reload()

        /** 
        d3.select("#filter_carID")
        .selectAll('myOptions')
           .data(filter_carID)
        .enter()
          .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        

        //$('#filter_carID').selectpicker('val', filter_carID);

        x = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.longitude))
        .range([0, w]);
                        
        y = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.latitude))
        .range([h, 0]);
        //.range([0, h]);
        

        $('#filter_carID').on('changed.bs.select',function(e){
            console.log(getCarID());
            selected = getCarID();
            draw(selected);

            

        });

        */


    });

function draw(selectedGroup) {
    console.log("Draw!");

    //let dataFilter = gps.filter(function(d){return selectedGroup.includes(d.carID.toString())})
    //console.log(dataFilter.length);

	svg.selectAll("rect")
	    .data(trans)
	    .enter()
	    .append("rect")
	    .attr("width", 3)
	    .attr("height", 3)
	    //.attr("x", (d) => x(d.longitude) )
	    //.attr("y", (d) => y(d.latitude) )
	    .attr("x", (d) => x(d.longitude) )
        .attr("y", (d) => y(d.latitude) )
        
    
	    .on('mouseover', function(d, i) {
            /** 
          if(on == 1) {
            //console.log("Event!");
            cache = {type: d3.event.type, x: d3.event.x, y: d3.event.y, timeStamp: d3.event.timeStamp};
            logging.push(cache);
        }*/
        console.log("mouseover", d);
	      return tooltip.style("visibility", "visible").style("color","black").style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("carID: "+d.carID + "; Time: "+ d.timeStamp);
	    })
	    .on('mouseout', function(d, i) {
	      //console.log("mouseout", d);
	    })/** 
	    .on('click', function(d) {
	    	var coords = d3.mouse(this);
	    	circle(coords[0], coords[1]);
	    	density.push(d.density);
            cities.push(d.place);

            
            if(on == 1) {
                //console.log("Event!");
                //logging.push(d3.event);
                cache = {type: d3.event.type, x: d3.event.x, y: d3.event.y, timeStamp: d3.event.timeStamp};
                logging.push(cache);
           
            return tooltip.style("visibility", "visible").style("color","blue").text(d.place + ": " + d.density + ",   Current picked cities: " + cities);
             }*/
            
  }


/** 
svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, 580)")
	//.orient("top")
	//.attr("transform", "translate(0, " + h + ")")
	.call(d3.axisBottom(x))
	//.call(d3.axisBottom().scale(x))



svg.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(30, 0)")
	.call(d3.axisLeft(y))
	//.call(d3.axisLeft().scale(y))
	//svg.on('click', function(d) {
        //var coords = d3.mouse(this);
        //console.log(d.place);
        //circle(coords[0], coords[1]);
    //});

    
*/

function transData(rows) {
    //employees = [];
    

    let locations = d3.map(rows, function(d){return(d.location)}).keys();
    myLocations = locations;
    console.log(locations);

    for(let i = 0; i < locations.length; i++) {
        for(let j = 0; j < 24; j++) {
            myHours.push(j);
            //let numRecord = d3.map(rows, function(d){return(d.location == locations[i] && d.hour == j)}).size();
            let re1 = rows.filter(function(d){return d.location == locations[i]});
            let re2 = re1.filter(function(d){return d.hour == j});
            //console.log(re2);
            let num = re2.length;
            //let num = d3.map(re2, function(d){return(d.location)}).size();
            //let num1 = d3.map(rows, function(d){return(d.location == locations[i])});
            //num1.filter(function(d){return d.hour == j});
            //let num2 = d3.map(num1, function(d){return(d.hour == j)}).size();
            //console.log(num);

            
            tranData.push({
                location: locations[i],
                hour: j,
                price: 0,
                number: num
            });
            
        }
    }

    console.log(tranData);
    

    
/** 
    for(let k = 0; k < rows.length; k++) {
        for(let i = 0; i < locations.length; i++) {
            if(rows[k].location == locations[i]) {
                for(let j = 0; j < 24; j++) {
                    if(rows[k].hour == j) {
                        tranData
                    }
                }
            }
            
        }

    }
    

    
    for(let k = 0; k < rows.length; k++) {
        for(let i = 0; i < locations.length; i++) {
            for(let j = 0; j < 24; j++) {
                if() {}
            }
        }

    }
    */

    /** 
    for (const [year, i, value] of data[0].data.values.data) {
        if (value == null) continue;
        (values[i] || (values[i] = []))[year - year0] = value;
      }
      return {
        values,
        names,
        years,
        year: data[0].data.chart_options.vaccine_year
      };
      */
}
