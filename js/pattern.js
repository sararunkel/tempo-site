
const color_dict = {
    'seafoam': '#a0ffb8',
    'royal blue': '#0a62c0',
    'teal': '#6ed4fc',
    'yellow': '#fff837',
    'red': '#ffa646',
    'orange': '#d05134',
    'maroon': '#75001d',}

const date_list = [
    '2024-01-01',
    '2024-02-01',
    '2024-03-01',
    '2024-04-01',
    '2024-05-01',
    '2024-06-01',
    '2024-07-01',
    '2024-08-01',
    '2023-09-01',
    '2023-10-01',
    '2023-11-01',
    '2023-12-01'
]
let filteredColorsDict = {};

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
   // updateLabels();
}

// Function to update the labels
// function updateLabels() {
//     const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const monthLabel = monthArr[monthObj.value - 1];
//     const timeLabel = timeLabels[rangeObj.value - rangeObj.min];
//     if (side === 'left') {
//         document.getElementById('before-label').textContent = `${monthLabel} ${timeLabel}`;
//     } else {
//     document.getElementById('after-label').textContent = `${monthLabel} ${timeLabel}`;}
// }
//new p5(sketch);


document.addEventListener('DOMContentLoaded', function() {
    // Function to parse CSV data
    let knit_color=[];
    let filteredColors = [];
    function parseCSV(csv) {
        const rows = csv.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {});
        });
        return data;
    }
    // Function to create woven pattern

    function filterColors(data, filterValue, dateValue) {
        return data
            .filter(row => 
                (!filterValue || (row.FIPS && row.FIPS.includes(filterValue))) &&
                (!dateValue || (row.date && row.date === dateValue))
            )
            .map(row => row.color);
    }

    function fetchCSVFile(filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(csvData => {
                knit_color = parseCSV(csvData);
                date_list.forEach(date => {
                    filteredColorsDict[date] = filterColors(knit_color, 8035014107, date);
                new p5(sketch);
                
            })
            .catch(error => console.error('Error fetching the CSV file:', error));
    });
}

    // Fetch the CSV file on page load
    fetchCSVFile('../data/monthly/filtered_data_with_colors.csv');
    
});


let sketch = function(p) {
    let knitEllipseSizeY, knitEllipseSizeX, knitEllipseSizeZ;

    function calculateSizes() {
        let container = document.getElementById('knit-pattern-container');
        knitEllipseSizeY = container.offsetWidth / 20;
        knitEllipseSizeX = knitEllipseSizeY/3;
        knitEllipseSizeZ = knitEllipseSizeY/3.3;
    }

    p.setup = function() {
        let container = document.getElementById('knit-pattern-container');
        let canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent('knit-pattern-container');
        calculateSizes();
    }

    // p5.js windowResized function
    p.windowResized = function() {
        let container = document.getElementById('knit-pattern-container');
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        calculateSizes();
    }

    p.draw = function() {
        let startX = knitEllipseSizeY * 2;
        let startY = knitEllipseSizeY * 2;
        Object.keys(filteredColorsDict).forEach(date => {
            const colors = filteredColorsDict[date];
            drawKnitGrid(startX, startY, 2, colors);
                            startX += 2 * knitEllipseSizeY * 1.4; // Move startX to the right for the next set of columns });
        p.noLoop();
    });

    function drawOneKnit(centerX, centerY, stitchColor) {
        p.fill(stitchColor);
        p.noStroke();
        
        p.push();
        p.translate(centerX - knitEllipseSizeZ, centerY);
        p.rotate(p.PI/4);
        p.ellipse(0, 0, knitEllipseSizeX, knitEllipseSizeY);
        p.pop();
        
        p.push();
        p.translate(centerX + knitEllipseSizeZ, centerY);
        p.rotate(-p.PI/4);
        p.ellipse(0, 0, knitEllipseSizeX, knitEllipseSizeY);
        p.pop();
    }

    function drawKnitGrid(startX, startY, cols,knitColors) {
        const STITCH_WIDTH = knitEllipseSizeY*1.4;
        const STITCH_HEIGHT = knitEllipseSizeY*0.8;
        let rows = 8;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let knitColor = color_dict[knitColors[row]];
                let x = startX + (col * STITCH_WIDTH);
                let y = startY + (row * STITCH_HEIGHT);
                drawOneKnit(x, y, knitColor);
            }
        }
    }
}

}