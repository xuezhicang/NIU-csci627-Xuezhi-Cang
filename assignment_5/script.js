


function createListing(locationData, divId, checks=true) {
    var list = d3.select(divId + " .listing").append("ul");

    locations = list.selectAll(".entry")
        .data(locationData)
        .join("li")
        .attr("class", "entry");


    if (checks) {
        checkboxes = locations.append("input")
            .attr("type", "checkbox")
            .attr("checked", true)
            .attr("id", d => d[1].name);

        // ---
        // Add event handlers for checkboxes here
        // ---
        d3.selectAll("input").on("change", function(event,d) {

            if (this.checked) { //check the box

                checkboxes.filter(q=> q[1]['name']==d[1]['name']).attr("checked", true)

                d3.selectAll('.map circle').filter(dd => dd[1]['name'] == d[1]['name'])
                    .classed('transparent', false)


                //turn all the line on
                d3.selectAll('.map line').classed('transparent', false)
                //turn some lines off
                console.log("length of lists item   "+ d3.selectAll('.listing input')["_groups"][0].length  )
                var name_of_unchecked_list = [];
                for(let i = 0; i < d3.selectAll('.listing input')["_groups"][0].length; i++)
                {
                    if (d3.selectAll('.listing input')["_groups"][0][i].checked == false)
                    {
                        var current_id = d3.selectAll('.listing input')["_groups"][0][i]['id']
                        console.log(current_id);
                        name_of_unchecked_list.push(current_id);
                    }
                }
                //console.log("all unchecked listbox");
                //console.log(name_of_unchecked_list);
                //console.log(locationData)
                locationData_unchecked_seleced = locationData.filter(dd=>name_of_unchecked_list.includes(dd[1]['name']))
                id_of_unchecked_list = []
                locationData_unchecked_seleced.forEach(dd=>id_of_unchecked_list.push(dd[0]));
                //console.log("id_of_unchecked_list");
                //console.log(id_of_unchecked_list);
                //console.log("all unchecked listbox's ID");

                d3.selectAll('.map line')
                    .filter(dd=>(id_of_unchecked_list.includes(dd[0].toString()) || id_of_unchecked_list.includes(dd[1].toString())))
                    .classed('transparent', true)



                //d3.selectAll('.map line').filter(dd=> console.log(dd));



                /*
                for(let i = 0; i < d3.selectAll('.listing input')["_groups"][0].length; i++)

                {

                        //console.log(d3.selectAll('.listing input'));
                        //is a checkbox is unchecked
                        if (d3.selectAll('.listing input')["_groups"][0][i].checked == false)
                        {
                            console.log(d3.selectAll('.listing input')["_groups"][0][i])
                            //find the box's name
                            var current_id = d3.selectAll('.listing input')["_groups"][0][i]['id']
                            console.log(current_id);
                            //find the box's num id
                            var pp = locationData.filter(e=>current_id == e[1]["name"])
                            console.log(current_id);
                            //if the pt is a start position or end position, turn the line off
                            qqq = d3.selectAll('.map line')
                                .filter(dd => (pp == dd[0] || pp == dd[1]))
                                .classed('transparent', true);
                            console.log("finish a loop");
                            qqq.filter(rr => console.log("rr   "+dd));
                        }
                }*/

            } else { //uncheck the box

                checkboxes.filter(q=> q[1]['name']==d[1]['name']).attr("checked", false)

                d3.selectAll('.map circle').filter(dd => dd[1]['name'] == d[1]['name'])
                    .classed('transparent', true)


                d3.selectAll('.map line').filter( dd => (d[0] == dd[0] || d[0] == dd[1]))
                   .classed('transparent', true)
            }

        })

    }


    locations.append("text").text(d => d[1].name);

    // ---
    // Add event handlers for linked highlighting here
    // ---
    locations.on('mouseover', function(event, d) {
        //console.log(d);
        d3.select(event.currentTarget)
            .classed('highlight', true)

        d3.selectAll('.map circle').filter(dd => dd[1]['name'] == d[1]['name'])
           .classed('highlight', true)
    })

    locations.on('mouseout', function(event, d) {
        d3.select(event.currentTarget)
            .classed('highlight', false)

        d3.selectAll('.map circle').filter(dd => dd[1]['name'] == d[1]['name'])
            .classed('highlight', false)

    })


}

