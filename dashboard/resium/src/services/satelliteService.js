/**
 * Satellite Service
 * 
 * This service handles communication with the WebSocket server
 * for satellite tracking data. It's used by useSatelliteData hook.
 */

// WebSocket server URL
export const WEBSOCKET_URL = 'ws://localhost:8000/ws';

/**
 * Connect to the WebSocket server
 * @param {Object} handlers - Event handlers
 * @param {Function} handlers.onOpen - Called when connection opens
 * @param {Function} handlers.onMessage - Called when message is received
 * @param {Function} handlers.onError - Called when error occurs
 * @param {Function} handlers.onClose - Called when connection closes
 * @returns {WebSocket} The WebSocket instance
 */
export const connectToWebSocketServer = (handlers) => {
  const { onOpen, onMessage, onError, onClose } = handlers;
  
  const ws = new WebSocket(WEBSOCKET_URL);
  
  if (onOpen) {
    ws.onopen = onOpen;
  }
  
  if (onMessage) {
    ws.onmessage = (event) => {
      try {
        // Replace Python's single quotes with double quotes for JSON.parse
        const data = JSON.parse(event.data.replace(/'/g, '"'));
        onMessage(data);
      } catch (error) {
        console.error('Error parsing satellite data:', error);
      }
    };
  }
  
  if (onError) {
    ws.onerror = onError;
  }
  
  if (onClose) {
    ws.onclose = onClose;
  }
  
  return ws;
};

/**
 * Disconnect from the WebSocket server
 * @param {WebSocket} ws - The WebSocket instance
 */
export const disconnectFromWebSocketServer = (ws) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
};

/**
 * Format coordinate for display
 * @param {number} value - The coordinate value
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted coordinate
 */
export const formatCoordinate = (value, precision = 2) => {
  return value ? value.toFixed(precision) : 'N/A';
};
