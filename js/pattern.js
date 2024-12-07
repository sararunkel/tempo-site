
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

const filteredColorsDict = {};
let knitColor = [];
const container = document.getElementById('knit-pattern-container');

function calculateSizes() {
    const totalColumns = 28; //24 columns with 2 stitches for margin on each side
    const availableWidth = container.offsetWidth

    const knitEllipseSizeY = (availableWidth / totalColumns)/1.4;
    const knitEllipseSizeX = knitEllipseSizeY / 3;
    const knitEllipseSizeZ = knitEllipseSizeY / 3.3;
    const canvasWidth = 24 * knitEllipseSizeY * 1.4;
    return { knitEllipseSizeX, knitEllipseSizeY, knitEllipseSizeZ,canvasWidth};
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
            const y = startY + row * STITCH_HEIGHT;

            drawOneKnit(ctx, x, y, sizes, stitchColor);
        }
    }
}

function fetchCSVFile(filePath) {
    return fetch(filePath)
        .then(response => response.text())
        .then(csvData => {
            knitColor = parseCSV(csvData);
            dateList.forEach(date => {
                filteredColorsDict[date] = filterColors(knitColor, 8035014107, date);
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
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
    const sizes = calculateSizes();
    const canvas = document.createElement('canvas');
    canvas.width = sizes.canvasWidth
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);

    currentCanvas = canvas; // Track the current canvas
    currentCtx = canvas.getContext('2d'); // Track the current context
    return currentCtx;
}

function drawPattern() {
    const ctx = setupCanvas();
    const sizes = calculateSizes();
    const rows = 8;
    const cols = 24;
    const STITCH_WIDTH = sizes.knitEllipseSizeY * 1.4;
    const STITCH_HEIGHT = sizes.knitEllipseSizeY * 0.8;
    // Calculate total pattern dimensions
    const totalPatternWidth = cols * STITCH_WIDTH;
    let startX =  STITCH_WIDTH/2;
    const startY = sizes.knitEllipseSizeY * 2;
    // Calculate margins


    Object.keys(filteredColorsDict).forEach(date => {
        const colors = filteredColorsDict[date];
        drawKnitGrid(ctx,startX, startY, 2, sizes,colors);
        startX += 2 * STITCH_WIDTH; // Move startX to the right for the next set of columns });
        });
}



function resizeContainer() {
    const totalColumns = 24;
    const stitchWidth = 20; // Fixed stitch width
    const stitchHeight = stitchWidth * 0.8; // Maintain aspect ratio
    const totalRows = 8; // Number of rows

    const totalMargin = 40; // Total margin (20px on each side)
    const requiredWidth = totalColumns * stitchWidth + totalMargin;
    const requiredHeight = totalRows * stitchHeight + totalMargin;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Fit within screen dimensions
    const finalWidth = Math.min(screenWidth, requiredWidth);
    const finalHeight = Math.min(screenHeight, requiredHeight);

    container.style.width = `${finalWidth}px`;
    container.style.height = `${finalHeight}px`;
    container.style.margin = '0 auto'; // Center horizontally
}
window.addEventListener('resize', () => {
    //resizeContainer();
    //setupCanvas();
    drawPattern(); // Redraw the pattern after resizing
});
//Draw the pattern initially
drawPattern();
// Call it initially to set the correct size
//resizeContainer();

// Fetch the CSV file on page load
fetchCSVFile('../data/monthly/filtered_data_with_colors.csv').then(() => {
    drawPattern(); // Draw the pattern after fetching the CSV file
});
