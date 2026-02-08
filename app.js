// ─── Constants ───────────────────────────────────────────────────────────────
const DPI          = 300;
const PASSPORT_PX  = 2 * DPI;   // 600 × 600  (2 × 2 in)
const SHEET_W_PX   = 4 * DPI;   // 1200 px    (4 in)
const SHEET_H_PX   = 6 * DPI;   // 1800 px    (6 in)
const COLS         = 2;
const ROWS         = 3;
const JPEG_QUALITY = 0.95;
const PREVIEW_SIZE = 400;

const BG_LIB_URL = 'https://esm.sh/@imgly/background-removal@1.4.5';

// ─── State ───────────────────────────────────────────────────────────────────
let uploadedImage = null;
let settings = { scale: 1, x: 0, y: 0, rotation: 0 };

// ─── DOM refs ────────────────────────────────────────────────────────────────
const uploadArea     = document.getElementById('uploadArea');
const fileInput      = document.getElementById('fileInput');
const loadingSection = document.getElementById('loadingSection');
const editorSection  = document.getElementById('editorSection');
const resultSection  = document.getElementById('resultSection');
const previewCanvas  = document.getElementById('previewCanvas');
const resultCanvas   = document.getElementById('resultCanvas');
const progressBar    = document.getElementById('progressBar');
const progressText   = document.getElementById('progressText');

// ─── Warn if opened via file:// ──────────────────────────────────────────────
if (location.protocol === 'file:') {
    const banner = document.createElement('div');
    banner.style.cssText = [
        'position:fixed;top:0;left:0;right:0;z-index:9999',
        'background:#dc2626;color:white;padding:14px 20px',
        'font:600 14px/1.5 sans-serif;text-align:center'
    ].join(';');
    banner.innerHTML =
        '⚠️ This app requires a local web server to work. ' +
        'Run: <code style="background:rgba(0,0,0,.25);padding:2px 6px;border-radius:4px">' +
        'python3 -m http.server 8000</code> then open ' +
        '<a href="http://localhost:8000" style="color:#fde68a">http://localhost:8000</a>';
    document.body.prepend(banner);
}

// ─── Upload events ───────────────────────────────────────────────────────────
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

// ─── Slider events ───────────────────────────────────────────────────────────
document.getElementById('scaleSlider').addEventListener('input', e => {
    settings.scale = parseFloat(e.target.value);
    document.getElementById('scaleVal').textContent = settings.scale.toFixed(2) + '×';
    drawPreview();
});
document.getElementById('positionX').addEventListener('input', e => {
    settings.x = parseInt(e.target.value);
    document.getElementById('posXVal').textContent = settings.x;
    drawPreview();
});
document.getElementById('positionY').addEventListener('input', e => {
    settings.y = parseInt(e.target.value);
    document.getElementById('posYVal').textContent = settings.y;
    drawPreview();
});
document.getElementById('rotation').addEventListener('input', e => {
    settings.rotation = parseFloat(e.target.value);
    document.getElementById('rotVal').textContent = settings.rotation + '°';
    drawPreview();
});

document.getElementById('resetBtn').addEventListener('click', resetSettings);
document.getElementById('generateBtn').addEventListener('click', generateSheet);
document.getElementById('downloadBtn').addEventListener('click', downloadSheet);
document.getElementById('newPhotoBtn').addEventListener('click', resetApp);

