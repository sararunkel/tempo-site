const zoomThresh = 5;
const firstSymbolId = 'ferry';//'road-simple'; 
const project ='albers'
    //'admin-1-boundary';
const bounds = [
    [-106.08195926, 38.8791579], // Southwest coordinates
    [-103.95380958, 40.73862622] // Northeast coordinates
    ];
mapboxgl.accessToken = 'pk.eyJ1Ijoic3J1bmtlbCIsImEiOiJjbGRrZmdyc3cxbWxmM29udWd6cHZqeXA0In0.KDgLcBpTZkKMYMVcoory4Q';
const beforemap = new mapboxgl.Map({
    container: 'before',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-104.5917, 40],
    zoom: 11,
    projection: project
});
beforemap.setMaxBounds(bounds);
    let hoveredStateId = null;
    beforemap.on('load', () => {
        const layers = beforemap.getStyle().layers;
        console.log(layers);

    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    beforemap.addSource('us-data', {
        type: 'geojson',
        tolerance:0.1,
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: 'data/HAQ_TEMPO_NO2_CONUS_QA75_L3_Summer2024_9AM_V3.geojson',
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
        'fill-color': {property: 'field_avg',
                        stops:[
                            [0,
                            '#5CB946'],
                            [0.5,
                            '#99d15a'],
                            [1,
                            '#bbdf52'],
                            [1.5,
                            '#dbed47'],
                            [2,
                            '#fbfb39'],
                            [2.5,
                            '#f7c004'],
                            [4,
                            '#df860c'],
                            [5,
                            '#be4e0f'],
                            [6,
                            '#97000e'],
                            [7,'#441D14' 
                            ]]},
                       
        //'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
        }, firstSymbolId);

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
                console.log(e.features[0])        
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
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-104.5917, 40],
        zoom: 11,
        projection: project
        });
    aftermap.setMaxBounds(bounds);
    aftermap.on('load', () => {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    aftermap.addSource('us-data', {
        type: 'geojson',
        tolerance:0.1,       // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: 'data/HAQ_TEMPO_NO2_CONUS_QA75_L3_Summer2024_5PM_V3.geojson',
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
        'fill-color': {property: 'field_avg', 
            stops:[
                [0,
                '#5CB946'],
                [0.5,
                '#99d15a'],
                [1,
                '#bbdf52'],
                [1.5,
                '#dbed47'],
                [2,
                '#fbfb39'],
                [2.5,
                '#f7c004'],
                [4,
                '#df860c'],
                [5,
                '#be4e0f'],
                [6,
                '#97000e'],
                [7,'#441D14' 
                ]]},
                       
        //'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
        },firstSymbolId);
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
            const firstSymbolId = 'ferry';
            beforemap.moveLayer('county-layer', firstSymbolId)
            aftermap.moveLayer('county-layer', firstSymbolId),
            beforemap.moveLayer('tract-layer', firstSymbolId)
            aftermap.moveLayer('tract-layer', firstSymbolId)
            } else {
            const firstSymbolId = 'admin-1-boundary-bg';
            beforemap.moveLayer('county-layer', firstSymbolId)
            aftermap.moveLayer('county-layer', firstSymbolId),
            beforemap.moveLayer('tract-layer', firstSymbolId)
            aftermap.moveLayer('tract-layer', firstSymbolId)
        }
        
        });