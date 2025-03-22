import { Ion, Viewer } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './styles.css';
import { initSatelliteTracker } from './satellite-tracker';

// Your Cesium access token
Ion.defaultAccessToken = 'your-access-token-here';

// Initialize the viewer
const viewer = new Viewer('cesiumContainer', {
  shouldAnimate: true,
  terrainProvider: Cesium.createWorldTerrain(),
  baseLayerPicker: true,
  sceneModePicker: true,
  navigationHelpButton: false,
  animation: false,
  timeline: false,
  fullscreenButton: false
});

// Initialize satellite tracker
initSatelliteTracker(viewer);

// Set up reset view button
document.getElementById('resetViewButton').addEventListener('click', () => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
    orientation: {
      heading: 0,
      pitch: -Cesium.Math.PI_OVER_TWO,
      roll: 0
    },
    duration: 2
  });
});

// Set initial camera view
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
  orientation: {
    heading: 0,
    pitch: -Cesium.Math.PI_OVER_TWO,
    roll: 0
  }
});