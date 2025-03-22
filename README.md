# 🛰️ Satellite Tracker: Project Overview & Development Guide

## 🌎 Overview

This project is a sophisticated satellite tracking application that combines a Python backend for orbital calculations with a modern React/Cesium frontend for 3D visualization. The system provides real-time visualization of satellite positions and orbits on an interactive 3D globe.

## 🏗️ System Architecture

### 1. Backend (Python FastAPI) 🐍

The backend consists of a FastAPI server that:
- 🧮 Calculates satellite positions using orbital mechanics libraries
- 📡 Broadcasts position updates via WebSockets
- ⏱️ Handles orbital propagation in real-time

**Key Components:**
- **WebSocket Server (`api/websocket.py`)**: Handles real-time communication with the frontend
- **Orbital Calculations**: Uses `poliastro` for accurate orbital propagation
- **Coordinate Transformations**: Converts ECI (Earth-Centered Inertial) to ECEF (Earth-Centered Earth-Fixed) coordinates

### 2. Frontend (React + Resium) ⚛️

The frontend is a React application that utilizes Resium (React bindings for CesiumJS) to visualize satellites in 3D space:

**Key Components:**
- **Redux State Management**: Manages application state (satellite positions, connection status)
- **WebSocket Client**: Connects to the backend for real-time data
- **3D Visualization**: Renders satellites and their orbits on a 3D globe

## 🔄 Data Flow

```
┌─────────────────┐       WebSocket       ┌─────────────────────┐
│                 │ Position Updates (XYZ) │                     │
│  Python Backend ├─────────────────────►  │  React/Resium UI    │
│                 │                       │                     │
└─────────────────┘                       └─────────────────────┘
  │                                          │
  │ Calculate                                │ Visualize
  ▼                                          ▼
┌─────────────────┐                       ┌─────────────────────┐
│  Orbit          │                       │  3D Globe with      │
│  Propagation    │                       │  Satellite Entity   │
└─────────────────┘                       └─────────────────────┘
```

## 🚀 Local Development Setup

### Prerequisites
- 🐍 Python 3.8+ for the backend
- 📦 Node.js 14+ for the frontend
- 🔄 Git for version control

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/satellite-tracker.git
   cd satellite-tracker
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install fastapi uvicorn poliastro astropy asyncio
   ```

4. **Start the FastAPI server:**
   ```bash
   uvicorn api.websocket:app --reload --port 8000
   ```
   The server will be available at `http://localhost:8000` with WebSockets at `ws://localhost:8000/ws`.

### Frontend Setup

1. **Navigate to the Resium directory:**
   ```bash
   cd dashboard/resium
   ```

2. **Install NPM dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

## 🧩 Code Structure Deep Dive

### Backend Components

#### `/api/websocket.py`
This file contains the FastAPI WebSocket server that:
- Creates a WebSocket endpoint at `/ws`
- Generates orbits using `poliastro`
- Propagates satellite positions over time
- Converts coordinates from ECI to ECEF
- Broadcasts position updates to all connected clients

The key functions include:
- `generate_orbit()`: Creates a sample orbit using Keplerian elements
- `eci_to_ecef()`: Converts Earth-Centered Inertial coordinates to Earth-Centered Earth-Fixed
- `websocket_endpoint()`: Handles WebSocket connections and periodic position updates

### Frontend Components

#### React/Redux Structure

The React application follows a modern architecture with:

1. **Components (`/src/components/`):**
   - 🌐 `CesiumViewer.jsx`: Renders the 3D globe and satellite using Resium
   - 🔌 `ConnectionStatus.jsx`: Displays the WebSocket connection status
   - 🎮 `SatelliteControls.jsx`: Provides UI controls for tracking and displays position data

2. **Redux Store (`/src/store/`):**
   - 📊 `satelliteSlice.js`: Manages satellite state (position, connection status, tracking)
   - 🏪 `store.js`: Configures the Redux store

3. **Custom Hooks (`/src/hooks/`):**
   - 🪝 `useSatelliteData.js`: Manages WebSocket connection lifecycle based on tracking state

