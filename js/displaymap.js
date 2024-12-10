let display;
document.addEventListener('DOMContentLoaded', function() {
    // Your map initialization code here
    const displayMap = new MapInitializer(
        displayConfig.containerId,
        displayConfig.data,
        displayConfig.stops,
        displayConfig.variable
    );
    
    displayMap.initializeMap();
    display =  displayMap.getMap();
    // displayMap.moveLayer('tract-layer','ferry')
    // display.on('load', () => {

    //     const featureId = getQueryParam('FIPS');
    //     const features = display.queryRenderedFeatures({ layers: ['tract-layer'] });
    
    //     const targetFeature = features.find(f => f.properties.FIPS === featureId);
    //     console.log(targetFeature)
    //     if (featureId) {
    //         console.log('Feature ID:', featureId);
    //         // Assuming features are loaded on a specific layer
    //         const layerId = 'tract-layer'; // Replace with your actual layer ID
    
    //         // Query rendered features to find the target feature
    //         const features = display.queryRenderedFeatures({ layers: ['tract-layer'] });
    //         console.log(features)
    //         const targetFeature = features.find(f => f.properties.FIPS === featureId);
    //         console.log(targetFeature)
    //         if (targetFeature) {
    //             if (targetFeature) {
    //                 const coordinates = targetFeature.geometry.coordinates.slice();
    //                 const bounds = new mapboxgl.LngLatBounds();
        
    //                 // Calculate the bounding box of the feature
    //                 targetFeature.geometry.coordinates[0].forEach((coord)=> {
    //                     bounds.extend(coord);
    //                 });
        
    //                 // Use the flyTo method to zoom in on the feature
    //                 display.flyTo({
    //                     center: bounds.getCenter(),
    //                     zoom: 10, // Adjust the zoom level as needed
    //                     speed: 2, // Adjust the speed of the zoom
    //                     curve: 1, // Adjust the curve of the zoom
    //                     easing: (t) => t
    //                     })
    //             // Set the feature state for the clicked feature
    //             if (displayMap.clickedStateId !== null) {
    //                 display.setFeatureState(
    //                     { source: 'us-data', id: this.clickedStateId },
    //                     { clicked: false }
    //                 );
    //             }
    //             displayMap.clickedStateId = feature.id;
    //             display.setFeatureState(
    //                 { source: 'us-data', id: this.clickedStateId },
    //                 { clicked: true }
    //             );
    //             }
    //         } else {
    //             console.error('Feature not found.');
    //         }
    //     } else {
    //         console.log('No feature ID provided in query parameters.');
    //     }
    // });
    // Check for the FIPS parameter on page load

});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
function updateData(selectedMonth, selectedTime) {
    if (selectedMonth === undefined || selectedTime === undefined) {
        return;
    }

    let month = selectedMonth
    let year = '2024'
    if (month >8){
        year='2023'
    }
    const hour_int = selectedTime
    let hour = (hour_int + 7) % 24; // Convert MST to UTC
    hour = hour.toString().padStart(2, '0'); ///
    const months = month.toString().padStart(2, '0');
    console.log('Month:', month, 'Hour:', hour);
    leftData = `../data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_${months}${year}_${hour}Z_V3.geojson`;
    display.getSource('us-data').setData(leftData);
    updateLabels(month, hour_int,year);
}

function updateLabels(month,hour,year) {
    const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let timeLabels = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'];
    const monthLabel = monthArr[month - 1];
    const timeLabel = timeLabels[hour-8];
    document.getElementById('map-title').innerHTML = `Average NO<sub>2</sub> at ${timeLabel} on ${monthLabel}, ${year} `;

}




window.addEventListener('message', function(event) {
    // Ensure the message is from the expected origin
    // if (event.origin !== 'http://your-origin.com') return;

    const { selectedMonth, selectedHour } = event.data;
    console.log('Received month:', selectedMonth, 'Received hour:', selectedHour);

    updateData(selectedMonth, selectedHour);
    // Use the selectedMonth and selectedHour as needed
    // For example, update some elements or perform some actions
});
