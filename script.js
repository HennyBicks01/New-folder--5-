const editButton = document.getElementById('editButton');
const editForm = document.getElementById('editForm');
const cancelEdit = document.getElementById('cancelEdit');
const weeklyFeaturesForm = document.getElementById('weeklyFeatures');

editButton.addEventListener('click', () => {
    editForm.style.display = 'block';
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

// Function to update the display
function updateDisplay(letter, color, number, shape) {
    document.getElementById('letter').textContent = letter;
    document.getElementById('color').textContent = color;
    document.getElementById('number').textContent = number;
    document.getElementById('shape').textContent = shape;
    
    document.getElementById('color-box').style.backgroundColor = color;
    
    updateBodyColor(color);
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