const video = document.getElementById("cameraFeed");
const canvas = document.getElementById("photoCanvas");
const context = canvas.getContext("2d");
let stream;
let useFrontCamera = true;
let track;

// Start Camera
async function startCamera() {
    const constraints = {
        video: {
            facingMode: useFrontCamera ? "user" : "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        track = stream.getVideoTracks()[0]; // Get video track for zoom & flash
    } catch (error) {
        alert("Error accessing camera: " + error.message);
    }
}

// Switch Front & Rear Camera
document.getElementById("switchCamera").addEventListener("click", () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

// Take Photo
document.getElementById("takePhoto").addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
});

// Save Photo
document.getElementById("savePhoto").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "photo.png";
    link.click();
});

// Invert Color (Negative Effect)
document.getElementById("invertColor").addEventListener("click", () => {
    context.filter = "invert(1)";
    context.drawImage(video, 0, 0);
});

// Flashlight Toggle
document.getElementById("toggleFlash").addEventListener("click", async () => {
    if (!track) return alert("Camera is not active.");
    
    const capabilities = track.getCapabilities();
    
    if ("torch" in capabilities) {
        const settings = track.getSettings();
        const torchOn = settings.torch || false;
        await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
    } else {
        alert("Flashlight is not supported on this device.");
    }
});

// Zoom In
document.getElementById("zoomIn").addEventListener("click", async () => {
    if (!track) return alert("Camera is not active.");

    const capabilities = track.getCapabilities();
    
    if ("zoom" in capabilities) {
        const settings = track.getSettings();
        let newZoom = Math.min(settings.zoom + 1, capabilities.zoom.max);
        await track.applyConstraints({ advanced: [{ zoom: newZoom }] });
    } else {
        alert("Zoom is not supported on this device.");
    }
});

// Zoom Out
document.getElementById("zoomOut").addEventListener("click", async () => {
    if (!track) return alert("Camera is not active.");

    const capabilities = track.getCapabilities();
    
    if ("zoom" in capabilities) {
        const settings = track.getSettings();
        let newZoom = Math.max(settings.zoom - 1, capabilities.zoom.min);
        await track.applyConstraints({ advanced: [{ zoom: newZoom }] });
    } else {
        alert("Zoom is not supported on this device.");
    }
});

// Start Camera on Load
startCamera();
