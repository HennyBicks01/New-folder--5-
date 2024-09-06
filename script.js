const editButton = document.getElementById('editButton');
const editForm = document.getElementById('editForm');
const cancelEdit = document.getElementById('cancelEdit');
const weeklyFeaturesForm = document.getElementById('weeklyFeatures');


// Add this function near the top of your script, after the initial variable declarations
function populateFormWithCurrentValues() {
    const currentLetter = document.getElementById('letter').textContent;
    const currentColor = document.getElementById('color-word').textContent;
    const currentNumber = document.getElementById('number-word').textContent;
    const currentShape = document.getElementById('shape').textContent;

    document.getElementById('newLetter').value = currentLetter;
    document.getElementById('newColor').value = currentColor;
    document.getElementById('newNumber').value = currentNumber;
    document.getElementById('newShape').value = currentShape.toLowerCase();
}

// Update the edit button click event listener
editButton.addEventListener('click', () => {
    editForm.style.display = 'block';
    populateFormWithCurrentValues();
});

cancelEdit.addEventListener('click', () => {
    editForm.style.display = 'none';
});

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
    
    const lighterColor = getLighterColor(color, 0.2);
    const backgroundImage = createShapeBackground(shape, lighterColor);
    animatedBackground.style.backgroundImage = backgroundImage;
}

function isColorLight(color) {
    const rgb = getRGBValues(color);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128;
}

function getRGBValues(color) {
    if (color.startsWith('rgb')) {
        return {
            r: parseInt(color.match(/\d+/g)[0]),
            g: parseInt(color.match(/\d+/g)[1]),
            b: parseInt(color.match(/\d+/g)[2])
        };
    } else if (color.startsWith('#')) {
        return {
            r: parseInt(color.slice(1, 3), 16),
            g: parseInt(color.slice(3, 5), 16),
            b: parseInt(color.slice(5, 7), 16)
        };
    } else {
        const tempElement = document.createElement('div');
        tempElement.style.color = color;
        document.body.appendChild(tempElement);
        const rgbColor = getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);
        return getRGBValues(rgbColor);
    }
}

function getContrastColor(color) {
    return isColorLight(color) ? getDarkerColor(color, 0.6) : getLighterColor(color, 0.6);
}

function getDarkerColor(color, factor) {
    const rgb = getRGBValues(color);
    return `rgb(${Math.max(0, Math.round(rgb.r * (1 - factor)))}, ${Math.max(0, Math.round(rgb.g * (1 - factor)))}, ${Math.max(0, Math.round(rgb.b * (1 - factor)))})`;
}

// Update the updateDisplay function
function updateDisplay(letter, color, number, shape) {
    document.getElementById('letter').textContent = letter;
    const colorWord = document.getElementById('color-word');
    colorWord.textContent = color;
    colorWord.style.color = color;
    
    const contrastColor = getContrastColor(color);
    
    // Update text colors
    document.body.style.color = contrastColor;
    document.querySelector('h1').style.color = contrastColor;
    document.querySelectorAll('.feature h2').forEach(h2 => h2.style.color = contrastColor);
    
    // Update number display
    const numberWord = document.getElementById('number-word');
    numberWord.textContent = number;
    numberWord.style.color = color;
    
    document.getElementById('shape').textContent = shape;
    document.querySelector('.sidebar').style.backgroundColor = color;
    document.querySelector('.sidebar').style.color = contrastColor;
    document.querySelector('.edit-activities-button').style.color = contrastColor;
    document.querySelector('.edit-button').style.color = contrastColor;
    
    updateBodyColor(color);
    updateAnimatedBackground(color);
    loadLetterImages(letter);
    loadShapeImage(shape.toLowerCase());
    updateColorWordShadow(color);

    const letterFeature = document.getElementById('letter-feature');
    const featuresGrid = document.querySelector('.features-grid');
    letterFeature.classList.remove('expanded');
    featuresGrid.classList.remove('letter-expanded');
    stopAudio();
}
// Update the updateColorWordShadow function
function updateColorWordShadow(color) {
    const shadowColor = isColorLight(color) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)';
    const style = `
        -1px -1px 0 ${shadowColor},
        1px -1px 0 ${shadowColor},
        -1px 1px 0 ${shadowColor},
        1px 1px 0 ${shadowColor},
        2px 2px 4px ${shadowColor}
    `;

    const colorWord = document.getElementById('color-word');
    const numberWord = document.getElementById('number-word');

    colorWord.style.textShadow = style;
    numberWord.style.textShadow = style;
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

