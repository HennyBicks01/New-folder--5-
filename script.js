const editButton = document.getElementById('editButton');
const editForm = document.getElementById('editForm');
const cancelEdit = document.getElementById('cancelEdit');
const weeklyFeaturesForm = document.getElementById('weeklyFeatures');

editButton.addEventListener('click', () => {
    editForm.style.display = 'block';
    populateFormWithCurrentValues();
});

cancelEdit.addEventListener('click', () => {
    editForm.style.display = 'none';
});

// Function to load letter images
function loadLetterImages(letter) {
    const letterImagesDiv = document.getElementById('letter-images');
    letterImagesDiv.innerHTML = '';
    
    // We'll try loading up to 5 images for each letter
    for (let i = 1; i <= 5; i++) {
        const img = document.createElement('img');
        img.src = `file:///${window.location.pathname.split('/').slice(0, -1).join('/')}/Letters/${letter}${i}.png`;
        img.alt = `Letter ${letter} - Image ${i}`;
        img.className = 'letter-image';
        
        // Only append the image if it loads successfully
        img.onload = () => letterImagesDiv.appendChild(img);
        img.onerror = () => img.remove(); // Remove the img element if the file doesn't exist
    }
}

// Function to load shape image
function loadShapeImage(shape) {
    const shapeImageDiv = document.getElementById('shape-image');
    shapeImageDiv.innerHTML = '';
    
    const img = document.createElement('img');
    img.src = `file:///${window.location.pathname.split('/').slice(0, -1).join('/')}/Shapes/${shape}.png`;
    img.alt = `Shape ${shape}`;
    img.className = 'shape-image';
    shapeImageDiv.appendChild(img);
}

// Function to populate shapes dropdown
function populateShapesDropdown() {
    const shapeSelect = document.getElementById('newShape');
    const shapes = ['Circle', 'Square', 'Triangle', 'Rectangle', 'Oval', 'Diamond', 'Star', 'Heart'];
    
    shapes.forEach(shape => {
        const option = document.createElement('option');
        option.value = shape.toLowerCase();
        option.textContent = shape;
        shapeSelect.appendChild(option);
    });
}

// New function to populate the form with current values
function populateFormWithCurrentValues() {
    document.getElementById('newLetter').value = document.getElementById('letter').textContent;
    document.getElementById('newColor').value = document.getElementById('color').textContent;
    document.getElementById('newNumber').value = document.getElementById('number').textContent;
    document.getElementById('newShape').value = document.getElementById('shape').textContent.toLowerCase();
}

// Function to update weekly features
function updateWeeklyFeatures(event) {
    event.preventDefault();
    
    const newLetter = document.getElementById('newLetter').value.toUpperCase();
    const newColor = document.getElementById('newColor').value;
    const newNumber = document.getElementById('newNumber').value;
    const newShape = document.getElementById('newShape').value;
    
    updateDisplay(newLetter, newColor, newNumber, newShape);
    
    editForm.style.display = 'none';

    // Save to localStorage
    saveToLocalStorage(newLetter, newColor, newNumber, newShape);
}

// Update the updateDisplay function to call updateAnimatedBackground
function updateDisplay(letter, color, number, shape) {
    document.getElementById('letter').textContent = letter;
    document.getElementById('color').textContent = color;
    document.getElementById('number').textContent = number;
    document.getElementById('shape').textContent = shape;
    
    document.getElementById('color-box').style.backgroundColor = color;
    
    updateBodyColor(color);
    updateAnimatedBackground(color);
    loadLetterImages(letter);
    loadShapeImage(shape.toLowerCase());
}

// Function to save data to localStorage
function saveToLocalStorage(letter, color, number, shape) {
    const data = {
        letter: letter,
        color: color,
        number: number,
        shape: shape,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('weeklyFeatures', JSON.stringify(data));
}

function updateBodyColor(color) {
    document.body.style.backgroundColor = color;
    updateAnimatedBackground(color);
}

function updateAnimatedBackground(color) {
    const shape = document.getElementById('shape').textContent.toLowerCase();
    let animatedBackground = document.querySelector('.animated-background');
    if (!animatedBackground) {
        animatedBackground = document.createElement('div');
        animatedBackground.className = 'animated-background';
        document.body.appendChild(animatedBackground);
    }
    
    const lighterColor = getLighterColor(color, 0.3);
    const backgroundImage = createShapeBackground(shape, lighterColor);
    animatedBackground.style.backgroundImage = backgroundImage;
}

function getLighterColor(color, factor) {
    // If color is a name (e.g., "red"), convert it to RGB
    if (!/^#|rgb/.test(color)) {
        const tempElement = document.createElement('div');
        tempElement.style.color = color;
        document.body.appendChild(tempElement);
        color = getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);
    }

    // Extract RGB values
    let r, g, b;
    if (color.startsWith('rgb')) {
        [r, g, b] = color.match(/\d+/g).map(Number);
    } else {
        color = color.replace('#', '');
        r = parseInt(color.substr(0, 2), 16);
        g = parseInt(color.substr(2, 2), 16);
        b = parseInt(color.substr(4, 2), 16);
    }

    // Calculate lighter color
    r = Math.min(255, Math.round(r + (255 - r) * factor));
    g = Math.min(255, Math.round(g + (255 - g) * factor));
    b = Math.min(255, Math.round(b + (255 - b) * factor));

    return `rgb(${r}, ${g}, ${b})`;
}

function createShapeBackground(shape, color) {
    const size = 100;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color;
    
    switch (shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/4, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'square':
            ctx.fillRect(size/4, size/4, size/2, size/2);
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(size/2, size/4);
            ctx.lineTo(size/4, 3*size/4);
            ctx.lineTo(3*size/4, 3*size/4);
            ctx.closePath();
            ctx.fill();
            break;
        case 'rectangle':
            ctx.fillRect(size/4, size/3, size/2, size/3);
            break;
        case 'oval':
            ctx.beginPath();
            ctx.ellipse(size/2, size/2, size/4, size/6, 0, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(size/2, size/4);
            ctx.lineTo(3*size/4, size/2);
            ctx.lineTo(size/2, 3*size/4);
            ctx.lineTo(size/4, size/2);
            ctx.closePath();
            ctx.fill();
            break;
        case 'star':
            drawStar(ctx, size/2, size/2, 5, size/4, size/8);
            break;
        case 'heart':
            drawHeart(ctx, size/2, size/2, size/3);
            break;
        default:
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/4, 0, 2 * Math.PI);
            ctx.fill();
    }
    
    return `url(${canvas.toDataURL()})`;
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 3/4, x, y + size);
    ctx.bezierCurveTo(x, y + size * 3/4, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.closePath();
    ctx.fill();
}


function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Load initial images and setup
document.addEventListener('DOMContentLoaded', () => {
    populateShapesDropdown();
    
    weeklyFeaturesForm.addEventListener('submit', updateWeeklyFeatures);

    // Load data from localStorage if available, otherwise use default values
    const savedData = localStorage.getItem('weeklyFeatures');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        updateDisplay(parsedData.letter, parsedData.color, parsedData.number, parsedData.shape);
    } else {
        const defaultLetter = document.getElementById('letter').textContent;
        const defaultColor = document.getElementById('color').textContent;
        const defaultNumber = document.getElementById('number').textContent;
        const defaultShape = document.getElementById('shape').textContent;
        updateDisplay(defaultLetter, defaultColor, defaultNumber, defaultShape);
    }
});