const zoomThresh = 5;
const firstSymbolId = 'bridge-rail';//'road-simple'; 
const firstSymbolId2 = 'bridge-rail';//'road-simple';
const project ='albers'
const STOPS = [
    0, '#0a62c0',
    1, '#6ed4fc',
    2, '#a0ffb8',
    3, '#fff837',
    4, '#ffa646',
    5, '#d05134',
    6, '#75001d',
    7, '#4e0014'
];
    //'admin-1-boundary';
const bounds = [
    [-106.08195926, 38.8791579], // Southwest coordinates
    [-103.95380958, 40.73862622] // Northeast coordinates
    ];



let leftData = 'data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_012024_15Z_V3.geojson';
let rightData = 'data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_012024_22Z_V3.geojson';
// Function to update the labels
function updateLabels(side) {
    const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabel = monthArr[monthObj.value - 1];
    const timeLabel = timeLabels[rangeObj.value - rangeObj.min];
    if (side === 'left') {
        document.getElementById('before-label').textContent = `${monthLabel} ${timeLabel}`;
    } else {
    document.getElementById('after-label').textContent = `${monthLabel} ${timeLabel}`;}
}
function updateData() {
    let month = document.getElementById('month-slider').ej2_instances[0].value;
    let year = '2024'
    if (month >8){
        year='2023'
    }
    month = month.toString().padStart(2, '0');
    let hour = document.getElementById('time-slider').ej2_instances[0].value 
    hour = (hour + 7) % 24; // Convert MST to UTC
    hour = hour.toString().padStart(2, '0'); ///.toString().padStart(2, '0');
    console.log('Month:', month, 'Hour:', hour);
    const selectedMap = document.querySelector('input[name="mapSelector"]:checked').value;
    if (selectedMap === 'left') {
        leftData = `data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_${month}${year}_${hour}Z_V3.geojson`;
        console.log(leftData)
        beforemap.getSource('us-data').setData(leftData);
    } else {
        rightData = `data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_${month}${year}_${hour}Z_V3.geojson`;
        aftermap.getSource('us-data').setData(rightData);
    }
    updateLabels(selectedMap);
}

