
const colorDict = {
    'seafoam': '#a0ffb8',
    'royal blue': '#0a62c0',
    'teal': '#6ed4fc',
    'yellow': '#fff837',
    'red': '#ffa646',
    'orange': '#d05134',
    'maroon': '#75001d',
};

const dateList = [
    '2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01',
    '2024-05-01', '2024-06-01', '2024-07-01', '2024-08-01',
    '2023-09-01', '2023-10-01', '2023-11-01', '2023-12-01',
];

let selectedDate = '01';  // To store the selected date
let selectedTime = 8;  
const hourStitch=1;
const rows_color=8;
let clickedStitch = null; // To track the clicked stitch

const filteredColorsDict = {};
let knitColor = [];
const container = document.getElementById('knit-pattern-container');

function calculateSizes() {
    const totalColumns = hourStitch * 12; // 12 columns for 12 months
    const totalRows = rows_color; // 8 rows for 8 hours
    
    const availableHeight = container.offsetHeight;
    const labelPaddingX = container.offsetHeight * 0.1; // Space for month labels
    const labelPaddingY = container.offsetWidth * 0.05; // Space for hour labels
    const availableWidth = container.offsetWidth-2*labelPaddingX; // Space for hour labels
    // Calculate the size of each stitch
    const knitEllipseSizeY = (availableWidth / totalColumns) / 1.4;
    const knitEllipseSizeX = knitEllipseSizeY / 3;
    const knitEllipseSizeZ = knitEllipseSizeY / 3.3;
    const STITCH_HEIGHT = knitEllipseSizeY * 0.8;

    // Calculate the canvas dimensions including space for labels
    
    const canvasWidth = totalColumns * knitEllipseSizeY * 1.4 + labelPaddingX;
    const canvasHeight = totalRows * STITCH_HEIGHT + labelPaddingY;

    return { knitEllipseSizeX, knitEllipseSizeY, knitEllipseSizeZ, canvasWidth, canvasHeight, labelPaddingX, labelPaddingY };
}

function drawOneKnit(ctx, centerX, centerY, sizes, stitchColor) {
    const { knitEllipseSizeX, knitEllipseSizeY, knitEllipseSizeZ } = sizes;

    ctx.fillStyle = stitchColor;

    // Draw left tilted ellipse
    ctx.beginPath();
    ctx.ellipse(
        centerX - knitEllipseSizeZ,
        centerY,
        knitEllipseSizeX / 2,
        knitEllipseSizeY / 2,
        Math.PI / 4,
        0,
        2 * Math.PI
    );
    ctx.fill();

    // Draw right tilted ellipse
    ctx.beginPath();
    ctx.ellipse(
        centerX + knitEllipseSizeZ,
        centerY,
        knitEllipseSizeX / 2,
        knitEllipseSizeY / 2,
        -Math.PI / 4,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

function drawKnitGrid(ctx, startX, startY, cols, sizes, knitColors) {
    const { knitEllipseSizeY } = sizes;
    const STITCH_WIDTH = knitEllipseSizeY * 1.4;
    const STITCH_HEIGHT = knitEllipseSizeY * 0.8;
    const rows = knitColors.length;


    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const colorKey = knitColors[row % knitColors.length]; // Cycle through colors
            const stitchColor = colorDict[colorKey];
            const x = startX + col * STITCH_WIDTH;
            const y = startY+ row * STITCH_HEIGHT;
            drawOneKnit(ctx, x, y, sizes, stitchColor);}
    }
}

