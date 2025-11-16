// Global state
let uploadedImage = null;
let imageSettings = {
    scale: 1,
    positionX: 0,
    positionY: 0,
    rotation: 0,
    brightness: 1.1,
    contrast: 1.1
};

// Constants for US Passport Photo
const DPI = 300; // High resolution for printing
const PASSPORT_SIZE_INCHES = 2; // 2x2 inches
const PASSPORT_SIZE_PX = PASSPORT_SIZE_INCHES * DPI; // 600x600 pixels
const SHEET_WIDTH_INCHES = 4;
const SHEET_HEIGHT_INCHES = 6;
const SHEET_WIDTH_PX = SHEET_WIDTH_INCHES * DPI; // 1200 pixels
const SHEET_HEIGHT_PX = SHEET_HEIGHT_INCHES * DPI; // 1800 pixels
const PHOTOS_PER_ROW = 2;
const PHOTOS_PER_COL = 3;
const JPEG_QUALITY = 0.95; // High quality

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const loadingSection = document.getElementById('loadingSection');
const editorSection = document.getElementById('editorSection');
const resultSection = document.getElementById('resultSection');
const previewCanvas = document.getElementById('previewCanvas');
const resultCanvas = document.getElementById('resultCanvas');
const scaleSlider = document.getElementById('scaleSlider');
const positionXSlider = document.getElementById('positionX');
const positionYSlider = document.getElementById('positionY');
const rotationSlider = document.getElementById('rotation');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const newPhotoBtn = document.getElementById('newPhotoBtn');

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// Control listeners
scaleSlider.addEventListener('input', (e) => {
    imageSettings.scale = parseFloat(e.target.value);
    updatePreview();
});

positionXSlider.addEventListener('input', (e) => {
    imageSettings.positionX = parseInt(e.target.value);
    updatePreview();
});

positionYSlider.addEventListener('input', (e) => {
    imageSettings.positionY = parseInt(e.target.value);
    updatePreview();
});

rotationSlider.addEventListener('input', (e) => {
    imageSettings.rotation = parseFloat(e.target.value);
    updatePreview();
});

brightnessSlider.addEventListener('input', (e) => {
    imageSettings.brightness = parseFloat(e.target.value);
    updatePreview();
});

contrastSlider.addEventListener('input', (e) => {
    imageSettings.contrast = parseFloat(e.target.value);
    updatePreview();
});

resetBtn.addEventListener('click', resetSettings);
generateBtn.addEventListener('click', generatePassportSheet);
downloadBtn.addEventListener('click', downloadImage);
newPhotoBtn.addEventListener('click', resetApp);

// File handling
function handleFileSelect(e) {
    const file = e.target.files[0];
    handleFile(file);
}

async function handleFile(file) {
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
        alert('Please upload an image file (JPEG or PNG)');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    // Show loading screen
    showLoading();

    try {
        // Remove background using AI
        const imageWithoutBg = await removeBackgroundFromImage(file);

        // Load the processed image
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            resetSettings();
            showEditor();
            updatePreview();
        };
        img.src = imageWithoutBg;
    } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try again with a different photo.');
        resetApp();
    }
}

async function removeBackgroundFromImage(file) {
    try {
        // Wait for the library to load
        while (!window.removeBackground) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Remove background using the AI library
        const blob = await window.removeBackground(file, {
            output: {
                format: 'image/png',
                quality: 0.95
            }
        });

        // Create canvas to add white background
        const img = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Fill with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image with transparent background removed
        ctx.drawImage(img, 0, 0);

        // Return as data URL
        return canvas.toDataURL('image/png', 0.95);
    } catch (error) {
        console.error('Background removal error:', error);
        throw error;
    }
}

function showLoading() {
    document.querySelector('.upload-section').style.display = 'none';
    loadingSection.style.display = 'block';
    editorSection.style.display = 'none';
    resultSection.style.display = 'none';
}

function showEditor() {
    document.querySelector('.upload-section').style.display = 'none';
    loadingSection.style.display = 'none';
    editorSection.style.display = 'block';
    resultSection.style.display = 'none';
}

function resetSettings() {
    imageSettings = {
        scale: 1,
        positionX: 0,
        positionY: 0,
        rotation: 0,
        brightness: 1.1,
        contrast: 1.1
    };

    scaleSlider.value = 1;
    positionXSlider.value = 0;
    positionYSlider.value = 0;
    rotationSlider.value = 0;
    brightnessSlider.value = 1.1;
    contrastSlider.value = 1.1;

    if (uploadedImage) {
        updatePreview();
    }
}