function createMap(mapData, locations, trips, divId, w=480, h=640) {
    var locEntries = Object.entries(locations);
    var svg = d3.select(divId + " .map").append("svg")
        .attr("width", w)
        .attr("height", h);

    // NY State Plane East
    var proj = d3.geoTransverseMercator()
        .rotate([74 + 30 / 60, -38 - 50 / 60])
        .fitExtent([[10,10],[w-20,h-20]], mapData);

    var path = d3.geoPath().projection(proj);

    var districts = svg.selectAll(".district")
        .data(mapData.features)
        .join("path")
        .attr("d", path)
        .attr("class", d => "district district-" + d.properties.communityDistrict)
        .attr("fill", "#D3D3D3")
        .attr("stroke","white")
        .attr("stroke-width","1")
        .append("title").text(d => d.properties.communityDistrict);

    const widthScale = d3.scaleLinear().domain([0, d3.max(trips, d => d[2])])
        .range([0,8]);

    var lines = svg.selectAll(".route")
        .data(trips)
        .join("line")
        .attr("class", "route")
        .attr("stroke", "red")
        .attr("x1", d => proj([locations[d[0]].longitude,locations[d[0]].latitude])[0])
        .attr("y1", d => proj([locations[d[0]].longitude,locations[d[0]].latitude])[1])
        .attr("x2", d => proj([locations[d[1]].longitude,locations[d[1]].latitude])[0])
        .attr("y2", d => proj([locations[d[1]].longitude,locations[d[1]].latitude])[1])
        .attr("stroke-width", d => widthScale(d[2]) + "px");

    var circles = svg.selectAll(".point")
        .data(locEntries)
        .join("circle")
        .attr("class", "point")
        .attr("fill","blue")
        .attr("cx", d => proj([d[1].longitude,d[1].latitude])[0])
        .attr("cy", d => proj([d[1].longitude,d[1].latitude])[1])
        .attr("r", 5);

    circles.append("title").text(d => d[1].name);

    // ---
    // Add event handlers for linked highlighting
    // ---
    circles.on('mouseover', function(event, d) {
        //console.log("current" + d3.select(event.currentTarget))
        //console.log(d)
        d3.select(event.currentTarget)
            .classed('highlight', true)



        d3.selectAll('.listing li').filter(dd => {return dd[1]['name'] == d[1]['name']})
            .classed('highlight', true)

        //if the checkbox is unchecked, the checkbox line would not be highlighted.
        //console.log(d3.selectAll('.listing input').attr("checked"))
        //console.log(d3.selectAll('.listing input').filter(w => w[1]['name'] == d[1]['name']).attr('checked'))
        if(d3.selectAll('.listing input').filter(w => w[1]['name'] == d[1]['name']).attr('checked') =="false") {
            d3.selectAll('.listing li').filter(dd => {return dd[1]['name'] == d[1]['name']})
                .classed('highlight', false)
        }




    })

    circles.on('mouseout', function(event, d) {
        d3.select(event.currentTarget)
            .classed('highlight', false)

        d3.selectAll('.listing li').filter(dd => dd[1]['name'] == d[1]['name'])
            .classed('highlight', false)
    })

    lines.on('mouseover', function(event, d){
        //console.log("current" + d3.select(event.currentTarget))
        d3.select(event.currentTarget)
            .classed('highlight', true)

        var stn_id_num_1 = d3.selectAll('.map circle').filter(dd => dd[0] == d[0])
        var stn_id_num_2 = d3.selectAll('.map circle').filter(dd => dd[0] == d[1])
        //console.log(stn_id_num_1["_groups"][0][0].textContent)
        //console.log(stn_id_num_2["_groups"][0][0].textContent)
        d3.selectAll('.listing li').filter(dd => dd[1]['name'] == stn_id_num_1["_groups"][0][0].textContent)
            .classed('highlight', true)
        d3.selectAll('.listing li').filter(dd => dd[1]['name'] == stn_id_num_2["_groups"][0][0].textContent)
            .classed('highlight', true)

        //if the station point(start point) is turned off ,turning off the line's highlight
        if(d3.selectAll('.listing input').filter(w => w[1]['name'] == stn_id_num_1["_groups"][0][0].textContent).attr('checked') =="false") {
            d3.selectAll('.listing li').filter(dd => {return dd[1]['name'] == stn_id_num_1["_groups"][0][0].textContent})
                .classed('highlight', false)
            d3.selectAll('.listing li').filter(dd => {return dd[1]['name'] == stn_id_num_2["_groups"][0][0].textContent})
                .classed('highlight', false)
        }
        //if the station point(end point) is turned off ,turning off the line's highlight
        if(d3.selectAll('.listing input').filter(w => w[1]['name'] == stn_id_num_2["_groups"][0][0].textContent).attr('checked') =="false") {
            d3.selectAll('.listing li').filter(dd => {return dd[1]['name'] == stn_id_num_1["_groups"][0][0].textContent})
                .classed('highlight', false)
            d3.selectAll('.listing li').filter(dd => {return dd[1]['name'] == stn_id_num_2["_groups"][0][0].textContent})
                .classed('highlight', false)
        }
    })

    lines.on('mouseout', function(event, d){
        //console.log("current" + d3.select(event.currentTarget))
        d3.select(event.currentTarget)
            .classed('highlight', false)

        var stn_id_num_1 = d3.selectAll('.map circle').filter(dd => dd[0] == d[0])
        var stn_id_num_2 = d3.selectAll('.map circle').filter(dd => dd[0] == d[1])
        //console.log(stn_id_num_1["_groups"][0][0].textContent)
        //console.log(stn_id_num_2["_groups"][0][0].textContent)
        d3.selectAll('.listing li').filter(dd => dd[1]['name'] == stn_id_num_1["_groups"][0][0].textContent)
            .classed('highlight', false)
        d3.selectAll('.listing li').filter(dd => dd[1]['name'] == stn_id_num_2["_groups"][0][0].textContent)
            .classed('highlight', false)


    })

    return svg;
}












