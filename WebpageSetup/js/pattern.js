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

    p.windowResized = function() {
        let container = document.getElementById('knit-pattern-container');
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        calculateSizes();
    }

    p.draw = function() {
       // p.background(220);
        drawKnitGrid(knitEllipseSizeY*2, knitEllipseSizeY*2, 8, 12);
    }

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

    function drawKnitGrid(startX, startY, rows, cols) {
        const STITCH_WIDTH = knitEllipseSizeY*1.4;
        const STITCH_HEIGHT = knitEllipseSizeY*0.8;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let knitColor = p.color(225, row*35, 0);
                let x = startX + (col * STITCH_WIDTH);
                let y = startY + (row * STITCH_HEIGHT);
                drawOneKnit(x, y, knitColor);
            }
        }
    }
}

new p5(sketch);