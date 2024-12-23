const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const images = [];
const CAKE_IMAGE_URL = 'https://file.aiquickdraw.com/imgcompressed/img/compressed_13d54b128bc3d7788724e802bf721546.webp';

// load and draw the cake image
const cakeImage = new Image();
cakeImage.crossOrigin = "Anonymous";
cakeImage.src = CAKE_IMAGE_URL;

cakeImage.onload = function() {
    drawCake();
};

function drawCake() {
    const cakeY = canvas.height * 0.75;
    ctx.drawImage(cakeImage, canvas.width/2 - 150, cakeY - 150, 300, 300);
}

// handle drag and drop events
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = '#e1e1e1';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.background = '#f0f0f0';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
});

function handleFiles(files) {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            addImageToCanvas(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function getRandomPointOnCake() {
    const cakeX = canvas.width/2;
    const cakeY = canvas.height * 0.75 - 75;
    
    // generate random angle and radius for more natural distribution
    const angle = Math.random() * Math.PI;
    const radius = Math.random() * 100; // adjust this value to control spread
    
    return {
        x: cakeX + radius * Math.cos(angle),
        y: cakeY + radius * Math.sin(angle)
    };
}

function addImageToCanvas(imgSrc) {
    const img = new Image();
    img.onload = function() {
        const imgSize = 100;
        
        // generate random position with wider horizontal spread
        const x = Math.random() * (canvas.width - imgSize * 0.5);
        const y = Math.random() * (canvas.height * 0.4) + 50; // Keep images in upper portion
        
        const endPoint = getRandomPointOnCake();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCake();
        
        // draw all images in reverse order to handle overlapping
        [...images].reverse().forEach(prevImg => {
            ctx.drawImage(prevImg.img, prevImg.x, prevImg.y, imgSize, imgSize);
            drawLine(
                prevImg.x + imgSize/2,
                prevImg.y + imgSize,
                prevImg.endPoint.x,
                prevImg.endPoint.y
            );
        });
        
        // draw new image and its line
        ctx.drawImage(img, x, y, imgSize, imgSize);
        drawLine(
            x + imgSize/2,
            y + imgSize,
            endPoint.x,
            endPoint.y
        );
        
        images.push({img, x, y, endPoint});
    };
    img.src = imgSrc;
}

function drawLine(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// initialize canvas
drawCake();
