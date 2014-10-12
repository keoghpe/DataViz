var columns = ['Firearms', 'Pistols', 'Revolvers', 'Rifles', 'Shotguns', 'Misc'];

d3.csv("./USGunManufacturing1986-2010-Wide.csv", function(error, csv) {

  var draw = function() {

    d3.selectAll("svg").remove();
    var data = [];
    var e, s, d;

    var _width = document.getElementById('chart').offsetWidth / columns.length;
    var _height = document.getElementById('chart').offsetHeight;

    // var margin = {top: 10, right: 50, bottom: 20, left: 50},
    //     width = 120 - margin.left - margin.right,
    //     height = 500 - margin.top - margin.bottom;
    //var _width = 120;
    //var _height = 500;
    var _top = _height / 50,
      _right = _height / 10,
      _bottom = _width / 6,
      _left = _height / 10;

    //This is an adjusted version so that it responds better at smaller widths
    // var _top = _height / 50,
    // _right = _width/ 12,
    // _bottom = (_height*2)/50,
    // _left = _width/12;


    var margin = {
        top: _top,
        right: _right,
        bottom: _bottom,
        left: _left
      },
      width = _width - margin.left - margin.right,
      height = _height - margin.top - margin.bottom;

    var min = Infinity,
      max = -Infinity;

    var chart = d3.box()
      .whiskers(iqr(1.5))
      .width(width)
      .height(height);

    // var e = Math.floor(x.Year- 1986),
    //   r = Math.floor(x.Run - 1),
    //   s = Math.floor(x.Speed),
    //   
    csv.forEach(function(x) {
      for (var i in columns) {

        e = columns[i];
        d = data[columns.indexOf(e)];
        s = x[e];
        if (typeof d === 'undefined') {
          d = data[columns.indexOf(e)] = [s];
        } else {
          d.push(s);
        }
        //FIND OUT WHY I HAD TO USE MATH.FLOOR HERE
        if (Math.floor(s) > max) max = s;
        if (Math.floor(s) < min) min = s;
      }
    });

    chart.domain([min, max]);



    var count = 0;

    var svg = d3.select("#chart").selectAll("svg")
      .data(data)
      .enter().append("svg")
      .attr("class", "box")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .attr("id", function(d) {
        var name = columns[count];
        count++;
        console.log(name);
        return name;
      })
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);
  }
  draw();
  window.onresize = draw;
});



// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
      q3 = d.quartiles[2],
      iqr = (q3 - q1) * k,
      i = -1,
      j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}


//     document.getElementById(x).onmouseover = function(){alert(x)};