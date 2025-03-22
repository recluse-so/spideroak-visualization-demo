import { Cartesian3, Color, PolylineGlowMaterialProperty } from 'cesium';

export function initSatelliteTracker(viewer) {
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
    const cartesian = Cartesian3.fromArray(position);
    
    // Create a unique ID for this satellite
    const satelliteId = "satellite-1"; // You can modify this if tracking multiple satellites
    
    if (!satelliteEntities.has(satelliteId)) {
      // Create new satellite entity if it doesn't exist
      const entity = viewer.entities.add({
        id: satelliteId,
        position: cartesian,
        point: {
          pixelSize: 10,
          color: Color.BLUE,
          outlineColor: Color.WHITE,
          outlineWidth: 2
        },
        path: {
          resolution: 1,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Color.BLUE
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

  // Set up cleanup function
  window.addEventListener('beforeunload', () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    viewer.entities.removeAll();
    satelliteEntities.clear();
  });

  return {
    cleanup: () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      viewer.entities.removeAll();
      satelliteEntities.clear();
    }
  };
}