// ─── File handling ───────────────────────────────────────────────────────────
async function handleFile(file) {
    if (!file) return;
    if (!file.type.match('image.*')) { alert('Please upload a JPEG or PNG image.'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10 MB.'); return; }

    showSection('loading');
    setProgress(5, 'Loading image…');

    try {
        setProgress(10, 'Removing background with AI…');

        // Dynamically import the library only when needed
        const { removeBackground } = await import(BG_LIB_URL);

        const noBgBlob = await removeBackground(file, {
            model: 'small',
            output: { format: 'image/png', quality: 1 },
            publicPath: 'https://esm.sh/@imgly/background-removal@1.4.5/dist/',
            progress: (key, cur, total) => {
                if (total > 0) {
                    const pct = Math.round(10 + (cur / total) * 75);
                    const label = key.includes('fetch') ? 'Downloading AI model…' : 'Processing image…';
                    setProgress(pct, label);
                }
            }
        });

        setProgress(90, 'Adding white background…');
        const whiteDataUrl = await compositeOnWhite(noBgBlob);
        setProgress(100, 'Done!');

        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            resetSettings();
            showSection('editor');
            drawPreview();
        };
        img.src = whiteDataUrl;

    } catch (err) {
        console.error('Background removal failed:', err);
        if (location.protocol === 'file:') {
            alert('Cannot run AI on file://\n\nStart a local server:\n  python3 -m http.server 8000\nThen open http://localhost:8000');
        } else {
            alert('Background removal failed. Check your internet connection and try again.\n\n' + err.message);
        }
        showSection('upload');
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function compositeOnWhite(blob) {
    const bmp = await createImageBitmap(blob);
    const c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(bmp, 0, 0);
    return c.toDataURL('image/png');
}

function setProgress(pct, label) {
    progressBar.style.width = pct + '%';
    progressText.textContent = label;
}

// ─── Section visibility ──────────────────────────────────────────────────────
function showSection(name) {
    document.querySelector('.upload-section').style.display = name === 'upload' ? 'grid' : 'none';
    loadingSection.style.display = name === 'loading' ? 'block' : 'none';
    editorSection.style.display  = name === 'editor'  ? 'block' : 'none';
    resultSection.style.display  = name === 'result'  ? 'block' : 'none';
}

// ─── Preview / drawing ───────────────────────────────────────────────────────
function resetSettings() {
    settings = { scale: 1, x: 0, y: 0, rotation: 0 };
    document.getElementById('scaleSlider').value = 1;
    document.getElementById('positionX').value   = 0;
    document.getElementById('positionY').value   = 0;
    document.getElementById('rotation').value    = 0;
    document.getElementById('scaleVal').textContent = '1.00×';
    document.getElementById('posXVal').textContent  = '0';
    document.getElementById('posYVal').textContent  = '0';
    document.getElementById('rotVal').textContent   = '0°';
    if (uploadedImage) drawPreview();
}

function drawPreview() {
    if (!uploadedImage) return;
    previewCanvas.width  = PREVIEW_SIZE;
    previewCanvas.height = PREVIEW_SIZE;
    drawPhotoOnCanvas(previewCanvas.getContext('2d'), PREVIEW_SIZE, uploadedImage, settings);
}

/**
 * Draws one passport photo onto a square canvas.
 * White fill first, then image scaled with object-fit:cover logic.
 */
function drawPhotoOnCanvas(ctx, size, img, s) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    ctx.save();
    ctx.translate(
        size / 2 + s.x * (size / PREVIEW_SIZE),
        size / 2 + s.y * (size / PREVIEW_SIZE)
    );
    ctx.rotate((s.rotation * Math.PI) / 180);
    const cover = Math.max(size / img.width, size / img.height) * s.scale;
    ctx.drawImage(
        img,
        -img.width  * cover / 2,
        -img.height * cover / 2,
        img.width  * cover,
        img.height * cover
    );
    ctx.restore();
}

// ─── Generate 4×6 sheet ──────────────────────────────────────────────────────
function generateSheet() {
    if (!uploadedImage) return;

    resultCanvas.width  = SHEET_W_PX;
    resultCanvas.height = SHEET_H_PX;

    const ctx = resultCanvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, SHEET_W_PX, SHEET_H_PX);

    // Render one high-res passport photo
    const photo = document.createElement('canvas');
    photo.width = photo.height = PASSPORT_PX;
    drawPhotoOnCanvas(photo.getContext('2d'), PASSPORT_PX, uploadedImage, {
        scale: settings.scale,
        x: settings.x * (PASSPORT_PX / PREVIEW_SIZE),
        y: settings.y * (PASSPORT_PX / PREVIEW_SIZE),
        rotation: settings.rotation
    });

    // Tile 2 columns × 3 rows
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.drawImage(photo, col * PASSPORT_PX, row * PASSPORT_PX);
        }
    }

    showSection('result');
}

// ─── Download ────────────────────────────────────────────────────────────────
function downloadSheet() {
    resultCanvas.toBlob(blob => {
        const a = document.createElement('a');
        a.download = 'passport-photos-4x6-' + Date.now() + '.jpg';
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
    }, 'image/jpeg', JPEG_QUALITY);
}

// ─── Reset ───────────────────────────────────────────────────────────────────
function resetApp() {
    uploadedImage = null;
    fileInput.value = '';
    showSection('upload');
}
