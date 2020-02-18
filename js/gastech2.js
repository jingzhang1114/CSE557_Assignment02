const w = 1000;
const h = 600;

let gps = []; // dataset from tsv file
//let logging = []; // interactions logging
let filter_carID = [];

let x;
let y;

var tooltip = d3.select("body").select(".gps-figure")
.append("div")
.style('position', 'absolute')
.style("z-index", "10")
.style("visibility", "hidden")
.style("background-color", "white")
.text("a simple tooltip");

//Create SVG element
let svg = d3.select("body").select(".gps-figure") 
    .append("svg")
    .attr("width", w)
    .attr("height", h);


d3.csv("data/gps.csv")
    .row( (d, i) => {
        /** 
        let mark = 1;
        if(d.x == "NaN" || d.y == "NaN") {
            mark = 0;
        }
        */
        return {
        timeStamp: d.Timestamp,
        carID: +d.id,
        longitude: +d.long,
        latitude: +d.lat
        };
        
    })
    .get( (error, rows) => {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ", rows[0])
            console.log("Last  row: ", rows[rows.length-1])
        }
        
        
        //rows = wrangleData(rows);
        //console.log("After dealing with missing data: Loaded " + rows.length + " rows");

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
        */

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

        

    });

function draw(selectedGroup) {
    console.log("Draw!");

    let dataFilter = gps.filter(function(d){return selectedGroup.includes(d.carID.toString())})
    console.log(dataFilter.length);

	svg.selectAll("rect")
	    .data(dataFilter)
	    .enter()
	    .append("rect")
	    .attr("width", 1)
	    .attr("height", 1)
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

function getCarID() {
    return $("#filter_carID").val();
}
