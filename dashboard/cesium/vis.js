
// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODg4MWY5ZC1lYjZiLTQzZGUtOTJkMi1mNjU4NDhjZGZkODYiLCJpZCI6Mjg1Njc1LCJpYXQiOjE3NDIzNzA1NzB9.zut2Xp5YIZ7IPZ5bvphLCd8vWaOwVQp4OuwldQZ3h08';

const ws = new WebSocket("wss://yourserver.com/ws");
ws.onmessage = function(event) {
   const data = JSON.parse(event.data);
   console.log("Received:", data);
   // Convert position to Cartesian3
   const position = Cesium.Cartesian3.fromArray(data.position);
   // Add or update the satellite entity
   viewer.entities.add({
       position: position,
       point: { pixelSize: 10, color: Cesium.Color.RED }
   });
};


const viewer = new Cesium.Viewer("cesiumContainer", {
    shouldAnimate: true,
    terrain: Terrain.fromWorldTerrain(),
  });
  
  Sandcastle.addDefaultToolbarButton("Satellite Constellation", function () {
    viewer.dataSources.add(
      Cesium.CzmlDataSource.load("./data/four_satellites.czml"),
    );
  
    viewer.camera.flyHome(0);
  });
  
  
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-116.52, 35.02, 95000),
      orientation: {
        heading: 6,
      },
    });

  
Sandcastle.reset = function () {
viewer.dataSources.removeAll();
};

czmlEventSource.addEventListener('czml', function(czmlUpdate) {
      try {
         var json = JSON.parse(czmlUpdate.data);
         console.log('czml event id=', json.id);
         //process the 'data:' coming across as JSON into the datasource 
         czmlStream.process(json);
      } catch (t) {
         console.error(t)
      }       
    }, false);
    
//put the streaming datasource into Cesium 
viewer.dataSources.add(czmlStream);