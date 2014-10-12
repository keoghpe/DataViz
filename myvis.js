var columns = ['Firearms', 'Pistols', 'Revolvers', 'Rifles', 'Shotguns', 'Misc'];
var not_columns = ['Firearms', 'Pistols', 'Revolvers', 'Rifles', 'Shotguns', 'Misc'];

d3.csv("./USGunManufacturing1986-2010-Wide.csv", function(data) {

	d3.select("#chart").append("svg").attr("id", "foo");

	function draw() {

		d3.selectAll("svg > *").remove();

		//var width = document.getElementById('foo').offsetWidth;
		//var height = document.getElementById('foo').offsetHeight;

		var width = document.getElementById('chart').offsetWidth;
		var height = document.getElementById('chart').offsetHeight;
		var margin = width / 10;


		var svg = d3.select('svg');

		//Create X and Y Scaling Functions

		var xRange = d3.scale.linear().range([margin, width - margin]).domain([d3.min(data, function(d) {
			return d['Year'];
		}), d3.max(data, function(d) {
			return d['Year'];
		})]);

		var yRange = d3.scale.linear().range([height - margin, margin]).domain([d3.min(data, function(d) {
			var min = Infinity;
			for (var i = columns.length - 1; i >= 0; i--) {
				if(Math.floor(d[columns[i]]) < min){
					min = Math.floor(d[columns[i]]);
				}
			};
			return min;
		}), d3.max(data, function(d) {
			var max = -Infinity;
			for (var i = columns.length - 1; i >= 0; i--) {
				if(Math.ceil(d[columns[i]]) > max){
					max = Math.ceil(d[columns[i]]);
				}
			};
			return max;
		})]);

		var x_extent = [d3.min(data, function(d) {
			return d['Year'];
		}), d3.max(data, function(d) {
			return d['Year'];
		})];

		var x_scale = d3.scale.linear()
			.range([margin, width - margin])
			.domain(x_extent);

		// var y_extent = [d3.max(data, function(d) {
		// 	return d['Firearms'];
		// }), 0];
		var y_extent = [d3.max(data, OBJmax), d3.min(data, OBJmin)];

		var y_scale = d3.scale.linear()
			.range([margin, height - margin])
			.domain(y_extent);

		var x_axis = d3.svg.axis().scale(x_scale);

		d3.select('svg').append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (height - ((margin * 3) / 4)) + ')')
			.call(x_axis);

		var y_axis = d3.svg.axis().scale(y_scale).orient('left');

		d3.select('svg').append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + ((margin * 3) / 4) + ', 0 )')
			.call(y_axis);

		for (var i = 0; i < columns.length; i++) {
			drawCircles(data, columns[i]);
		};


		function drawCircles(data, name) {

			svg.selectAll('circle.' + name)
				.data(data)
				.enter()
				.append('circle')
				.attr('cx', function(d) { // sets the x position of the bar
					return xRange(d['Year']);
				})
				.attr('cy', function(d) { // sets the y position of the bar
					return yRange(d[name]);
				})
				.attr('r', function(d) {
					return 5;
				})
				.on('mouseover', function(d) {
					svg.append('text')
						.attr({
							id: function() {
								return "tx-" + d['Year'] + '-' + d[name]
							},
							x: function() {
								return x_scale(d['Year']) + 10;
							},
							y: function() {
								return y_scale(d[name]) - 10;
							}
						})
						.text(function() {
							//return [name, d['Year'], d[name]];
							return name + ": Year: " + d['Year'] + ", Number Sold: " + d[name];
						});
				})
				.on('mouseout', function(d) {
					d3.select("#tx-" + d['Year'] + '-' + d[name]).remove();
				})
				.on('click', function () {
					if(columns.length === 1){
						for (var i = not_columns.length - 1; i >= 0; i--) {
							columns.push(not_columns[i]);
						};
						not_columns.push(name);
						draw();
					} else {
						columns = [name];
						not_columns.pop(not_columns.indexOf(name));
						draw();
					}
				})
				.attr('class', name);
		}
	}

	draw();
	window.onresize = draw;

});


function OBJmax(d) {
	var max = -Infinity;
	for (var i = columns.length - 1; i >= 0; i--) {
		if(Math.ceil(d[columns[i]]) > max){
			max = Math.ceil(d[columns[i]]);
		}
	}
	return max;
}

function OBJmin(d) {
	var min = Infinity;
	for (var i = columns.length - 1; i >= 0; i--) {
		if(Math.floor(d[columns[i]]) < min){
			min = Math.floor(d[columns[i]]);
		}
	}
	return min;
}