function fetchCSVFile(filePath) {
    return fetch(filePath)
        .then(response => response.text())
        .then(csvData => {
            knitColor = parseCSV(csvData);
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}

function updateFilteredColorsDict(newFIPS) {
    dateList.forEach(date => {
        filteredColorsDict[date] = filterColors(knitColor, newFIPS, date);
    });
    drawPattern();
}

function filterColors(data, filterValue, dateValue) {
    return data
        .filter(row =>
            (!filterValue || (row.FIPS && row.FIPS.includes(filterValue))) &&
            (!dateValue || (row.date && row.date === dateValue))
        )
        .map(row => row.color);
}

function parseCSV(csv) {
    const rows = csv.split('\n');
    const headers = rows[0].split(',');
    return rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}

let currentCanvas = null; // To track the canvas for resizing
let currentCtx = null;    // To track the drawing context

function setupCanvas() {
    if (currentCanvas) {
        // Clear existing canvas if resizing
        container.removeChild(currentCanvas);
    }
    const scaleFactor = window.devicePixelRatio;
    const sizes = calculateSizes();
    const canvas = document.createElement('canvas');
    canvas.width = sizes.canvasWidth;
    canvas.height = sizes.canvasHeight;
    container.appendChild(canvas);

    currentCanvas = canvas; // Track the current canvas
    currentCtx = canvas.getContext('2d'); // Track the current context
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);

    return currentCtx;
}
function handleCanvasClick(event) {
    const sizes = calculateSizes();
    const { knitEllipseSizeY, labelPaddingX, labelPaddingY } = sizes;
    const STITCH_WIDTH = knitEllipseSizeY * 1.4;
    const STITCH_HEIGHT = knitEllipseSizeY * 0.8;
    const fontSize = container.offsetWidth * 0.02; // 2% of the container's width
    const startX = labelPaddingX + fontSize;
    const startY = labelPaddingY + fontSize;

    const rect = currentCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log('x:', x, 'y:', y);

    const column = Math.floor((x - startX) / STITCH_WIDTH);
    const row = Math.floor((y - startY) / STITCH_HEIGHT);

    if (column >= 0 && column < 12 && row >= 0 && row < 8) {
        const months = [1,2,3,4,5,6,7,8,9,10,11,12];
        const hours = [8, 9, 10, 11, 12, 13, 14, 15];

        const selectedMonth = months[column];
        const selectedHour = hours[row];
        selectedDate = selectedMonth;
        selectedTime = selectedHour;

        // document.getElementById('date-value').textContent = selectedMonth;
        // document.getElementById('time-value').textContent = selectedHour;
        // Send the selectedMonth and selectedHour to the iframe
        const iframe = document.getElementById('display-8031980200'); 
        if (iframe){// Replace with your iframe's ID
        iframe.contentWindow.postMessage({ selectedMonth, selectedHour }, '*');}
        else{
            const iframe = document.getElementById('display-8013012206'); 
            iframe.contentWindow.postMessage({ selectedMonth, selectedHour }, '*');
        }
        // Track the clicked stitch
        clickedStitch = { column, row };

        // Redraw the pattern to show the outline
        drawPattern();
    }
}

function handleCanvasMouseMove(event) {
    const sizes = calculateSizes();
    const { knitEllipseSizeY, labelPaddingX, labelPaddingY } = sizes;
    const STITCH_WIDTH = knitEllipseSizeY * 1.4;
    const STITCH_HEIGHT = knitEllipseSizeY * 0.8;
    const fontSize = container.offsetWidth * 0.02; // 2% of the container's width
    const startX = labelPaddingX + fontSize;
    const startY = labelPaddingY + fontSize;

    const rect = currentCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const column = Math.floor((x - startX) / STITCH_WIDTH);
    const row = Math.floor((y - startY) / STITCH_HEIGHT);

    if (column >= 0 && column < 12 && row >= 0 && row < 8) {
        currentCanvas.style.cursor = 'pointer';
    } else {
        currentCanvas.style.cursor = 'default';
    }
}

function drawPattern() {
    const ctx = setupCanvas();
    const sizes = calculateSizes();
    const { knitEllipseSizeY, canvasWidth, canvasHeight, labelPaddingX, labelPaddingY } = sizes;
    const STITCH_WIDTH = knitEllipseSizeY * 1.4;
    const STITCH_HEIGHT = knitEllipseSizeY*0.8;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const hours = ["8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm"];
    const fontSize = container.offsetWidth * 0.02; // 2% of the container's width
    // Calculate total pattern dimensions
    let startX = labelPaddingX + STITCH_WIDTH / 2+fontSize;
    const startY = labelPaddingY + STITCH_HEIGHT / 2+fontSize;
    
    // Draw month labels
    
    ctx.font = `${fontSize}px Inter`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    months.forEach((month, index) => {
        ctx.fillText(month, startX + index * STITCH_WIDTH, labelPaddingY); // Position the label above the grid
    });

    // Draw hour labels
    ctx.textAlign = "right";
    hours.forEach((hour, index) => {
        ctx.fillText(hour, labelPaddingX+fontSize, startY + index * STITCH_HEIGHT); // Position the label to the left of the grid
    });
    if (clickedStitch) {
        const outlineX = startX + clickedStitch.column * STITCH_WIDTH;
        const outlineY = startY + clickedStitch.row * STITCH_HEIGHT;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(outlineX - STITCH_WIDTH / 2, outlineY - STITCH_HEIGHT / 2, STITCH_WIDTH, STITCH_HEIGHT);
    }

    // Draw the knit grid
    Object.keys(filteredColorsDict).forEach(date => {
        const colors = filteredColorsDict[date];
        drawKnitGrid(ctx, startX, startY, hourStitch, sizes, colors);
        startX += hourStitch * STITCH_WIDTH; // Move startX to the right for the next set of columns
    });
    // Draw the outline for the clicked stitch
}
window.addEventListener('resize', () => {
    //resizeContainer();
    //setupCanvas();
    drawPattern(); // Redraw the pattern after resizing
});
//Draw the pattern initially
// Call it initially to set the correct size
//resizeContainer();

let debounceTimeout;
function debounceDrawPattern(newFIPS, delay) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        updateFilteredColorsDict(newFIPS);
        drawPattern();
    }, delay);
}

