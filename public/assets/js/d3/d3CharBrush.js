function d3CharBrush(config, data) {
  var data;
  var columns = config.columns || {};
  var margin = {
      top: 20,
      right: 20,
      bottom: 100,
      left: 40
    },
    margin2 = {
      top: 430,
      right: 20,
      bottom: 40,
      left: 40
    };

  function my(selection) {
    selection.each(function(d, i) {
      var clientWidth = document.getElementsByClassName("mdl-card__char")[0].clientWidth;

      //data = data[0].values;
      var width = clientWidth - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;
      var height2 = 500 - margin2.top - margin2.bottom;

      var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom");

      var yAxis = d3.svg.axis().scale(y).orient("left");

      var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

      var area = d3.svg.area()
        //.interpolate("monotone")
        .x(function(d) {
          return x(d[columns.x.name]);
        })
        .y0(height)
        .y1(function(d) {
          return y(d[columns.y.name]);
        });

      var area2 = d3.svg.area()
        //.interpolate("monotone")
        .x(function(d) {
          return x2(d[columns.x.name]);
        })
        .y0(height2)
        .y1(function(d) {
          return y2(d[columns.y.name]);
        });

      var line = d3.svg.line()
        //.interpolate("basis")
        .x(function(d) {
          return x(d[columns.x.name]);
        })
        .y(function(d) {
          return y(d[columns.y.name]);
        });

      var svg = d3.select(this).select('.mdl-card__char').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

      var parseDate = d3.time.format("%d/%m/%Y").parse;
      var dx = [],
        dy = [],
        keys = []
      jl = data.length,
        kl = undefined;
      for (var j = 0; j < jl; j++) {
        kl = data[j].values.length;
        for (var k = 0; k < kl; k++) {
          dx.push(data[j].values[k][columns.x.name]);
          dy.push(data[j].values[k][columns.y.name]);
          data[j].values[k][columns.x.name] = parseDate(data[j].values[k][columns.x.name]);
          data[j].values[k][columns.y.name] = +data[j].values[k][columns.y.name];
        }
      }

      //x.domain(d3.extent(dx));
      x.domain([parseDate(d3.min(dx)), parseDate(d3.max(dx))]);
      y.domain([d3.min(dy), d3.max(dy)]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      color.domain(keys);

      var item = focus.selectAll(".item")
        .data(data)
        .enter().append("g")
        .attr("class", "item");

      item.append("path")
        //.datum(data)
        .attr("class", "area")
        //.attr("d", area)
        .attr('d', function(d) {
          return area(d.values);
        })
        .style("fill", function(d) {
          return color(d.key);
        });

      item.append("path")
        //.datum(data)
        .attr("class", "line")
        //.attr("d", area)
        .attr('d', function(d) {
          return line(d.values);
        })
        .style("stroke", function(d) {
          return color(d.key);
        });

      focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      var itemPrev = context.selectAll(".item-prev")
        .data(data)
        .enter().append("g")
        .attr("class", "item-prev");

      itemPrev.append("path")
        //.datum(data)
        .attr("class", "area")
        //.attr("d", area2);
        .attr('d', function(d) {
          return area2(d.values);
        })
        .style("fill", function(d) {
          return color(d.key);
        });

      context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

      context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

      function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.selectAll(".area").attr("d", function(d) {
          return area(d.values);
        });
        focus.selectAll(".line").attr("d", function(d) {
          return line(d.values);
        });
        focus.select(".x.axis").call(xAxis);
      }
    });
  }

  my.columns = function(value) {
    if (!arguments.length) return columns;
    columns = value;
    return my;
  };

  return my;
}
