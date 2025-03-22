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
  const { position, isTracking } = useSelector(state => state.satellite);
  const [resetView, setResetView] = React.useState(false);
  
  // Position as Cartesian3 when available
  const cartesian = position ? Cartesian3.fromArray(position) : null;
  
  // Handle reset view
  const handleResetView = () => {
    setResetView(true);
    setTimeout(() => setResetView(false), 3000); // Clear after animation completes
  };
  
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
        {/* Satellite entity */}
        {cartesian && (
          <Entity position={cartesian}>
            <PointGraphics
              pixelSize={10}
              color={Color.BLUE}
              outlineColor={Color.WHITE}
              outlineWidth={2}
            />
            <PathGraphics
              width={2}
              leadTime={0}
              trailTime={60}
              material={new PolylineGlowMaterialProperty({
                glowPower: 0.2,
                color: Color.BLUE
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
      
      <button className="reset-view-btn" onClick={handleResetView}>
        Reset View
      </button>
    </div>
  );
};

export default CesiumViewer;