window.addEventListener('message', (event) => {
    if (event.data && event.data.FIPS) {

        // Get the div element where you want to update the data-value attribute
        const newFIPS = event.data.FIPS
        debounceDrawPattern(newFIPS, 0);
        drawPattern();
        const tractLabel = document.getElementById('label-knit');
        if (tractLabel) {
            tractLabel.textContent = event.data.TRACT;
        }
        console.log(event.data.TRACT)
        }
});

document.addEventListener('DOMContentLoaded', function() {
    // Get the URL parameters from the main page, including the hash
    const urlParams = new URLSearchParams(window.parent.location.search + window.parent.location.hash); 
    const fips = urlParams.get('FIPS');
    fetchCSVFile('../data/monthly/filtered_data_with_colors.csv').then(() => {
        //get data-value from infoDiv
    if (fips === '8031980200#t2'||fips === 8031980200) {
        document.getElementById('section-8031980200').style.display = 'block';
        document.getElementById('section-8013012206').style.display = 'none';
        const newFIPS = 8031980200;
        updateFilteredColorsDict(newFIPS);
        drawPattern();
    } else if (fips === '8013012206#t2'|| fips === 8013012206) {
        document.getElementById('section-8031980200').style.display = 'none';
        document.getElementById('section-8013012206').style.display = 'block';
        document.getElementById('label-knit').textContent='Census Tract 122.06; Boulder County; Colorado'
        const newFIPS = 8013012206;
        updateFilteredColorsDict(newFIPS);
        drawPattern();
        
        
    } else {
        // Default behavior if no FIPS parameter is provided
        document.getElementById('section-8031980200').style.display = 'block';
        document.getElementById('section-8013012206').style.display = 'none';
        const newFIPS = 8031980200;
        updateFilteredColorsDict(newFIPS);
        drawPattern();
        console.log(newFIPS)
    }
});
});