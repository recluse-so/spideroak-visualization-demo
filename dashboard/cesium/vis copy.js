// Initialize the Cesium viewer with necessary settings
const viewer = new Cesium.Viewer("cesiumContainer", {
    shouldAnimate: true,
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: true,
    sceneModePicker: true,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false
});

// Dictionary to store satellite entities
const satelliteEntities = new Map();

// Connect to the FastAPI WebSocket server
const ws = new WebSocket("ws://localhost:8000/ws");

// WebSocket event handlers
ws.onopen = function() {
    console.log("Connected to satellite tracking server");
};

ws.onmessage = function(event) {
    try {
        // Parse the incoming data
        const data = JSON.parse(event.data.replace(/'/g, '"')); // Handle Python's string representation
        const timestamp = new Date(data.timestamp);
        const position = data.position;

        // Create or update the satellite entity
        updateSatellitePosition(timestamp, position);
    } catch (error) {
        console.error("Error processing satellite data:", error);
    }
};

ws.onerror = function(error) {
    console.error("WebSocket error:", error);
};

ws.onclose = function() {
    console.log("Disconnected from satellite tracking server");
};

// Function to update satellite position
function updateSatellitePosition(timestamp, position) {
    // Convert the position array to Cartesian3
    const cartesian = Cesium.Cartesian3.fromArray(position);
    
    // Create a unique ID for this satellite
    const satelliteId = "satellite-1"; // You can modify this if tracking multiple satellites

    if (!satelliteEntities.has(satelliteId)) {
        // Create new satellite entity if it doesn't exist
        const entity = viewer.entities.add({
            id: satelliteId,
            position: cartesian,
            point: {
                pixelSize: 10,
                color: Cesium.Color.BLUE,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
            },
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: Cesium.Color.BLUE
                }),
                width: 2,
                leadTime: 0,
                trailTime: 60
            }
        });
        satelliteEntities.set(satelliteId, entity);
    } else {
        // Update existing satellite position
        const entity = satelliteEntities.get(satelliteId);
        entity.position = cartesian;
    }
}

// Set initial camera view
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
    orientation: {
        heading: 0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0
    }
});

// Function to reset the view
function resetView() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
        orientation: {
            heading: 0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0
        },
        duration: 2
    });
}

// Add reset view button
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset View';
resetButton.className = 'cesium-button';
resetButton.onclick = resetView;
viewer.container.appendChild(resetButton);

// Cleanup function
function cleanup() {
    if (ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    viewer.entities.removeAll();
    satelliteEntities.clear();
}