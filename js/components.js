// Initialize Slider component

//dictionary with the slider values
var SliderValues = {
'01': [8, 9, 10, 11, 12, 13, 14, 15],
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

//  // Initialize Slider for the month
// var monthObj = new ej.inputs.Slider({
//     ticks: { placement: 'After', largeStep: 1, smallStep: 1, showSmallTicks: true, showTicks:true },
//     tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' },
//     // Minimum value
//     min: 1,
//     // Maximum value
//     max: 12,
//     // Slider current value
//     value: 1,
//     renderingTicks: function (args) {
//         // Month Array
//         var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         // Ensure args.value is valid
//         if (args.value !== undefined && args.value >= 1 && args.value <= 12) {
//             args.text = monthArr[args.value - 1];
//         } else {
//             args.text = '';
//         }
//     },
//     change: updateTimeSlider
// });
// monthObj.appendTo('#month-slider');

class SliderComponent {
    constructor(update) {
        this.SliderValues = {
            '01': [8, 9, 10, 11, 12, 13, 14, 15],
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
            '12': [8, 9, 10, 11, 12, 13, 14, 15]
        };
        this.timeLabels = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'];
        this.initMonthSlider();
        this.initTimeSlider();
    }

    initMonthSlider() {
        this.monthObj = new ej.inputs.Slider({
            ticks: { placement: 'After', largeStep: 1, smallStep: 1, showSmallTicks: true, showTicks: true },
            tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' },
            min: 1,
            max: 12,
            value: 1,
            renderingTicks: (args) => {
                const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if (args.value !== undefined && args.value >= 1 && args.value <= 12) {
                    args.text = monthArr[args.value - 1];
                } else {
                    args.text = '';
                }
            },
            change: (args) => this.updateTimeSlider(args)
        });
        this.monthObj.appendTo('#month-slider');
    }

    initTimeSlider() {
        this.rangeObj = new ej.inputs.Slider({
            ticks: { placement: 'After', largeStep: 2, smallStep: 1, showSmallTicks: true },
            tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' },
            min: 8,
            max: 15,
            value: 8,
            renderingTicks: (args) => {
                if (args.value !== undefined && args.value >= this.rangeObj.min && args.value <= this.rangeObj.max) {
                    args.text = this.timeLabels[args.value - this.rangeObj.min];
                } else {
                    args.text = '';
                }
            },
            change: updateData
        });
        this.rangeObj.appendTo('#time-slider');
    }

    updateTimeSlider(args) {
        const month = args.value.toString().padStart(2, '0');
        const timeValues = this.SliderValues[month];
        this.timeLabels = timeValues.map(value => (value === 12 ? 12 : value % 12) + (value < 12 ? ' AM' : ' PM'));
        this.rangeObj.min = Math.min(...timeValues);
        this.rangeObj.max = Math.max(...timeValues);
        this.rangeObj.value = this.rangeObj.min;
        this.rangeObj.dataBind();
        updateData();}

}

// document.addEventListener('DOMContentLoaded', () => {
//     new SliderComponent();
// });
// // Render initialized Slider
// rangeObj.appendTo('#time-slider');

// // Function to update the time slider based on the selected month
// function updateTimeSlider(args) {
//     var month = args.value.toString().padStart(2, '0');
//     var timeValues = SliderValues[month];
//     // Create a string array of time values in AM/PM format
//     timeLabels = timeValues.map(function(value) {
//         return (value === 12 ? 12 : value % 12) + (value < 12 ? ' AM' : ' PM');
//     });
//     rangeObj.min = Math.min(...timeValues);
//     rangeObj.max = Math.max(...timeValues);
//     rangeObj.value = rangeObj.min;
//     rangeObj.dataBind();
//     updateData()
// }
