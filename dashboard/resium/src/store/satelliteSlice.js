import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  position: null,
  connectionStatus: 'disconnected', // 'connected', 'disconnected', 'error'
  lastUpdated: null,
  isTracking: true
};

export const satelliteSlice = createSlice({
  name: 'satellite',
  initialState,
  reducers: {
    updatePosition: (state, action) => {
      state.position = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    toggleTracking: (state) => {
      state.isTracking = !state.isTracking;
    }
  }
});

export const { updatePosition, setConnectionStatus, toggleTracking } = satelliteSlice.actions;

export default satelliteSlice.reducer;