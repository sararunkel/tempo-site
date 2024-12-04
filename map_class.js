class MapInitializer {
    constructor(containerId, data, stops, variable) {
        this.containerId = containerId;
        this.style = 'mapbox://styles/mapbox/streets-v12';
        this.center = mapCenter;
        this.zoom = mapZoom;
        this.projection = project;
        this.bounds = bounds;
        this.data = data;
        this.stops = stops;
        this.var = variable;
        this.map = null;
        this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        this.TRACT=null;
        this.POC=0;
    }

    initializeMap() {
        this.map = new mapboxgl.Map({
            container: this.containerId,
            style: this.style,
            center: this.center,
            zoom: this.zoom,
            projection: this.projection
        });

        this.map.setMaxBounds(this.bounds);

        this.map.on('load', () => {
            this.addSource();
            this.addLayers();
            this.addEventListeners();
        });
    }

    addSource() {
        this.map.addSource('us-data', {
            type: 'geojson',
            tolerance: 0.1,
            data: this.data,
            generateId: true
        });
        this.map.addSource('census-data', {
            type: 'geojson',
            tolerance: 0.1,
            data: censusData,
            generateId: true
        });
    }

    addLayers() {
        this.map.addLayer({
            'id': 'tract-layer',
            'type': 'fill',
            'source': 'us-data',
            'minzoom': zoomThresh,
            'paint': {
                'fill-color': [
                    'case',
                    ['==', ['get', this.var], null],
                    'rgba(0, 0, 0, 0)',
                    ['interpolate', ['linear'], ['get', this.var], ...this.stops]
                ]
            }
        });
        this.map.addLayer({
            'id': 'tract-lines',
            'type': 'line',
            'source': 'census-data',
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

        // Add other layers as needed
    }

    addEventListeners() {
        this.map.on('mousemove', 'tract-layer', (e) => {
            this.map.getCanvas().style.cursor = 'pointer';

            if (e.features.length > 0) {
            if (this.hoveredStateId !== null) {
            this.map.setFeatureState(
                { source: 'census-data', id: this.hoveredStateId },
                { hover: false }
                );
                }

                //e.layer.getBounds().getCenter()
            this.hoveredStateId = e.features[0].id
            this.map.setFeatureState(
                { source: 'census-data', id: this.hoveredStateId },
                { hover: true }
                );
            
                }
                const fieldAvg = e.features[0].properties.field_avg;
                const desc = `<h3>${this.TRACT}</h3>
                    <p><strong> NO<sub>2</sub>: </strong> ${fieldAvg !== undefined ? fieldAvg.toFixed(2) : 'N/A'} <span>&times;</span> <em>10<sup>15</sup>  molec/cm<sup>2</sup>  </em></p>
                    <p><strong> % POC: </strong> ${this.POC !== undefined ? this.POC.toFixed(2) : 'N/A'}</p>`;
                //document.getElementById('poc').innerHTML = desc;
                this.popup.setLngLat(e.lngLat)
                    .setHTML(desc)
                    .addTo(this.map);
            // Query features from the census-data source
            const dataFeatures = this.map.queryRenderedFeatures(e.point, {
                sourceLayer: ['tract-lines']
            });

            
        });
        this.map.on('mousemove', 'tract-lines', (e) => {
                if (e.features.length > 0) {
                    this.TRACT = e.features[0].properties.tract;

                    this.POC = e.features[0].properties.PercentPOC;
                    
                }
            });
    

        this.map.on('mouseleave', 'tract-layer', () => {
            if (this.hoveredStateId !== null) {
            this.map.setFeatureState(
                { source: 'census-data', id: this.hoveredStateId },
                { hover: false }
                );
            }
            this.map.getCanvas().style.cursor = '';
            this.hoveredStateId = null;
            this.popup.remove()
            });
            
        // Add event listeners as needed
    }
    
    changeVariable(newVariable, newStops) {
        this.variable = newVariable;
        this.stops = newStops;
        if (this.map && this.map.getLayer('tract-layer')) {
            this.map.setPaintProperty('tract-layer', 'fill-color', [
                'case',
                ['==', ['get', this.variable], null],
                'rgba(0, 0, 0, 0)',
                ['interpolate', ['linear'], ['get', this.variable], ...this.stops]
            ]);
        } else {
            console.error('Layer "tract-layer" does not exist on the map or map is not initialized.');
        }
    }
    getMap() {
        return this.map;
    }
}

// Usage
const beforeMapConfig = {
    containerId: 'before',
    data: leftData,
    stops: STOPS,
    variable: 'field_avg'
};

const afterMapConfig = {
    containerId: 'after',
    data: rightData,
    stops: STOPS,
    variable: 'field_avg'
};
const censusMapConfig = {
    containerId: 'after',
    data: censusData,
    stops: census_STOPS,
    variable: 'PercentPOC'
};



const leftMap = new MapInitializer(
    beforeMapConfig.containerId,
    beforeMapConfig.data,
    beforeMapConfig.stops,
    beforeMapConfig.variable
);

const rightMap = new MapInitializer(
    afterMapConfig.containerId,
    afterMapConfig.data,
    afterMapConfig.stops,
    afterMapConfig.variable
);
const censusMap = new MapInitializer(
    censusMapConfig.containerId,
    censusMapConfig.data,
    censusMapConfig.stops,
    censusMapConfig.variable
);
leftMap.initializeMap();


rightMap.initializeMap();



