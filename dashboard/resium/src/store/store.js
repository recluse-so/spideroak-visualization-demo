import { configureStore } from '@reduxjs/toolkit';
import satelliteReducer from './satelliteSlice';

export const store = configureStore({
  reducer: {
    satellite: satelliteReducer,
  },
});
