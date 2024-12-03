// Initialize Slider component

//dictionary with the slider values
var SliderValues = {'01': [8, 9, 10, 11, 12, 13, 14, 15],
 '02': [8, 9, 10, 11, 12, 13, 14, 15, 16],
 '03': [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
 '04': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
 '05': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
 '06': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
 '07': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
 '08': [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
 '09': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
 '10': [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
 '11': [8, 9, 10, 11, 12, 13, 14, 15],
 '12': [8, 9, 10, 11, 12, 13, 14, 15]}
 let timeLabels = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM',];

 // Initialize Slider for the month
var monthObj = new ej.inputs.Slider({
    ticks: { placement: 'After', largeStep: 1, smallStep: 1, showSmallTicks: true, showTicks:true },
    tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' },
    // Minimum value
    min: 1,
    // Maximum value
    max: 12,
    // Slider current value
    value: 1,
    renderingTicks: function (args) {
        // Month Array
        var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // Ensure args.value is valid
        if (args.value !== undefined && args.value >= 1 && args.value <= 12) {
            args.text = monthArr[args.value - 1];
        } else {
            args.text = '';
        }
    },
    change: updateTimeSlider
});
monthObj.appendTo('#month-slider');

var rangeObj = new ej.inputs.Slider({
    ticks: { placement: 'After', largeStep: 2, smallStep: 1, showSmallTicks: true },
    tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' },
    // Minimum value
    min: 8,
    // Maximum value
    max: 15,
    // Slider current value
    value: 8,
    renderingTicks: function (args) {
        // Use the timeLabels array to display the correct labels
        if (args.value !== undefined && args.value >= rangeObj.min && args.value <= rangeObj.max) {
            args.text = timeLabels[args.value - rangeObj.min];
        } else {
            args.text = '';
        }
    },
    change: updateData
});
// Render initialized Slider
rangeObj.appendTo('#time-slider');

// Function to update the time slider based on the selected month
function updateTimeSlider(args) {
    var month = args.value.toString().padStart(2, '0');
    var timeValues = SliderValues[month];
    // Create a string array of time values in AM/PM format
    timeLabels = timeValues.map(function(value) {
        return (value === 12 ? 12 : value % 12) + (value < 12 ? ' AM' : ' PM');
    });
    rangeObj.min = Math.min(...timeValues);
    rangeObj.max = Math.max(...timeValues);
    rangeObj.value = rangeObj.min;
    rangeObj.dataBind();
    updateData()
}

var mapSelector = document.querySelectorAll('input[name="mapSelector"]');
mapSelector.forEach(function(radio) {
    radio.addEventListener('change', function() {
        var selectedMap = document.querySelector('input[name="mapSelector"]:checked').value;
        console.log('Selected map:', selectedMap);
        // Add your logic here to handle the map selection
    });
});

document.querySelector('.console-header').addEventListener('click', function() {
    const consoleContent = document.querySelector('.console-content');
    consoleContent.style.display = consoleContent.style.display === 'none' ? 'block' : 'none';
    const console = document.getElementById('console');
    console.classList.toggle('console-collapsed');
    console.classList.toggle('console-expanded');
});

document.getElementById('census').addEventListener('change', function() {
    const dropdownContainer = document.getElementById('census-dropdown-container');
    const selectorContainer = document.querySelector('.selector-container');
    if (this.checked) {
        console.log('Using census dat')
        dropdownContainer.style.display = 'block';
        selectorContainer.classList.add('hidden');
        document.querySelector('input[name="mapSelector"][value="left"]').checked = true;
    } else {
        dropdownContainer.style.display = 'none';
        selectorContainer.classList.remove('hidden');
    }
});
// // Add event listeners to the sliders
// document.getElementById('month-slider').ej2_instances[0].change = function(args) {
//     updateData();

// };
// document.getElementById('time-slider').ej2_instances[0].change = function(args) {
//     updateData();
// };