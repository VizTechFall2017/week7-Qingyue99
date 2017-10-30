var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right-50,
    height = 650 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var yaxis = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#d25c4d"]);

d3.csv("2chart.csv",
    function(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }

    , function(error, data) {
    var keys = data.columns.slice(1);

    //console.log(keys);

    x.domain(data.map(function(d) { return d.item; }));
    yaxis.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    z.domain(keys);

    var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 40)
            .attr("height", 25)
            .attr("fill", "white")
            .style("opacity", 0.7);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");


        g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.item); })
        .attr("y", function(d) { return yaxis(d[1]); })
        .attr("height", function(d) { return yaxis(d[0]) - yaxis(d[1]); })
        .attr("width", x.bandwidth())
        .each(function(d){
            this.classList.add('c' + d.data.item.replace(/[\s\'\-]/g, ''));
        })
        .on('mouseover', function(d){
            d3.select(this).attr('stroke','red').attr('stroke-width','4');

            currentClass = d3.select(this).attr('class');
            svg.selectAll('.' + currentClass).attr('stroke','pink').attr('stroke-width','4');
         //   focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
         //   focus.select("text").text("yyyy");
        })
        .on('mouseout', function(d){
            d3.select(this).attr('stroke','').attr('stroke-width','0');;
            currentClass = d3.select(this).attr('class');
            svg.selectAll('.' + currentClass).attr('stroke','').attr('stroke-width','4');
        });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yaxis).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", yaxis(yaxis.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Number of People");

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yaxis).ticks(null, "s"))
            .append("text")
            .attr("x",800)
            .attr("y", 600)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Spend");


    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
});