4. **Services (`/src/services/`):**
   - 🔄 `satelliteService.js`: Handles WebSocket communication with the backend

## 🔗 Integration Points

The key integration between backend and frontend happens through:

1. **WebSocket Communication:**
   - Backend sends: `{"timestamp": "ISO-format", "position": [x, y, z]}`
   - Frontend receives this data and updates Redux store
   - UI components react to state changes

2. **Coordinate Systems:**
   - Backend calculates positions in ECEF coordinates (in kilometers)
   - Frontend visualizes these positions directly using Cesium's Cartesian3

## 👨‍💻 Development Workflow

### Adding a New Feature

1. **Backend Changes:**
   - Modify `api/websocket.py` to generate additional data or support new features
   - Test using WebSocket client tools like Postman

2. **Frontend Changes:**
   - Update Redux slice in `src/store/satelliteSlice.js` to handle new data
   - Modify React components to visualize the new data
   - Update WebSocket handling in `useSatelliteData.js`

### Debugging Tips 🐞

1. **Backend Issues:**
   - Check FastAPI logs for errors
   - Use `print()` statements or Python debugger for WebSocket handlers
   - Test WebSocket endpoint independently using tools like `wscat`

2. **Frontend Issues:**
   - Use Redux DevTools to inspect state changes
   - Check browser console for WebSocket events and errors
   - Use React DevTools to inspect component props and state

3. **Connection Issues:**
   - Verify WebSocket URL in `satelliteService.js` matches backend
   - Check for CORS issues if running on different ports/domains
   - Ensure proper JSON parsing (Python vs. JavaScript formatting)

## ⚙️ Advanced Configurations

### Customizing Orbital Parameters

To simulate different satellites or constellations, modify the `generate_orbit()` function in `api/websocket.py`:

```python
def generate_orbit():
   # Change these parameters for different orbits
   a = 7000 * u.km           # Semi-major axis
   ecc = 0.01 * u.one        # Eccentricity
   inc = 45 * u.deg          # Inclination
   raan = 80 * u.deg         # Right Ascension of Ascending Node
   argp = 0 * u.deg          # Argument of Perigee
   nu = 0 * u.deg            # True Anomaly
   return Orbit.from_classical(Earth, a, ecc, inc, raan, argp, nu, J2000)
```

### Visualizing Multiple Satellites

To track multiple satellites, you would:
1. Modify the backend to send an array of satellite positions
2. Update the Redux store to maintain a map of satellite entities
3. Extend the Cesium component to render multiple entities

## ⚡ Performance Considerations

1. **Backend Optimizations:**
   - Use efficient orbit propagation algorithms
   - Adjust update frequency based on requirements
   - Consider caching orbital calculations

2. **Frontend Optimizations:**
   - Implement throttling for high-frequency WebSocket updates
   - Use efficient Cesium rendering techniques
   - Consider using Web Workers for data processing

## 🚢 Deployment Considerations

For production deployment:

1. **Backend:**
   - Deploy FastAPI using a production ASGI server like Gunicorn
   - Set up proper error handling and logging
   - Consider using environment variables for configuration

2. **Frontend:**
   - Build optimized production bundle with `npm run build`
   - Consider using a CDN for Cesium assets
   - Deploy to a static hosting service

## 🔮 Next Steps for Development

To enhance the application, consider:

1. **Real TLE Data:**
   - Integrate with Space-Track or Celestrak APIs for real satellite TLE data
   - Implement proper TLE parsing and orbit propagation

2. **Multiple Satellite Support:**
   - Track and visualize multiple satellites simultaneously
   - Add satellite selection UI

3. **Ground Station Visualization:**
   - Add ground stations and visibility calculations
   - Visualize access windows between satellites and ground stations

4. **Historical Data:**
   - Store and replay historical satellite positions
   - Implement timeline controls

## 📸 Screenshots

*[Add screenshots of your application here]*

---

This satellite tracking application demonstrates an effective integration of modern web technologies with complex scientific calculations, providing an interactive and educational tool for visualizing satellites in orbit around Earth. 🚀✨
