$(document).ready(function () {
  var sps = new SaaSProfitSimulation();
  sps.setVisitorsPerMonth(500);
  sps.setChurnRate(0.01);

  sps.start();

  var totalRevenue = 0;
  var userCount = 0;

  function putEvent(title, info) {
    $("#eventFeed")
      .append("<div><b>" + title + "</b>" + JSON.stringify(info) +
        "</div>");
  }

  sps.on("created", function (e, info) {
    putEvent("CREATED", info);
  });

  sps.on("converted", function (e, info) {
    putEvent("CONVERTED: ", info);
    userCount++;
  });

  sps.on("not_converted", function (e, info) {
    putEvent("NOT_CONVERTED: ", info);
  });

  sps.on("paid", function (e, info) {
    putEvent("PAID: ", info);
    totalRevenue += info.payment;
    // putEvent("TOTAL_REVENUE: ", totalRevenue);
  });

  sps.on("churned", function (e, info) {
    userCount--;
  });

  ////////////////
  //
  function createChart(idSelector, dataFn) {
    var margin = {
        top: 30,
        right: 20,
        bottom: 30,
        left: 50
      },
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
      // .orient("bottom").ticks(5);
      .orient("bottom");

    var yAxis = d3.svg.axis().scale(y)
      //.orient("left").ticks(5);
      .orient("left");

    // Define the line
    var valueline = d3.svg.line()
      .x(function (d) {
        return x(d.time);
      })
      .y(function (d) {
        return y(d.value);
      });

    // Adds the svg canvas
    var svg = d3.select(idSelector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Add the X Axis
    // svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);

    // Add the Y Axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    function updateLine(data) {
      d3.select(idSelector + " .line").remove();

      // Scale the range of the data
      x.domain(d3.extent(data, function (d) {
        return d.time;
      }));
      y.domain([0, d3.max(data, function (d) {
        return d.value;
      })]);

      // Add the valueline path.
      svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));
    }

    var data = [];

    setInterval(function () {
      dataFn(data);
      updateLine(data);
    }, 100);
  }

  createChart("#totalRevenue", function (data) {
    data.push({
      value: totalRevenue,
      time: data.length
    });
  });

  createChart("#totalUsers", function (data) {
    data.push({
      value: userCount,
      time: data.length
    });
  });

  var lastTotalRevenue = 0;
  createChart("#newRevenue", function (data) {
    data.push({
      value: totalRevenue - lastTotalRevenue,
      time: data.length
    });

    lastTotalRevenue = totalRevenue;
  });

  var lastUserCount = 0;
  createChart("#newUsers", function (data) {
    data.push({
      value: userCount - lastUserCount,
      time: data.length
    });

    lastUserCount = userCount;
  });

});