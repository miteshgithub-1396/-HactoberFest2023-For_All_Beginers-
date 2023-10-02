const imageInput = document.getElementById('imageInput');
const outputCanvas = document.getElementById('outputCanvas');
const modelPath = '/models';

// Load face-api.js models
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
}

// Initialize the canvas
function initializeCanvas() {
    outputCanvas.width = 400;
    outputCanvas.height = 300;
}

// Perform face recognition
async function recognizeFaces(image) {
    const canvas = faceapi.createCanvasFromMedia(image);
    const displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(canvas, displaySize);

    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.style.position = 'absolute';
    image.parentNode.insertBefore(canvas, image.nextSibling);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
}

// Handle image selection
imageInput.addEventListener('change', async () => {
    const imageFile = imageInput.files[0];
    if (imageFile) {
        const image = await faceapi.bufferToImage(imageFile);
        recognizeFaces(image);
    }
});

// Main function
async function main() {
    await loadModels();
    initializeCanvas();
}

main();