function updatePreview() {
    if (!uploadedImage) return;

    const ctx = previewCanvas.getContext('2d');
    const displaySize = 400; // Display size in pixels

    // Set canvas size for display
    previewCanvas.width = displaySize;
    previewCanvas.height = displaySize;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, displaySize, displaySize);

    // Save context state
    ctx.save();

    // Move to center for rotation
    ctx.translate(displaySize / 2, displaySize / 2);
    ctx.rotate((imageSettings.rotation * Math.PI) / 180);

    // Apply brightness and contrast filters
    ctx.filter = `brightness(${imageSettings.brightness}) contrast(${imageSettings.contrast})`;

    // Calculate scaled dimensions
    const scale = imageSettings.scale;
    let drawWidth = uploadedImage.width * scale;
    let drawHeight = uploadedImage.height * scale;

    // Scale to fit the canvas while maintaining aspect ratio
    const scaleFactor = Math.min(displaySize / uploadedImage.width, displaySize / uploadedImage.height);
    drawWidth = uploadedImage.width * scaleFactor * scale;
    drawHeight = uploadedImage.height * scaleFactor * scale;

    // Apply position offset
    const offsetX = imageSettings.positionX;
    const offsetY = imageSettings.positionY;

    // Draw the image
    ctx.drawImage(
        uploadedImage,
        -drawWidth / 2 + offsetX,
        -drawHeight / 2 + offsetY,
        drawWidth,
        drawHeight
    );

    // Restore context state
    ctx.restore();
}

function generatePassportSheet() {
    if (!uploadedImage) return;

    const ctx = resultCanvas.getContext('2d');

    // Set canvas to actual print size (4x6 inches at 300 DPI)
    resultCanvas.width = SHEET_WIDTH_PX;
    resultCanvas.height = SHEET_HEIGHT_PX;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, SHEET_WIDTH_PX, SHEET_HEIGHT_PX);

    // Create a temporary canvas for a single passport photo
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = PASSPORT_SIZE_PX;
    tempCanvas.height = PASSPORT_SIZE_PX;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw the passport photo on temp canvas
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, PASSPORT_SIZE_PX, PASSPORT_SIZE_PX);

    // Save context state
    tempCtx.save();

    // Move to center for rotation
    tempCtx.translate(PASSPORT_SIZE_PX / 2, PASSPORT_SIZE_PX / 2);
    tempCtx.rotate((imageSettings.rotation * Math.PI) / 180);

    // Apply brightness and contrast filters for professional look
    tempCtx.filter = `brightness(${imageSettings.brightness}) contrast(${imageSettings.contrast})`;

    // Calculate scaled dimensions for high-res output
    const scale = imageSettings.scale;
    let drawWidth = uploadedImage.width * scale;
    let drawHeight = uploadedImage.height * scale;

    // Scale to fit the passport size while maintaining aspect ratio
    const scaleFactor = Math.min(PASSPORT_SIZE_PX / uploadedImage.width, PASSPORT_SIZE_PX / uploadedImage.height);
    drawWidth = uploadedImage.width * scaleFactor * scale;
    drawHeight = uploadedImage.height * scaleFactor * scale;

    // Apply position offset (scaled up for high-res)
    const offsetX = imageSettings.positionX * (PASSPORT_SIZE_PX / 400);
    const offsetY = imageSettings.positionY * (PASSPORT_SIZE_PX / 400);

    // Draw the image
    tempCtx.drawImage(
        uploadedImage,
        -drawWidth / 2 + offsetX,
        -drawHeight / 2 + offsetY,
        drawWidth,
        drawHeight
    );

    // Restore context state
    tempCtx.restore();

    // Now replicate this photo 6 times on the 4x6 sheet
    // 2 columns x 3 rows
    for (let row = 0; row < PHOTOS_PER_COL; row++) {
        for (let col = 0; col < PHOTOS_PER_ROW; col++) {
            const x = col * PASSPORT_SIZE_PX;
            const y = row * PASSPORT_SIZE_PX;
            ctx.drawImage(tempCanvas, x, y);
        }
    }

    // Show result section
    editorSection.style.display = 'none';
    resultSection.style.display = 'block';
}

function downloadImage() {
    // Convert canvas to high-quality JPEG
    resultCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `passport-photos-4x6-${timestamp}.jpg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/jpeg', JPEG_QUALITY);
}

function resetApp() {
    uploadedImage = null;
    imageSettings = {
        scale: 1,
        positionX: 0,
        positionY: 0,
        rotation: 0,
        brightness: 1.1,
        contrast: 1.1
    };

    fileInput.value = '';
    document.querySelector('.upload-section').style.display = 'grid';
    loadingSection.style.display = 'none';
    editorSection.style.display = 'none';
    resultSection.style.display = 'none';
}