function expandLetterFeature() {
    const letterFeature = document.getElementById('letter-feature');
    const featuresGrid = document.querySelector('.features-grid');
    const letter = document.getElementById('letter').textContent;
    const letterImages = document.getElementById('letter-images');

    if (letterFeature.classList.contains('expanded')) {
        // If already expanded, revert to original state
        letterFeature.classList.remove('expanded');
        featuresGrid.classList.remove('letter-expanded');
        stopAudio();
        loadLetterImages(letter); // Reload all letter images
    } else {
        // Expand and play audio
        letterFeature.classList.add('expanded');
        featuresGrid.classList.add('letter-expanded');
        playLetterAudio(letter);
        
        // Display all images at a larger size
        const images = letterImages.querySelectorAll('img');
        if (images.length > 0) {
            letterImages.innerHTML = '';
            images.forEach(img => {
                const largeImage = img.cloneNode(true);
                largeImage.style.maxHeight = '65vh';
                largeImage.style.width = 'auto';
                largeImage.style.margin = '10px'; // Add some margin between images
                letterImages.appendChild(largeImage);
            });
        }
    }
}

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

function playLetterAudio(letter) {
    stopAudio(); // Stop any currently playing audio
    const audio = new Audio(`file:///${window.location.pathname.split('/').slice(0, -1).join('/')}/Letter Music/${letter}.mp3`);
    audio.id = 'letterAudio';
    document.body.appendChild(audio);
    audio.play();
}

function stopAudio() {
    const audio = document.getElementById('letterAudio');
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.remove();
    }
}

// Activities management
const activitiesList = document.getElementById('activities');
const newActivityInput = document.getElementById('newActivity');
const addActivityButton = document.getElementById('addActivity');
const editActivitiesButton = document.getElementById('editActivities');
const activityControls = document.querySelector('.activity-controls');
let isEditingActivities = false;

// Update the toggleEditActivities function
function toggleEditActivities() {
    isEditingActivities = !isEditingActivities;
    activityControls.style.display = isEditingActivities ? 'flex' : 'none';
    activitiesList.classList.toggle('editing', isEditingActivities);
    
    if (isEditingActivities) {
        editActivitiesButton.innerHTML = '<i class="fas fa-check"></i>';
        activitiesList.querySelectorAll('.activity-item').forEach(item => {
            item.style.cursor = 'pointer';
            item.style.color = contrastColor;
        });
    } else {
        editActivitiesButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        activitiesList.querySelectorAll('.activity-item').forEach(item => {
            item.style.cursor = 'move';
            item.style.color = contrastColor;
        });
    }
}

let activities = [
    'Letter tracing',
    'Color mixing',
    'Counting games',
    'Shape drawing'
];


function renderActivities() {
    activitiesList.innerHTML = '';
    activities.forEach((activity, index) => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.draggable = true;
        li.textContent = activity;
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragover', dragOver);
        li.addEventListener('drop', drop);
        li.addEventListener('dragenter', dragEnter);
        li.addEventListener('dragleave', dragLeave);
        activitiesList.appendChild(li);
    });
}



function addActivity() {
    const newActivity = newActivityInput.value.trim();
    if (newActivity) {
        activities.push(newActivity);
        newActivityInput.value = '';
        renderActivities();
        saveActivities();
    }
}

// Add this event listener for the Add button
addActivityButton.addEventListener('click', addActivity);

function deleteActivity(index) {
    activities.splice(index, 1);
    renderActivities();
    saveActivities();
}

function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

function loadActivities() {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
        activities = JSON.parse(savedActivities);
    }
    renderActivities();
}

let draggedItem = null;

function dragStart() {
    draggedItem = this;
    setTimeout(() => this.classList.add('dragging'), 0);
}

function dragOver(e) {
    e.preventDefault();
}

function drop() {
    this.classList.remove('over');
    const fromIndex = Array.from(activitiesList.children).indexOf(draggedItem);
    const toIndex = Array.from(activitiesList.children).indexOf(this);
    if (fromIndex !== toIndex) {
        const item = activities[fromIndex];
        activities.splice(fromIndex, 1);
        activities.splice(toIndex, 0, item);
        renderActivities();
        saveActivities();
    }
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('over');
}

function dragLeave() {
    this.classList.remove('over');
}

// Add this event listener
editActivitiesButton.addEventListener('click', toggleEditActivities);

// Update the existing event listener for deleting activities
activitiesList.addEventListener('click', (e) => {
    if (isEditingActivities && e.target.classList.contains('activity-item')) {
        const index = Array.from(activitiesList.children).indexOf(e.target);
        deleteActivity(index);
    }
});


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
    const letterFeature = document.getElementById('letter-feature');
    letterFeature.addEventListener('click', expandLetterFeature);

    // Add click event listener to the letter image to stop audio and collapse
    document.getElementById('letter-images').addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG' && letterFeature.classList.contains('expanded')) {
            expandLetterFeature();
        }
    });

    loadActivities();
    renderActivities();

    // Add these lines to ensure all buttons are properly initialized
    editActivitiesButton.addEventListener('click', toggleEditActivities);
    addActivityButton.addEventListener('click', addActivity);

    // Optional: Add enter key support for adding activities
    newActivityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addActivity();
        }
    });
});