function createHistogram(tripsData, divId) {
    //selecting the trip data
    //console.log(tripsData)
    var filtered_tripsData = tripsData.filter(d=>{
        return (d.trip_duration <=3600)
    })
    //console.log(filtered_tripsData)


    //set the size
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        w = 640 - margin.left - margin.right,
        h = 480- margin.top - margin.bottom;

    //creat the svg
    var svg = d3.select(divId)
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([0,3600]).nice()
        .range([0,w])

    var histogram = d3.histogram()
        .value(function(d) { return d.trip_duration; })
        .domain(x.domain())
        .thresholds(x.ticks(100));

    var bins = histogram(tripsData);

    var y = d3.scaleLinear()
        .range([h, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]).nice(9);

    //adding axis
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(x));
    svg.append("g")
        .call(d3.axisLeft(y));



    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 2)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -2 ; })
        .attr("height", function(d) { return h - y(d.length); })
        .style("fill", "green")

    d3.selectAll("rect")
        .on("mouseover", function(d) {
            d3.select(this).attr('stroke-width', '2');
        })

}

function createVis(data)
{
    //console.log("DATA:", data);
    const tripsData = data[0];
    let mapData = data[1];

    // {key: value, key2: value2, ...} -> [[key, value], [key2, value2], ...]
    const entries = Object.entries(tripsData.stations);
    //console.log("entries[0]")
    //console.log(entries[0]);
    // extract only the districts
    const districts = new Set(entries.map(d => d[1].district));
    //console.log(districts);
    // only show districts that have trips
    mapData.features = mapData.features.filter(d => districts.has(d.properties.communityDistrict));

    // this gives us number of trips between two stations (for the route width)
    const trips = d3.rollup(tripsData.trips, v => v.length, d => d.start_station, d => d.end_station);


    // convert nested Maps into [start_station, end_station, count]
    const tripsFlat = Array.from(trips.entries()).map(d => Array.from(d[1].entries()).map(dd => [d[0], dd[0], dd[1]])).flat();
    //console.log("TRIPS:", tripsFlat);
    //console.log(tripsFlat[0])

    // Parts 1 & 2
    createMap(mapData, tripsData.stations, tripsFlat, "#filter-map");
    createListing(entries, "#filter-map");

    // Part 3
    createHistogram(tripsData.trips, "#histogram")


    /*
    // Part 4
    // ---
    // Add code to create districtPoints and districtTrips and uncomment createMap call
    console.log("part4")
    //console.log(tripsData.stations["3539"].district)



    var test = tripsData.trips.forEach(d=> {
        //console.log(d["start_station"]);
        d["start_district"] = tripsData.stations[d["start_station"].toString()].district;
        d["end_district"] = tripsData.stations[d["end_station"].toString()].district;
    } )
    //console.log(tripsData.trips)


    var test1 = tripsData.trips
    test1 = test1.filter(d=> d["start_district"]!= d["end_district"] )

    const districtTrips_rollup = d3.rollup(test1, v => v.length, d => d.start_district, d => d.end_district);
    const districtTrips = Array.from(districtTrips_rollup.entries()).map(d => Array.from(d[1].entries()).map(dd => [d[0], dd[0], dd[1]])).flat();
    //console.log(districtTrips)

    //console.log(mapData.features.forEach(d=> console.log(d.properties.centroid[0])))
    var districtPoints = new Object()
    mapData.features.forEach(d=> {
        var dist_center_temp = {
            "latitude" : d.properties.centroid[1],
            "longitude": d.properties.centroid[0],
            "district": d.properties.communityDistrict,
            "name": d.properties.communityDistrict.toString()
        }
        districtPoints[d.properties.communityDistrict.toString()] = dist_center_temp
    })
    //console.log(districtPoints)

    //console.log("entries")
    //(entries);

    const entries_1 = Object.entries(districtPoints);
    createMap(mapData, districtPoints, districtTrips, '#aggregation-map');
    createListing(entries_1, "#aggregation-map");

    // ---*/

}

Promise.all([d3.json("https://gist.githubusercontent.com/xuezhicang/4c6b47802bae6298e4c23a5977d532df/raw/ab743d57a6d1c33088beef2ce4fe276f04439427/citi-bike-nyc-2019-08-subset.json"),
    d3.json("https://gist.githubusercontent.com/xuezhicang/2026c33bdb39b28dcababbfc054df5f1/raw/a14f705c0d0ec65b6a239e2bc82aa8db3e999100/nyc-community-districts.json")])
    .then(createVis);