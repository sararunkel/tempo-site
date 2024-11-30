// Initialize Slider component

//dictionary with the slider values
var SliderValues = {'01': [8, 9, 10, 11, 12, 13, 14, 15],
 '02': [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
 '03': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
 '04': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
 '05': [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
 '06': [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
 '07': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
 '08': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
 '09': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
 '10': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
 '11': [7, 8, 9, 10, 11, 12, 13, 14, 15],
 '12': [8, 9, 10, 11, 12, 13, 14, 15]}

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
    change: updateTimeSlider
});
monthObj.appendTo('#month-slider');

var rangeObj = new ej.inputs.Slider({
    ticks: { placement: 'After', largeStep: 1, smallStep: 1, showSmallTicks: true },
    tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' },
    // Minimum value
    min: 8,
    // Maximum value
    max: 15,
    // Slider current value
    value: 8,
    change: updateData
});
// Render initialized Slider
rangeObj.appendTo('#time-slider');

// Function to update the time slider based on the selected month
function updateTimeSlider(args) {
    var month = args.value.toString().padStart(2, '0');
    var timeValues = SliderValues[month];
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

// // Add event listeners to the sliders
// document.getElementById('month-slider').ej2_instances[0].change = function(args) {
//     updateData();

// };
// document.getElementById('time-slider').ej2_instances[0].change = function(args) {
//     updateData();
// };