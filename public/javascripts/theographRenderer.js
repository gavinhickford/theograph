var Aridhia = Aridhia || {};
Aridhia.DV = Aridhia.DV || {};

//Define theograph Rendering function
(function () {
    //"use strict";
    Aridhia.DV.theograph_renderer = function () {
        var width = 1200;
        var height = 500;
        var categoryType = "type";
        var imageMapPath = null;
		var data = null;
        
        // internal variables
        var margin = { top: 10, right: 10, bottom: 100, left: 10 },
            margin2 = { top: 430, right: 10, bottom: 20, left: 10 },
            focusWidth = width - margin.left - margin.right,
            focusHeight = height - margin.top - margin.bottom,
            contextHeight = height - margin2.top - margin2.bottom,
            rowHeight = 24,
			images = null,
            imageHeight = 24,
            imageWidth = 24,
            contextRowHeight = 3,
            labelWidth = 150,
            categories = [],
            dates = [],
            minDate,
            maxDate;
		
		function theograph_renderer() {
		    function timelineJsonStringToDate(s) {
                if (s && s.substring && s.length) {
                    var expr = s.substring(1, s.length - 1);
                    if (expr.startsWith('Date')) {
                        return eval('new ' + expr);
                    }
                }
                return null;
            };
			
			String.prototype.startsWith = function(str) {
                return (this.match("^" + str) == str);
            };
					
            // Get the image mapping details			
            d3.json(imageMapPath, function(error, json) {
                if (error) return console.warn(error);
                images = json;
				
		    // set rowHeight and image sizes
            rowHeight = images.imageHeight;
            imageHeight = images.imageHeight;
            imageWidth = images.imageWidth;
				
			var allCategories = {};
            allCategories["type"] = data.map(function (obj) { return obj.type; });
            allCategories["specialty-name"] = data.map(function (obj) { return obj["specialty-name"]; });
		    
			// Get distinct list of categories for scales 
            d3.selectAll(allCategories[categoryType])
                .each(function (d, i) {
                    if ($.inArray(allCategories[categoryType][i], categories) === -1) {
                        categories.push(allCategories[categoryType][i]);
                    }
                });
			
			// Find min and max dates
            dates = data.map(function (obj) { return new Date(obj.start); });
            maxDate = Math.max.apply(null, dates);
            minDate = Math.min.apply(null, dates);
			
			// set up scales and axes
            var xScale = d3.time.scale()
             	.domain([minDate, maxDate])
                .range([labelWidth, focusWidth])
                .nice();   

            var xScale2 = d3.time.scale()
   	            .domain([minDate, maxDate])
                .range([labelWidth, focusWidth])
                .nice();
                
            var yScale = d3.scale.ordinal()
                .range([focusHeight, 0])
                .domain(categories)
                .rangePoints([rowHeight / 2, (categories.length * rowHeight) - rowHeight / 2]);

            var yScale2 = d3.scale.ordinal()
                .range([focusHeight, 0])
                .domain(categories)
                .rangePoints([contextRowHeight / 2, (categories.length * contextRowHeight) - contextRowHeight / 2]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

            var xAxis2 = d3.svg.axis()
                .orient("bottom")
                .scale(xScale2);

            var brush = d3.svg.brush()
                .x(xScale2)
                .on("brush", brushed);
				
			function brushed() {
                    xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());
                    focus.select(".x.axis").call(xAxis);
                    focus.selectAll("image")
                        .attr("x", function(d) {
                            return xScale(new Date(d.start)) - (rowHeight / 2);
                        });
					focus.selectAll(".duration")
                        .attr("x", function(d) {
                            return xScale(new Date(d.start)) + 5;
                        })
						.attr("width", function(d){
		                    return xScale(new Date(d.end)) - xScale(new Date(d.start)) 
                        });
                }
				
			    // define svg element
                var svg = d3.select("#vis").append("svg")
                    .attr("width", focusWidth + margin.left + margin.right)
                    .attr("height", focusHeight + margin.top + margin.bottom);
					
				// define main section
                var focus = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// Add row for each category
                var rect = focus.append("g")
                    .selectAll("rect")
                    .data(categories)
                    .enter()
                    .append("rect")
                    .attr("class", "category")
					.attr("x", labelWidth)
                    .attr("y", function(d, i) { return i * (rowHeight); })
                    .attr("width", 0)
                    .attr("height",rowHeight - 1)
                    .attr("id", function(d, i) { return "rect-" + i; })
                    .attr("fill", "#B9D0F8")
                    .attr("opacity", 0.3)
                    .on("mouseover", function(d) {
                        d3.select(this)
                            .classed("active", true);
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .classed("active", false);

                    });
					
				rect.transition()
                    .attr("width",focusWidth - labelWidth)
					.duration(1000);

				// Add the inner rect
                var innerRect = focus.append("g")
                    .selectAll("rect")
                    .data(categories)
                    .enter()
                    .append("rect")
                    .attr("class", "category-inner")
					.attr("x", labelWidth)
                    .attr("y", function(d, i) { return (i * (rowHeight)) + rowHeight / 4; })
                    .attr("width", 0)
                    .attr("height",rowHeight / 2 - 1)
                    .attr("id", function(d, i) { return "inner-rect-" + i; })
                    .attr("fill", "#C9D0F8")
                    .attr("opacity", 0.3);
					
				innerRect.transition()
                    .attr("width",focusWidth - labelWidth)
					.duration(1000);
				
                // add text for each category row
                focus.append("g")
                    .selectAll("text")
                    .data(categories)
                    .enter()
                    .append("text")
                    .text(function (d) { return d; })
                    .attr("x", 0)
                    .attr("y", function (d, i) { return (i * rowHeight) + 4 + rowHeight / 2; });

                // Add images for each event
				var div = d3.select("body").append("div")   
                   .attr("class", "tooltip")               
                   .style("opacity", 0);
				
                var imageIcon = focus.append("g")
                    .selectAll("image")
                    .data(data)
                    .enter()
                    .append("svg:image")
                    .attr("xlink:href", function(d) {
                        return images.type[d.type];
                    })
					.attr("x", labelWidth)
		            .attr("y", function(d) {
                        return yScale(d[categoryType]) - (imageHeight / 2);
                    })
                    .attr("width", imageWidth)
		            .attr("height", imageHeight)
			  	    .on("mouseover", function(d) {      
                        div.transition()        
                           .duration(200)      
                           .style("opacity", .5);      
                        div .html(d.type + "<br/>" + d.start)  
                           .style("left", (d3.event.pageX) + "px")     
                           .style("top", (d3.event.pageY - 28) + "px");    
                        })                  
                    .on("mouseout", function(d) {       
                        div.transition()        
                           .duration(500)      
                           .style("opacity", 0);   
                        });
					
					
				imageIcon.transition()
                     .attr("x", function(d){
		                return xScale(new Date(d.start)) - (imageWidth / 2)
                     })
					 .duration(1000);

				// Add the duration rect
                var durationRect = focus.append("g")
                    .selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
					.attr("class", "duration")
					.attr("rx", 6)
                    .attr("ry", 6)
                    .attr("x", labelWidth)
                    .attr("y", function(d) {
                        return yScale(d[categoryType]) - (imageHeight / 4);
                    })
					.attr("width", 0)
                    .attr("height",rowHeight / 2 - 1)
                    .attr("fill", "#3385AD")
                    .attr("opacity", 0.3);
                
                durationRect.transition()
              		.attr("width", function(d){
		                return xScale(new Date(d.end)) - xScale(new Date(d.start)) 
                     })
					.attr("x", function(d){
		                return xScale(new Date(d.start)) + 5 
                     })
					.duration(1000);
                
                // Add the x axis
                focus.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + focusHeight + ")")
                    .call(xAxis);
                
                // Add the date selector
                var context = svg.append("g")
                    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

                // Add row for each category
                contextRow = context.append("g")
                    .selectAll("rect")
                    .data(categories)
                    .enter()
                    .append("rect")
                    .attr("class", "category")
                    .attr("x", labelWidth)
                    .attr("y", function (d, i) { return i * (contextRowHeight); })
                    .attr("width", 0)
                    .attr("height", contextRowHeight - 1)
                    .attr("id", function (d, i) { return "contextRect-" + i; })
                    .attr("fill", "#B9D0F8")
                    .attr("opacity", 0.5);
					
				contextRow.transition()
				    .attr("width", focusWidth - labelWidth)
					.duration(1000);

                // Add circle for each event on each row
                contextIcon = context.append("g")
                    .selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", labelWidth)
                    .attr("cy", function (d) {
                        return yScale2(d[categoryType]);
                    })
                    .attr("r", 2);
				
                contextIcon.transition()
                    .attr("cx", function (d) {
                        return xScale2(new Date(d.start));
                    })
					.duration(1000);
					
                // add x axis for the date selector
                context.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + contextHeight + ")")
                    .call(xAxis2);

                // add brush for zooming into date ranges
                context.append("g")
                    .attr("class", "x brush")
                    .call(brush)
                    .selectAll("rect")
                    .attr("y", -6)
                    .attr("height", contextHeight + 7);
            });
		}
	
	    theograph_renderer.width = function (x) {
            if (!arguments.length) { return width; }
            width = x;
            return theograph_renderer;
        };

        theograph_renderer.height = function (x) {
            if (!arguments.length) { return height; }
            height = x;
            return theograph_renderer;
        };
		
		theograph_renderer.imageMapPath = function (x) {
            if (!arguments.length) { return imageMapPath; }
            imageMapPath = x;
            return theograph_renderer;
        };
		
		theograph_renderer.data = function (x) {
            if (!arguments.length) { return data; }
            data = x;
            return theograph_renderer;
        };
		
		return theograph_renderer;
	};
})();