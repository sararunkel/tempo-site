
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
const beforemap = leftMap.getMap();
let aftermap = rightMap.getMap();
let censusmap;
let censusVar = 'PercentPOC';

let compareInstance = new mapboxgl.Compare(beforemap, aftermap, map_container, {
    // Set this to enable comparing two maps by mouse movement:
    // mousemove: true
    });
function updateCompareInstance(before, after) {
    if (compareInstance) {
        compareInstance.remove(); // Remove the existing compare instance
    }
    compareInstance = new mapboxgl.Compare(before, after, map_container, {
        // Set this to enable comparing two maps by mouse movement:
        // mousemove: true
    });
}


document.getElementById('roadways').addEventListener('change', (e) => {
    const handler = e.target.id;
    if (e.target.checked) {
        const firstSymbolId = 'ferry';
        const firstSymbolId2 = 'ferry';
        beforemap.moveLayer('tract-layer', firstSymbolId)
        aftermap.moveLayer('tract-layer', firstSymbolId2)
        } else {
        const firstSymbolId = 'admin-1-boundary-bg';

        beforemap.moveLayer('tract-layer', firstSymbolId)
        aftermap.moveLayer('tract-layer', firstSymbolId)
    }
    
    });

document.getElementById('census').addEventListener('change', (e) => {
    const handler = e.target.id;
    if (e.target.checked) {
        /// create new aftermap
        if (aftermap) {
            aftermap.remove();
        }
        
        censusMap.initializeMap();
        aftermap = censusMap.getMap();
        updateCompareInstance(beforemap, aftermap);
        } else {
        if (aftermap) {
            aftermap.remove()
        }
        rightMap.initializeMap();
        aftermap = rightMap.getMap();
        updateCompareInstance(beforemap, aftermap);
    }
    
    });

    // document.getElementById('census').addEventListener('change', (e) => {
    //     // Remove the existing 'tract-layer' if it exists
    //     const handler = e.target.id;
    //     if (e.target.checked) {
    //     if (aftermap.getLayer('tract-layer')) {
    //         aftermap.removeLayer('tract-layer');
    //     }
    //     aftermap.addLayer({
    //         id: 'tract-layer',
    //         type: 'fill', // Adjust the type based on your data, e.g., 'line' or 'symbol'
    //         source: 'census-data',
    //     },firstSymbolId)
    //     // Add the 'tract-layer' with the 'census-data' source
    //     rightMap.changeVariable('PercentPOC', census_STOPS);
    //     // Log or alert to confirm update
    //     console.log('tract-layer updated to use census-data.');}
    //     else {
    //         if (aftermap.getLayer('tract-layer')) {
    //             aftermap.removeLayer('tract-layer');
    //         }
    //         rightMap.changeVariable('field_avg', STOPS);
    //         console.log('tract-layer updated to use NO2 data.');
    //     }
    // });
    document.getElementById('census-variable').addEventListener('change', (e) => {
        censusVar = e.target.value;
        censusMap.changeVariable(censusVar, census_STOPS[censusVar]);
    });