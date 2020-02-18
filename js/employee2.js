const ew = 800;
const eh = 300;

let employee = []; // dataset from tsv file
//let logging = []; // interactions logging
let executive = {
    "name": "Sanjorge Jr. Sten",
    "type": "Executive",
    "title": "President/CEO",
    "carID": 31,
    "children": []
};
let engineering = {};
let IT = {};
let security = {};
let facilities = {};

/** 
let tree = d3.layout.tree()
            .size([ew, eh])
            .separation(function (a, b) {
                return (a.parent == b.parent ? 1 : 2);
            });

var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.y, d.x];
            });


//Create SVG element
let esvg = d3.select("body").select(".employee-figure") 
    .append("svg")
    .attr("width", ew)
    .attr("height", eh)
    .append("g")
    .attr("transform", "translate(40,0)");;

let nodes = tree.nodes(executive);
let links = tree.links(nodes);


let link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", diagonal);

let node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
    })

node.append("circle")
    .attr("r", 4.5);

node.append("text")
    .attr("dx", function (d) {
        return d.children ? -8 : 8;
    })
    .attr("dy", 3)
    .style("text-anchor", function (d) {
        return d.children ? "end" : "start";
    })
    .text(function (d) {
        return d.name;
    });
*/

let width = 500,
    height = 500;

//let cluster = d3.layout.tree()
const root = d3.tree(executive);

let x0 = Infinity;
let x1 = -x0;

root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
});

/** 
let diagonal = d3.svg.diagonal()
    .projection(function(d) {
        return [d.y, d.x];
    });

*/

const svg = d3.select("body").select(".employee-figure").create("svg")
    .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);



/** 
let svg = d3.select("body").select(".employee-figure").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");
*/

