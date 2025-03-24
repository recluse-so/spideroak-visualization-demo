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

## 🖥️ Comprehensive Guide to Running Locally

This section provides a detailed, step-by-step guide to get the satellite tracker up and running on your local machine.

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)
- **RAM**: 4GB minimum, 8GB+ recommended for smooth Cesium rendering
- **Disk Space**: At least 1GB free space
- **Internet Connection**: Required for Cesium ion access and TLE data retrieval

### Installing Dependencies

#### Backend Dependencies

1. **Python Setup**:
   ```bash
   # Check your Python version (should be 3.8+)
   python --version
   
   # Create a virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

2. **Install Python Packages**:
   ```bash
   # Install FastAPI and dependencies
   pip install fastapi uvicorn[standard]
   
   # Install astronomy libraries
   pip install poliastro astropy
   
   # Install other utilities
   pip install requests websockets
   ```

#### Frontend Dependencies

1. **Node.js Setup**:

   ```bash
   # Check your Node.js version (should be 14+)
   node --version
   npm --version
   ```

2. **Install React and Cesium Dependencies**:
   ```bash
   # Navigate to the frontend directory
   cd dashboard/resium
   
   # Install dependencies
   npm install
   
   # Install specific Cesium/Resium packages
   npm install cesium resium
   ```

### Environment Configuration

1. **Cesium Ion Token**:
   - Create an account at [https://cesium.com/ion/](https://cesium.com/ion/)
   - Get your access token from the dashboard
   - Update the token in `dashboard/resium/src/components/CesiumViewer.jsx`

2. **Backend Configuration**:
   - Create a `.env` file in the project root with the following:
   ```
   FASTAPI_HOST=localhost
   FASTAPI_PORT=8000
   ```

### Starting the Application

#### 1. Start the Backend Server

```bash
# Make sure you're in the project root and virtual environment is activated
cd /path/to/satellite-tracker
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start the FastAPI server
uvicorn api.websocket:app --reload --host 0.0.0.0 --port 8000
```

You should see output similar to:
```
INFO:     Started server process [28967]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

#### 2. Start the Frontend Development Server

In a new terminal window:

```bash
# Navigate to the Resium directory
cd /path/to/satellite-tracker/dashboard/resium

# Start the React development server
npm start
```

Your default browser should automatically open to `http://localhost:3000` with the application running.

### Verifying Everything Works

1. **Check WebSocket Connection**:
   - Open your browser's developer tools (F12 or Ctrl+Shift+I)
   - Go to the Console tab
   - Look for the message: "Connected to satellite tracking server"

2. **Verify Visualization**:
   - You should see the Earth rendered in the Cesium viewer
   - A blue satellite point should appear and move along its orbit
   - The connection status indicator should show "Connected" with a green dot

3. **Test Controls**:
   - Try toggling the "Auto-track satellite" switch
   - Click the "Reset View" button to reset the camera position

### Troubleshooting Common Issues

#### Backend Issues

1. **Port Already in Use**:
   ```
   ERROR:    [Errno 48] Address already in use
   ```
   **Solution**: Change the port in the uvicorn command (e.g., `--port 8001`) or find and stop the process using port 8000.

2. **Missing Dependencies**:
   ```
   ModuleNotFoundError: No module named 'poliastro'
   ```
   **Solution**: Make sure you've installed all required packages with pip.

#### Frontend Issues

1. **WebSocket Connection Error**:
   ```
   WebSocket connection to 'ws://localhost:8000/ws' failed
   ```
   **Solution**: Ensure the backend server is running and check for any CORS issues.

2. **Cesium Rendering Issues**:
   ```
   Error: An error occurred while rendering. Rendering has stopped.
   ```
   **Solution**: Verify your Cesium Ion token is valid and check that your graphics drivers are up to date.

### Running in Production Mode

For improved performance in a local production-like environment:

1. **Build the Frontend**:
   ```bash
   cd dashboard/resium
   npm run build
   ```

2. **Serve the Frontend with a Static Server**:
   ```bash
   npx serve -s build
   ```

3. **Run the Backend with Gunicorn** (Linux/macOS):
   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker api.websocket:app
   ```

---

This satellite tracking application demonstrates an effective integration of modern web technologies with complex scientific calculations, providing an interactive and educational tool for visualizing satellites in orbit around Earth. 🚀✨
