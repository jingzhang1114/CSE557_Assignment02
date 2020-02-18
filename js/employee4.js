const ew = 800;
const eh = 300;

let structure = {
    "name": "GAStech",
    "children": [
        {"name": "Executive", "size": 10, "number": 5},
        {"name": "Engineering", "size": 10, "number": 13},
        {"name": "Information-Technology", "size": 10, "number": 5},
        {"name": "Security", "size": 10, "number": 11},
        {"name": "Facilities", "size": 10, "number": 10}
    ]
};
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

var tooltip = d3.select("body").select(".gps-figure")
    .append("div")
    .style('position', 'absolute')
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .text("a simple tooltip");

let treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([1000, 270])
    .round(true)
    .paddingInner(10);

let hi = d3.hierarchy(structure)
    .sum(function(d){ return d.size; });
    //.sort(function(a,b){return b.value-a.value;})
     
treemap(hi);

let svg0 = d3.select("body").select(".employee-figure")
    .append('svg')
    .attr("class", "svg0")
    .attr('width', 1000)
    .attr('height', 270);

let width = 1200
let height = 120
    
let svg1 = d3.select("body").select(".employee-figure")
    .append('svg')
    .attr("class", "Executive")
    .attr('width', width)
    .attr('height', height);

let svg2 = d3.select("body").select(".employee-figure")
    .append('svg')
    .attr("class", "Engineering")
    .attr('width', width)
    .attr('height', height);


let svg3 = d3.select("body").select(".employee-figure")
    .append('svg')
    .attr("class", "Information-Technology")
    .attr('width', width)
    .attr('height', height);

let svg4 = d3.select("body").select(".employee-figure")
    .append('svg')
    .attr("class", "Security")
    .attr('width', width)
    .attr('height', height);

let svg5 = d3.select("body").select(".employee-figure")
    .append('svg')
    .attr("class", "Facilities")
    .attr('width', width)
    .attr('height', height);


     

   


// 初始化树状图数据获取器
let tree = d3.tree()
    .size([width-100, height-50])
    .separation(function (a, b) {
        return (a.parent === b.parent ? 1 : 2) / a.depth
    });

let cell = svg0.selectAll("g")
    .data(hi.leaves())
    .enter().append("g")
    .attr('transform', 'translate(100, 0)');


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

        draw(executive, svg1);
        draw(engineering, svg2);
        draw(IT, svg3);
        draw(security, svg4);
        draw(facilities, svg5);

        console.log("End drawing!");
/** 
        $(".Executive").hide();
        $(".Information-Technology").hide();
        $(".Engineering").hide();
        $(".Security").hide();
        $(".Facilities").hide();
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

    draw(executive);

     
     
cell.append("rect")
    .attr("x",function(d){ return d.x0; })
    .attr("y",function(d){ return d.y0; })
    .attr("width",function(d){ return d.x1-d.x0; })
    .attr("height",function(d){ return d.y1-d.y0; })
    .attr("fill", "grey")
    .on('mouseover', function(d, i) {
        //console.log(d);
        return tooltip.style("visibility", "visible").style("color","black").style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("Number: " + d.data.number);
    })
    .on("click", function(d, i) {
        //$("."+d.data.name).show();
        console.log("click");
        if($("."+d.data.name).is(":hidden")){
            $("."+d.data.name).show();    //如果元素为隐藏,则将它显现
            console.log(d.data.name);
        }else{
            $("."+d.data.name).hide();     //如果元素为显现,则将其隐藏
        }
     
    })
    
cell.append("text")
    .attr("x",function(d) {return d.x0;})
    .attr("y",function(d) {return d.y0;})
    .attr("dx","0.5em")
    .attr("dy","1.5em")
    .attr("fill","white")
    .attr("font-size",20)  
    .text(function(d){   return d.data.name;
} );
    
/** 
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
            
  }

  */
//function draw(data, _svg)
function draw(data) {
    //console.log("Draw "+_svg);
    //console("Call draw function...");
    let hierarchyData = d3.hierarchy(data)
            .sum(function (d) {
                return d.value
            });
        // 初始化树状图
        let treeData = tree(hierarchyData);
        // 获取节点
        let nodes = treeData.descendants();
        // 获取边,也就是连线
        let links = treeData.links();
        // 绘制线
        let g = svg1.append('g').attr('transform', 'translate(0, 40)');

        g.selectAll('.link')
            .data(links)
            .enter().append('path')
            .attr('class', 'link')
            .style('fill', '#cccccc')
            .attr('d', d3.linkHorizontal()
                //.x(function (d) { return d.y })
                //.y(function (d) { return d.x }))
                .x(function (d) { return d.x })
                .y(function (d) { return d.y }))
            // 绘制文本和节点
        g.selectAll('.node')
            .data(nodes)
            .enter().append('g')
            .attr('class', function (d) { return 'node' + (d.children ? ' node--internal' : ' node--leaf') })
            .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
        g.selectAll('.node').append('circle')
            .attr('r', 3)
            .style('fill', 'green')
        g.selectAll('.node').append('text')
            .attr('dy', 2)
            .attr('x', function (d) { return d.children ? -6 : 6 })
            .style('text-anchor', function (d) { return d.children ? 'end' : 'start' })
            .text(function (d) {
                return d.data.name
            })
            .style('font-size', '12px')
            .on('mouseover', function(d, i) {
                //console.log(d);
                return tooltip.style("visibility", "visible").style("color","black").style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("Title: "+d.data.title);
            })

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
                case "Information Technology":
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

