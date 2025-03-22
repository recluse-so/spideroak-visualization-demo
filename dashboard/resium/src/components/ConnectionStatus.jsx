import React from 'react';
import { useSelector } from 'react-redux';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  const { connectionStatus, lastUpdated } = useSelector(state => state.satellite);
  
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <span className="status-indicator connected"></span>;
      case 'error':
        return <span className="status-indicator error"></span>;
      default:
        return <span className="status-indicator disconnected"></span>;
    }
  };
  
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  return (
    <div className="connection-status">
      <div className="status-row">
        {getStatusIndicator()}
        <span className="status-text">{getStatusText()}</span>
      </div>
      <div className="last-update">
        Last update: {formatTimestamp(lastUpdated)}
      </div>
    </div>
  );
};

export default ConnectionStatus;
