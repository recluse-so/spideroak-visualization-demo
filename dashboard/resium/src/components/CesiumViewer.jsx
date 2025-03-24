import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Viewer, 
  Entity, 
  PointGraphics, 
  PathGraphics,
  CameraFlyTo
} from 'resium';
import { 
  Ion, 
  Cartesian3, 
  Color, 
  PolylineGlowMaterialProperty, 
  Math as CesiumMath 
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './CesiumViewer.css';

// Initialize your access token with the one from vis.js
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODg4MWY5ZC1lYjZiLTQzZGUtOTJkMi1mNjU4NDhjZGZkODYiLCJpZCI6Mjg1Njc1LCJpYXQiOjE3NDIzNzA1NzB9.zut2Xp5YIZ7IPZ5bvphLCd8vWaOwVQp4OuwldQZ3h08';

const CesiumViewer = () => {
  const viewerRef = useRef(null);
  const { position, isTracking, connectionStatus } = useSelector(state => state.satellite);
  const [resetView, setResetView] = React.useState(false);
  
  // Log position updates to console for debugging
  useEffect(() => {
    if (position) {
      console.log('Position updated in Cesium:', position);
    }
  }, [position]);
  
  // Position as Cartesian3 when available
  const cartesian = position ? Cartesian3.fromArray(position) : null;
  
  // Handle reset view
  const handleResetView = () => {
    setResetView(true);
    setTimeout(() => setResetView(false), 3000); // Clear after animation completes
  };
  
  // Track the satellite
  const trackSatellite = () => {
    if (viewerRef.current?.cesiumElement && cartesian) {
      const viewer = viewerRef.current.cesiumElement;
      viewer.camera.flyTo({
        destination: Cartesian3.fromArray([
          position[0] * 1.5, // Offset to view from a distance
          position[1] * 1.5,
          position[2] * 1.5
        ]),
        orientation: {
          heading: 0,
          pitch: -CesiumMath.PI_OVER_FOUR,
          roll: 0
        }
      });
    }
  };

  // Initialize Cesium viewer settings
  useEffect(() => {
    if (viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      
      // Set initial camera position
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(0, 0, 20000000),
        orientation: {
          heading: 0,
          pitch: -CesiumMath.PI_OVER_TWO,
          roll: 0
        }
      });
      
      // Improve performance
      viewer.scene.fog.enabled = false;
      viewer.scene.globe.enableLighting = true;
    }
  }, []);
  
  return (
    <div className="cesium-container">
      <Viewer
        ref={viewerRef}
        full
        animation={false}
        timeline={false}
        baseLayerPicker={true}
        sceneModePicker={true}
        navigationHelpButton={false}
        fullscreenButton={false}
      >
        {/* Satellite entity - EXTRA VISIBLE NOW */}
        {cartesian && (
          <Entity position={cartesian}>
            <PointGraphics
              pixelSize={50}  // MUCH larger point
              color={Color.YELLOW} // Brighter color
              outlineColor={Color.RED}
              outlineWidth={5}
            />
            <PathGraphics
              width={5}  // Wider path
              leadTime={0}
              trailTime={600} // Longer trail
              material={new PolylineGlowMaterialProperty({
                glowPower: 0.5,
                color: Color.RED // Brighter trail
              })}
            />
          </Entity>
        )}
        
        {/* Camera reset */}
        {resetView && (
          <CameraFlyTo
            destination={Cartesian3.fromDegrees(0, 0, 20000000)}
            orientation={{
              heading: 0,
              pitch: -CesiumMath.PI_OVER_TWO,
              roll: 0
            }}
            duration={2}
          />
        )}
      </Viewer>
      
      <div className="buttons-container">
        <button className="reset-view-btn" onClick={handleResetView}>
          Reset View
        </button>
        
        {cartesian && (
          <button className="track-btn" onClick={trackSatellite}>
            Track Satellite
          </button>
        )}
        
        {/* Detailed debug info */}
        <div className="connection-status">
          <div>Connection: {connectionStatus}</div>
          <div>Data received: {position ? 'Yes' : 'No'}</div>
          {position && (
            <>
              <div>Position data:</div>
              <div>X: {position[0].toFixed(2)} km</div>
              <div>Y: {position[1].toFixed(2)} km</div>
              <div>Z: {position[2].toFixed(2)} km</div>
              <div>Magnitude: {Math.sqrt(position[0]*position[0] + position[1]*position[1] + position[2]*position[2]).toFixed(0)} km</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CesiumViewer;