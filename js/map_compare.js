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


leftMap.initializeMap();


rightMap.initializeMap();
document.addEventListener('DOMContentLoaded', function() {
    const sliderComponent = new SliderComponent();
    //get month slider from html
    monthObj= document.getElementById('month-slider').ej2_instances[0];
    rangeObj = document.getElementById('time-slider').ej2_instances[0];
});



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
        leftData = `../data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_${month}${year}_${hour}Z_V3.geojson`;
        console.log(leftData)
        beforemap.getSource('us-data').setData(leftData);
    } else {
        rightData = `../data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_${month}${year}_${hour}Z_V3.geojson`;
        aftermap.getSource('us-data').setData(rightData);
    }
    updateLabels(selectedMap);
}

function updateHourValue(value) {
    document.getElementById('hour-value').textContent = value;
}
const beforemap = leftMap.getMap();
let aftermap = rightMap.getMap();
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
document.getElementById('census').addEventListener('change', function() {
    const dropdownContainer = document.getElementById('census-dropdown-container');
    const selectorContainer = document.querySelector('#select-maps');
    const legendContainer = document.getElementById('#census-colors');
    if (this.checked) {
        console.log('Using census dat')
        dropdownContainer.style.display = 'block';
        selectorContainer.style.display = 'none';
        document.querySelector('input[name="mapSelector"][value="left"]').checked = true;
    } else {
        dropdownContainer.style.display = 'none';
        selectorContainer.style.display = 'block';
    }
});


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
        /// update rightMap
        rightMap.changeVariable(censusVar, census_STOPS[censusVar]);
    }
    else {
        rightMap.changeVariable('field_avg', STOPS);}
    });

    document.getElementById('census-variable').addEventListener('change', (e) => {
        censusVar = e.target.value;
        rightMap.changeVariable(censusVar, census_STOPS[censusVar]);
    });

    var mapSelector = document.querySelectorAll('input[name="mapSelector"]');
    mapSelector.forEach(function(radio) {
        radio.addEventListener('change', function() {
            var selectedMap = document.querySelector('input[name="mapSelector"]:checked').value;
            console.log('Selected map:', selectedMap);
            // Add your logic here to handle the map selection
        });
    });
     
    document.addEventListener('DOMContentLoaded', (event) => {
        const draggableDiv = document.getElementById('draggable-div');
        const consoleButton = document.getElementById('console-button');
        const sliderContainer = draggableDiv.querySelector('.slider-container');
        const consoleContent = document.querySelector('.console-content');
        const console = document.getElementById('console');
        consoleButton.addEventListener('click', () => {
            if (sliderContainer.classList.contains('hidden')) {
                sliderContainer.classList.remove('hidden');
            } else {
                sliderContainer.classList.add('hidden');
                consoleButton.innerHTML = '<i class="fas fa-plus"></i>'; 
            }
        });
        function positionDraggableDiv() {
            const consoleHeight = console.offsetHeight;
            draggableDiv.style.top = (consoleHeight) + 'px';
        }
        positionDraggableDiv();
        consoleButton.addEventListener('click', () => {
            if (console.classList.contains('console-collapsed')) {
                console.style.display='block';
                draggableDiv.style.display = 'block';
                
                console.classList.remove('console-collapsed');
                console.classList.add('console-expanded');
                consoleButton.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                console.classList.remove('console-expanded');
                console.classList.add('console-collapsed');
                console.style.display = 'none';
                draggableDiv.style.display = 'none';
                consoleButton.innerHTML = '<i class="fas fa-window-maximize"></i>';
            }
            consoleContent.style.display = consoleContent.style.display === 'none' ? 'block' : 'none';
        });
        //TODO: add sequential instructions for the map settings so the user first selects map, then month then hour. 
        //Then the date and time will update 
    
        draggableDiv.addEventListener('mousedown', (e) => {
            const rect = draggableDiv.getBoundingClientRect();
            draggableDiv.style.top = rect.top + 'px';
            draggableDiv.style.bottom = 'auto';
    
            let shiftX = e.clientX - rect.left;
            let shiftY = e.clientY - rect.top;
    
            function moveAt(pageX, pageY) {
                draggableDiv.style.left = pageX - shiftX + 'px';
                draggableDiv.style.top = pageY - shiftY + 'px';
            }
    
            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }
    
            document.addEventListener('mousemove', onMouseMove);
    
            draggableDiv.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
                draggableDiv.onmouseup = null;
            });
    
            draggableDiv.ondragstart = () => {
                return false;
            };
        });
    });
    
    document.addEventListener('DOMContentLoaded', (event) => {
        const censusVariableSelect = document.getElementById('census-variable');
        const colorbar = document.getElementById('census-colorbar');
    
        function updateColorbar(variable) {
            const stops = census_STOPS[variable];
            console.log('Updating color bar for variable:', variable);
            colorbar.innerHTML = ''; // Clear existing color bar segments
    
            for (let i = 1; i < stops.length; i += 2) {
                const colorSegment = document.createElement('div');
                colorSegment.className = 'colorbar-segment';
                colorSegment.style.backgroundColor = stops[i];
                colorbar.appendChild(colorSegment);
            }
        }
    
        // Update color bar when the dropdown value changes
        censusVariableSelect.addEventListener('change', (e) => {
            updateColorbar(e.target.value);
        });
    });
    

///INFO POPUP

document.getElementById('info-button').onclick = function() {
    document.getElementById('info-popup').style.display = 'block';
}

document.querySelector('.info-popup .close').onclick = function() {
    document.getElementById('info-popup').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('info-popup')) {
        document.getElementById('info-popup').style.display = 'none';
    }
}