
// Initialize variables to store slider values
let selectedTime = 8;
let selectedMonth = 0;

// Get DOM elements
const timeSlider = document.getElementById('timeSlider');
const monthSlider = document.getElementById('monthSlider');
const timeValue = document.getElementById('timeValue');
const monthValue = document.getElementById('monthValue');

// Month names array
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Format time value
function formatTime(value) {
    const hour = parseInt(value);
    return hour <= 12 ? `${hour}:00 AM` : `${hour-12}:00 PM`;
}

// Update display and variables when sliders change
timeSlider.addEventListener('input', function() {
    selectedTime = parseInt(this.value);
    timeValue.textContent = formatTime(selectedTime);
    updateDisplays();
});

monthSlider.addEventListener('input', function() {
    selectedMonth = parseInt(this.value);
    monthValue.textContent = monthNames[selectedMonth];
    updateDisplays();
});

// Function to update map and pattern displays
function updateDisplays() {
    // You can add code here to update the map and pattern
    console.log(`Time: ${selectedTime}, Month: ${selectedMonth}`);
}

// Initialize displays
timeValue.textContent = formatTime(timeSlider.value);
monthValue.textContent = monthNames[monthSlider.value];

