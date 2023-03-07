
//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoidmV0dGUyNDMiLCJhIjoiY2xlNHJqbHNrMDVzNzNucDJrYm90djFrcyJ9.j2TYaVOLnNy8bDEv82GwLQ'; //ADD YOUR ACCESS TOKEN HERE

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vette243/cle4pjfh6002401pal69tqaif',
    //center: the center for the map area,for my map would be the GTA area
    center: [-79.418,43.665],
    zoom: 12
});


/*--------------------------------------------------------------------
ADDING MAPBOX CONTROLS AS ELEMENTS ON MAP
--------------------------------------------------------------------*/
//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

/*--------------------------------------------------------------------
mapbox addControl method can also take position parameter 
(e.g., 'top-left') to move from default top right position

--------------------------------------------------------------------*/

//Create geocoder variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "CA"
});

//Use geocoder div to position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));



/*--------------------------------------------------------------------
ADD DATA AS CHOROPLETH MAP ON MAP LOAD
Use get expression to categorise data based on population values
--------------------------------------------------------------------*/
//Add data source and draw initial visiualization of layer
map.on('load', () => {
    map.addSource('Green Space', {
        'type': 'vector',
        'url': 'mapbox://vette243.6n1u76zi'
    });
    map.addSource('Green_Space', {
        type: 'geojson',
        data: 'https://github.com/vette243/Lab3_GGR472/blob/1247dfcb473a34d2526e5dd456f9befa42feef4c/Green%20Spaces.geojson'
    });

    map.addLayer({
        'id': 'Area of Parks',
        'type': 'fill',
        'source': 'Green Space',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'POP2021'], // GET expression retrieves property value from 'capacity' data field
                '#fd8d3c', // Colour assigned to any values < first step
                100000, '#fc4e2a', // Colours assigned to values >= each step
                500000, '#e31a1c',
                1000000, '#bd0026',
                5000000, '#800026'
            ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'white'
        }
    }),
    map.addLayer({
        'id': 'Details',
        'type': 'fill',
        'source': 'Green_Space',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'POP2021'], // GET expression retrieves property value from 'capacity' data field
                '#fd8d3c', // Colour assigned to any values < first step
                100000, '#fc4e2a', // Colours assigned to values >= each step
                500000, '#e31a1c',
                1000000, '#bd0026',
                5000000, '#800026'
            ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'white'
        }
    })
});
//get geo-coordinate from mouse move
    map.on('mousemove', (e) => {
        document.getElementById('info').innerHTML =
    // `e.point` is the x, y coordinates of the `mousemove` event
    // relative to the top-left corner of the map.
        JSON.stringify(e.point) +
    '<br />' +
    // `e.lngLat` is the longitude, latitude geographical position of the event.
        JSON.stringify(e.lngLat.wrap());
    })

/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
//Declare arrayy variables for labels and colours
const legendlabels = [
    'current green space'
];

const legendcolours = [
    '#2c7f32'
];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const color = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the color circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = color; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (color cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});



/*--------------------------------------------------------------------
ADD INTERACTIVITY BASED ON HTML EVENT
--------------------------------------------------------------------*/

//Add event listeneer which returns map view to full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [ -79.418,43.665],
        zoom: 12,
        essential: true
    });
});

//Change display of legend based on check box
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});


//Change map layer display based on check box using setlayoutproperty
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'Green Space',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});