d3.csv("data/car-assignments.csv")
    .row( (d, i) => {
        /** 
        let mark = 1;
        if(d.x == "NaN" || d.y == "NaN") {
            mark = 0;
        }
        */
        return {
        name: d.FirstName+" "+d.LastName,
        carID: +d.CarID,
        type: d.CurrentEmploymentType,
        title: d.CurrentEmploymentTitle
        };
        
    })
    .get( (error, rows) => {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ", rows[0])
            console.log("Last  row: ", rows[rows.length-1])
        }
        
        
        rows = wrangleData(rows);
        //employee = rows;
        console.log(executive);
        console.log(engineering);
        console.log(IT);
        console.log(security);
        console.log(facilities);


        const g = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${root.dy / 3}, ${root.dx - x0})`);

    const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
  .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("d", d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x));
  
  const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
    .clone(true).lower()
      .attr("stroke", "white");

        /** 
        //let nodes = cluster(executive);
        cluster(executive);
        //let links = cluster.links(nodes);
        let link = svg.selectAll(".link")
            .data(executive.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", function(d){
                return "M"+d.source.y+" "+d.source.x+
                "L"+(d.source.y+120)+" "+d.source.x+
                " L"+(d.source.y+120)+" "+d.target.x+" L"+
                d.target.y+" "+d.target.x;

            })
            .attr("style",function(){
                return "stroke:#F7881F"
            });

        var node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) { 
                return "translate(" + d.y + "," + (d.x+ -10) + ")"; 
            })

        node.append("rect")
            .attr("width",100)
            .attr("height",20)
            .attr("x",0)
            .attr("y",0)
            .attr("style","fill:#35AD5B;");

        node.append("text")
            .attr("dx", function(d) { 
                return 30;
            })
            .attr("dy", 14)
            .style("text-anchor", function(d) { 
                return "middle";
            })
            .style("fill","#fff")
            .text(function(d) { return d.name; });

        node.append("text")
            .attr("dx", function(d) { 
                return 80;
            })
            .attr("dy", 14)
            .style("text-anchor", function(d) { 
                return "middle";
            })
            .style("fill","#fff")
            .text(function(d) { return d.title; });

            */

        //console.log("After dealing with missing data: Loaded " + rows.length + " rows");

        /** 
        gps = rows;

        x = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.longitude))
        .range([0, w]);
                        
        y = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.latitude))
        .range([h, 0]);
        //.range([0, h]);
        draw();
        */

    });



/** 
d3.json("data.json", function(error, root) {
  var nodes = cluster.nodes(root);
  var links = cluster.links(nodes);
  var link = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", function(d){
        return "M"+d.source.y+" "+d.source.x+
        "L"+(d.source.y+120)+" "+d.source.x+
        " L"+(d.source.y+120)+" "+d.target.x+" L"+
        d.target.y+" "+d.target.x;

      })
      .attr("style",function(){
        return "stroke:#F7881F"
      });

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "translate(" + d.y + "," + (d.x+ -10) + ")"; 
      })

  node.append("rect")
    .attr("width",100)
    .attr("height",20)
    .attr("x",0)
    .attr("y",0)
    .attr("style","fill:#35AD5B;");

  node.append("text")
      .attr("dx", function(d) { 
        return 30;
      })
      .attr("dy", 14)
      .style("text-anchor", function(d) { 
        return "middle";
      })
      .style("fill","#fff")
      .text(function(d) { return d.name; });

   node.append("text")
      .attr("dx", function(d) { 
        return 80;
      })
      .attr("dy", 14)
      .style("text-anchor", function(d) { 
        return "middle";
      })
      .style("fill","#fff")
      .text(function(d) { return d.number; });
});
*/


function draw() {
	svg.selectAll("rect")
	    .data(gps)
	    .enter()
	    .append("rect")
	    .attr("width", 1)
	    .attr("height", 1)
	    //.attr("x", (d) => x(d.longitude) )
	    //.attr("y", (d) => y(d.latitude) )
	    .attr("x", (d) => x(d.longitude) )
        .attr("y", (d) => y(d.latitude) )
        /** 
	    .on('mouseover', function(d, i) {
          if(on == 1) {
            //console.log("Event!");
            cache = {type: d3.event.type, x: d3.event.x, y: d3.event.y, timeStamp: d3.event.timeStamp};
            logging.push(cache);
        }
	      return tooltip.style("visibility", "visible").style("color","black").style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(d.place + ": " + d.density);
	    })
	    .on('mouseout', function(d, i) {
	      //console.log("mouseout", d);
	    })
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
            }
            return tooltip.style("visibility", "visible").style("color","blue").text(d.place + ": " + d.density + ",   Current picked cities: " + cities);
            */
  }



function wrangleData(rows){
    for(let i = rows.length-1; i>=0; i--) {
        if(rows[i].title.includes("Group Manager")) {
            let group = rows[i].title.split(" ")[0];
            let cacheDict = {
                "name": rows[i].name,
                "type": rows[i].type,
                "title": rows[i].title,
                "carID": rows[i].carID,
                "children": []
            };

            switch (group) {
                case "Engineering":
                    engineering = cacheDict;
                    break;
                case "IT":
                    IT = cacheDict;
                    break;
                case "Security":
                    security = cacheDict;
                    break;
                case "Facilities":
                    facilities = cacheDict;
                    break;
            }
        }
    }
    for(let i = rows.length-1; i>=0; i--) {
        if(rows[i].title.includes("Group Manager") == false && rows[i].title.includes("CEO") == false)  {
            let cacheDict2 = {
                "name": rows[i].name,
                "type": rows[i].type,
                "title": rows[i].title,
                "carID": rows[i].carID
            };
    
            switch (rows[i].type) {
                case "Executive":
                    executive["children"].push(cacheDict2);
                    break;
                case "Engineering":
                    engineering["children"].push(cacheDict2);
                    break;
                case "IT":
                    IT["children"].push(cacheDict2);
                    break;
                case "Security":
                    security["children"].push(cacheDict2);
                    break;
                case "Facilities":
                    facilities["children"].push(cacheDict2);
                    break;
            }
        }
        
        /**
        if(rows[i].type == "Executive") {
            executive["children"].push({
                "name": rows[i].name,
                "type": rows[i].type,
                "title": rows[i].title,
                "carID": rows[i].carID
            });
        }
         */
        
    }
    /** 

    engineering["children"].sort(function(a, b) {
        //return dict2.title - dict1.title;
        if(a["title"] == b["title"]){//如果id相同，按照age的降序
            return b["carID"] - a["carID"]
        }else{
            return a["title"] - b["title"]
        }
    });
    console.log(engineering["children"]);

    */
    return rows;
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
