//const w = 1000;
//const h = 600;


const w = 1000;
const h = 500;

let gps = []; // dataset from tsv file
//let gps_cp = [];
let employees = [];
let info = [];
let carAss = []; // CarID from car-assignment.csv, 1-35
//let logging = []; // interactions logging
let filter_carID = []; // CarID from gps.csv, 1-35, 101, 104-107
let filter_employee = [];
let filter_date = [];
let filter_hour = [];

let x;
let y;

let tooltip = d3.select("body").select(".gps-figure")
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
    .attr("height", h+80)
    .attr("transform",
        "translate(" + 0 + "," + 50 + ")");;

d3.csv("data/car-assignments.csv")
    .row( (d, i) => {
        let concatName = d.FirstName+" "+d.LastName;
        let thisID = d.CarID;

        info[i+1] = [thisID, concatName, d.CurrentEmploymentType, d.CurrentEmploymentTitle];
        carAss.push(+d.CarID);

        //console.log(info);
        return {
            name: concatName,
            carID: +d.CarID,
            type: d.CurrentEmploymentType,
            title: d.CurrentEmploymentTitle
        };
        
    })
    .get( (error, rows) => {
        console.log("Car-assignments.csv Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ", rows[0])
            console.log("Last  row: ", rows[rows.length-1])
        }
        
        employees = rows;
    });



d3.csv("data/gps.csv")
       .row( (d, i) => {
           /** 
           let mark = 1;
           if(d.x == "NaN" || d.y == "NaN") {
               mark = 0;
           }
           */
            let thisName = "NaN";
            let thisTitle = "NaN";
            if(carAss.includes(+d.id)) {
                thisName = info[+d.id][1];
                thisTitle = info[+d.id][3];
            }

            //console.log("Date Format"+d.Timestamp);
            let dateParse = d3.timeParse("%m/%d/%Y %H:%M:%S");
            let timeobj = dateParse(d.Timestamp);
            let months = timeobj.getMonth()+1;
            let days = timeobj.getDate();
            let dates = months+"/"+days;
            let hours = timeobj.getHours();

            //console.log(days);

            return {
            timeStamp: d.Timestamp,
            date: dates,
            day: days,
            hour: hours,
            carID: +d.id,
            longitude: +d.long,
            latitude: +d.lat,
            name: thisName,
            title: thisTitle
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
                   //console.log(gps[i].carID);
                   //$('select').append('<option>'+gps[i].carID+'</option>');
   
                   let $append = $("<option value='" + gps[i].carID + "'>" + gps[i].carID + "</option>");
                   //let $append = $("<option value= gps[i].carID>" + gps[i].carID + "</option>");
                   $("#filter_carID").append($append);
                   $('#filter_carID').selectpicker('selectAll');

                   $('#filter_carID').selectpicker('refresh');
               }

                if(filter_employee.includes(gps[i].name) == false) {
                    filter_employee.push(gps[i].name);

                    let $append = $("<option value='" + gps[i].name + "'>" + gps[i].name + "</option>");
                    //let $append = $("<option value= gps[i].carID>" + gps[i].carID + "</option>");
                    $("#filter_employee").append($append);
                    $("#filter_employee").selectpicker('selectAll');
                    $('#filter_employee').selectpicker('refresh');
                }

                if(filter_date.includes(gps[i].date) == false) {
                    filter_date.push(gps[i].date);

                    let $append = $("<option value='" + gps[i].date + "'>" + gps[i].date + "</option>");
                    //let $append = $("<option value= gps[i].carID>" + gps[i].carID + "</option>");
                    $("#filter_date").append($append);
                    $("#filter_date").selectpicker('selectAll');
                    $('#filter_date').selectpicker('refresh');
                }

                if(filter_hour.includes(gps[i].hour) == false) {
                    filter_hour.push(gps[i].hour);

                    let $append = $("<option value='" + gps[i].hour + "'>" + gps[i].hour + "</option>");
                    //let $append = $("<option value= gps[i].carID>" + gps[i].carID + "</option>");
                    $("#filter_hour").append($append);
                    $('#filter_hour').selectpicker('selectAll');

                    $('#filter_hour').selectpicker('refresh');
                }
               
           }


        x = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.longitude))
        //.domain(d3.extent(gps_cp, (row) => row.longitude))
        .range([0, w]);
                        
        y = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.latitude))
        //.domain(d3.extent(gps_cp, (row) => row.latitude))
        .range([h, 0]);
        //.range([0, h]);

        selectedID = getCarID();
            selectedName = getEmployee();
            selectedDate = getDate();
            selectedHour = getHour();
            svg.selectAll("rect").remove();
            draw(selectedID, selectedName, selectedDate, selectedHour);
        

        $('#filter_carID').on('changed.bs.select',function(e){
            //console.log(getCarID());
            selectedID = getCarID();
            selectedName = getEmployee();
            selectedDate = getDate();
            selectedHour = getHour();
            svg.selectAll("rect").remove();
            draw(selectedID, selectedName, selectedDate, selectedHour);
            //draw(selected, "carID");
        });

        $('#filter_employee').on('changed.bs.select',function(e){
            //console.log(getCarID());
            //selected = getEmployee();
            selectedID = getCarID();
            selectedName = getEmployee();
            selectedDate = getDate();
            selectedHour = getHour();
            //draw(selected, "name");
            svg.selectAll("rect").remove();
            //draw(selectedID, selectedName);
            draw(selectedID, selectedName, selectedDate, selectedHour);
        });

        $('#filter_date').on('changed.bs.select',function(e){
            //console.log(getCarID());
            selectedID = getCarID();
            selectedName = getEmployee();
            selectedDate = getDate();
            selectedHour = getHour();
            svg.selectAll("rect").remove();
            draw(selectedID, selectedName, selectedDate, selectedHour);
            //draw(selected, "carID");
        });

        $('#filter_hour').on('changed.bs.select',function(e){
            //console.log(getCarID());
            //selected = getEmployee();
            selectedID = getCarID();
            selectedName = getEmployee();
            selectedDate = getDate();
            selectedHour = getHour();
            //draw(selected, "name");
            svg.selectAll("rect").remove();
            //draw(selectedID, selectedName);
            draw(selectedID, selectedName, selectedDate, selectedHour);
        });

        

        

    });



