import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updatePosition, 
  setConnectionStatus 
} from '../store/satelliteSlice';
import { 
  connectToWebSocketServer, 
  disconnectFromWebSocketServer 
} from '../services/satelliteService';

const useSatelliteData = () => {
  const dispatch = useDispatch();
  const { isTracking } = useSelector(state => state.satellite);
  
  useEffect(() => {
    // Only connect if tracking is enabled
    if (!isTracking) {
      dispatch(setConnectionStatus('disconnected'));
      return;
    }
    
    // Set up handlers for WebSocket events
    const handlers = {
      onOpen: () => {
        console.log('Connected to satellite tracking server');
        dispatch(setConnectionStatus('connected'));
      },
      
      onMessage: (data) => {
        // Update the satellite position in the Redux store
        if (data.position) {
          dispatch(updatePosition(data.position));
        }
      },
      
      onError: (error) => {
        console.error('WebSocket error:', error);
        dispatch(setConnectionStatus('error'));
      },
      
      onClose: () => {
        console.log('Disconnected from satellite tracking server');
        dispatch(setConnectionStatus('disconnected'));
      }
    };
    
    // Connect to WebSocket server
    const ws = connectToWebSocketServer(handlers);
    
    // Clean up the connection when the component unmounts or tracking is disabled
    return () => {
      disconnectFromWebSocketServer(ws);
    };
  }, [dispatch, isTracking]);
  
  // No need to return anything for this hook
  return null;
};

export default useSatelliteData;