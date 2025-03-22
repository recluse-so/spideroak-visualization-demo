import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTracking } from '../store/satelliteSlice';
import './SatelliteControls.css';

const SatelliteControls = () => {
  const dispatch = useDispatch();
  const { isTracking, position } = useSelector(state => state.satellite);
  
  const handleToggleTracking = () => {
    dispatch(toggleTracking());
  };
  
  const formatCoordinate = (value) => {
    return value ? value.toFixed(2) : 'N/A';
  };
  
  return (
    <div className="satellite-controls">
      <div className="control-header">
        <h3>Satellite Controls</h3>
      </div>
      
      <div className="control-row">
        <label htmlFor="tracking-toggle">Auto-track satellite:</label>
        <div className="toggle-switch">
          <input
            id="tracking-toggle"
            type="checkbox"
            checked={isTracking}
            onChange={handleToggleTracking}
          />
          <span className="toggle-slider"></span>
        </div>
      </div>
      
      {position && (
        <div className="coordinates">
          <h4>Current Position</h4>
          <div className="coordinate-row">
            <span className="coordinate-label">X:</span>
            <span className="coordinate-value">{formatCoordinate(position[0])} km</span>
          </div>
          <div className="coordinate-row">
            <span className="coordinate-label">Y:</span>
            <span className="coordinate-value">{formatCoordinate(position[1])} km</span>
          </div>
          <div className="coordinate-row">
            <span className="coordinate-label">Z:</span>
            <span className="coordinate-value">{formatCoordinate(position[2])} km</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SatelliteControls;