function updateHourValue(value) {
    document.getElementById('hour-value').textContent = value;
}
mapboxgl.accessToken = 'pk.eyJ1Ijoic3J1bmtlbCIsImEiOiJjbGRrZmdyc3cxbWxmM29udWd6cHZqeXA0In0.KDgLcBpTZkKMYMVcoory4Q';
const beforemap = new mapboxgl.Map({
    container: 'before',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11', //'mapbox://styles/mapbox/streets-v12',
    center: [-105, 40],
    zoom: 8,
    projection: project
});
beforemap.setMaxBounds(bounds);
    let hoveredStateId = null;
    beforemap.on('load', () => {
        const layers = beforemap.getStyle().layers;

    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    beforemap.addSource('us-data', {
        type: 'geojson',
        tolerance:0.1,
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: leftData,
        //data: 'https://raw.githubusercontent.com/anenbergresearch/AQ-Files/main/tropomi-county-demographics.geojson',
        generateId:true
        // Radius of each cluster when clustering points (defaults to 50)
    });
    // beforemap.addSource('county-data', {
    //     type: 'geojson',
    //     tolerance:0.1,
    //     // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    //     // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    //     data: 'https://raw.githubusercontent.com/anenbergresearch/AQ-Files/main/tropomi-county-demographics-round.geojson',
    //     generateId:true
    //     // Radius of each cluster when clustering points (defaults to 50)
    // });
    beforemap.addLayer({
        'id': 'tract-layer',
        'type': 'fill',
        'source': 'us-data',
        'minzoom':5,
        'paint': {
            'fill-color': [
                'case',
                ['==', ['get', 'field_avg'], null], // Check if 'field_avg' is null
                'rgba(0, 0, 0, 0)', // Set to transparent if null
                ['interpolate', ['linear'], ['get', 'field_avg'], ...STOPS] // Use the stops for other values
            ],
        }             
        //'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
        , firstSymbolId);

        beforemap.addLayer({
            'id': 'tract-lines',
            'type': 'line',
            'source': 'us-data',
            'minzoom':zoomThresh,
            //'layout': {},
            'paint': {
            'line-color': '#000000',
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                0
                ]
            }
            });
        
            beforemap.on('mousemove', 'tract-layer', (e) => {
                beforemap.getCanvas().style.cursor = 'pointer';

                if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                beforemap.setFeatureState(
                    { source: 'us-data', id: hoveredStateId },
                    { hover: false }
                    );
                    }

                    //e.layer.getBounds().getCenter()
                hoveredStateId = e.features[0].id
                beforemap.setFeatureState(
                    { source: 'us-data', id: hoveredStateId },
                    { hover: true }
                    );
                    }
            });

            beforemap.on('mousemove', 'tract-layer', (e) => {
                const desc = `<h3>${e.features[0].properties.FIPS_new}</h3><p><strong> NO<sub>2</sub>: </strong> ${e.features[0].properties.field_avg} <span>&times;</span> <em>10<sup>15</sup>  molec/cm<sup>2</sup>  </em></p>`;
                document.getElementById('poc').innerHTML = desc	
            });
            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
            beforemap.on('mouseleave', 'tract-layer', () => {
                if (hoveredStateId !== null) {
                beforemap.setFeatureState(
                    { source: 'us-data', id: hoveredStateId },
                    { hover: false }
                    );
                }
                beforemap.getCanvas().style.cursor = '';
                hoveredStateId = null;
                });

        });
            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
                //e.layer.getBounds().getCenter()
                

            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
    const aftermap = new mapboxgl.Map({
        container: 'after',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-105, 40],
        zoom: 8,
        projection: project
        });
    aftermap.setMaxBounds(bounds);
    aftermap.on('load', () => {
        const layers = aftermap.getStyle().layers;
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    aftermap.addSource('us-data', {
        type: 'geojson',
        tolerance:0.1,       // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: rightData,//'data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_012024_22Z_V3.geojson',
        generateId:true
        // Radius of each cluster when clustering points (defaults to 50)
    })
    
    
    // aftermap.addSource('county-data', {
    //     type: 'geojson',
    //     tolerance:0.1,
    //     // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    //     // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    //     data: 'https://raw.githubusercontent.com/anenbergresearch/AQ-Files/main/tropomi-county-demographics-round.geojson',
    //     generateId:true
    //     // Radius of each cluster when clustering points (defaults to 50)
    // });
    aftermap.addLayer({
        'minzoom':zoomThresh,
        'id': 'tract-layer',
        'minzoom':5,
        'type': 'fill',
        'source': 'us-data',
        'paint': {
            'fill-color': [
                'case',
                ['==', ['get', 'field_avg'], null], // Check if 'field_avg' is null
                'rgba(0, 0, 0, 0)', // Set to transparent if null
                ['interpolate', ['linear'], ['get', 'field_avg'], ...STOPS] // Use the stops for other values
            ],
        } 
        },firstSymbolId2);
        aftermap.addLayer({
            'id': 'tract-lines',
            'type': 'line',
            'source': 'us-data',
            'minzoom':zoomThresh,
            //'layout': {},
            'paint': {
            'line-color': '#000000',
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                0
                ]
            }
            });
        
        
        aftermap.on('mousemove', 'tract-layer', (e) => {
            aftermap.getCanvas().style.cursor = 'pointer';
            
            if (e.features.length > 0) {
            if (hoveredStateId !== null) {
            aftermap.setFeatureState(
                { source: 'us-data', id: hoveredStateId },
                { hover: false }
                );
                }
            
                //e.layer.getBounds().getCenter()
                
            hoveredStateId = e.features[0].id
            aftermap.setFeatureState(
                { source: 'us-data', id: hoveredStateId },
                { hover: true }
                );
                }
            });

            aftermap.on('mousemove', 'tract-layer', (e) => {
                const desc = `<h3>${e.features[0].properties.FIPS_new}</h3><p><strong> NO<sub>2</sub>: </strong> ${e.features[0].properties.field_avg} <span>&times;</span> <em>10<sup>15</sup>  molec/cm<sup>2</sup>  </em></p>`;
                document.getElementById('poc').innerHTML = desc	
            });
            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
            aftermap.on('mouseleave', 'tract-layer', () => {
                if (hoveredStateId !== null) {
                aftermap.setFeatureState(
                    { source: 'us-data', id: hoveredStateId },
                    { hover: false }
                    );
                }
                aftermap.getCanvas().style.cursor = '';
                hoveredStateId = null;
                });
            });

    // A selector or reference to HTML element
    const container = '#comparison-container';


    const map = new mapboxgl.Compare(beforemap, aftermap, container, {
    // Set this to enable comparing two maps by mouse movement:
    // mousemove: true
    });
    document.getElementById('listing-group').addEventListener('change', (e) => {
        const handler = e.target.id;
        if (e.target.checked) {
            const firstSymbolId = 'bridge-rail';//'ferry';
            const firstSymbolId2 = 'bridge-rail';
            beforemap.moveLayer('tract-layer', firstSymbolId)
            aftermap.moveLayer('tract-layer', firstSymbolId2)
            } else {
            const firstSymbolId = 'admin-1-boundary-bg';

            beforemap.moveLayer('tract-layer', firstSymbolId)
            aftermap.moveLayer('tract-layer', firstSymbolId)
        }
        
        });