function draw(selectedID, selectedName, selectedDate, selectedHour) {
    console.log("Draw!");
    let dataFilter = [];

    /** 
    switch (category) {
        case "carID":
            let dataFilter = gps.filter(function(d){return selectedGroup.includes(d.carID.toString())})
            break;
        case "name":
            let dataFilter = gps.filter(function(d){return selectedGroup.includes(d.name)})
            break;
    }
    
*/
/** 
    if(category == "carID") {
        console.log("Match");
        dataFilter = gps.filter(function(d){return selectedGroup.includes(d.carID.toString())});
        console.log("End");
    } else if(category == "name") {
        dataFilter = gps.filter(function(d){return selectedGroup.includes(d.name.toString())});
    }
    */

    

    dataFilter = gps.filter(function(d){return selectedID.includes(d.carID.toString())});
    dataFilter = dataFilter.filter(function(d){return selectedName.includes(d.name.toString())});
    dataFilter = dataFilter.filter(function(d){return selectedDate.includes(d.date.toString())});
    dataFilter = dataFilter.filter(function(d){return selectedHour.includes(d.hour.toString())});
    //let dataFilter = gps.filter(function(d){return selectedGroup.includes(d.category.toString())})
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
            //console.log("mouseover", d);
            return tooltip.style("visibility", "visible").style("color","black").style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
            //.text("carID: "+d.carID + "; Time: "+ d.timeStamp);
            .html("Employee: " + d.name + "<br/>"+"Title: " + d.title + "<br/>" + "CarID: "+d.carID + "<br/>" + "Time: "+ d.timeStamp);
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

function getEmployee() {
    return $("#filter_employee").val();
}


function getDate() {
    return $("#filter_date").val();
}

function getHour() {
    return $("#filter_hour").val();
}