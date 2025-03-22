import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CesiumViewer from './components/CesiumViewer';
import ConnectionStatus from './components/ConnectionStatus';
import SatelliteControls from './components/SatelliteControls';
import useSatelliteData from './hooks/useSatelliteData';
import './App.css';

function SatelliteDataProvider() {
  useSatelliteData(); // Hook to set up WebSocket connection
  return null;
}

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <SatelliteDataProvider />
        <CesiumViewer />
        <div className="overlay">
          <ConnectionStatus />
          <SatelliteControls />
        </div>
      </div>
    </Provider>
  );
}

export default App;