from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from poliastro.bodies import Earth
from poliastro.twobody import Orbit
from poliastro.constants import J2000
from poliastro.twobody.propagation import propagate
from astropy import units as u
from astropy.time import Time
from astropy.coordinates import GCRS, ITRS, CartesianRepresentation, EarthLocation
import asyncio
import datetime
import numpy as np
import json


app = FastAPI()
class ConnectionManager:
   def __init__(self):
       self.active_connections = []
   async def connect(self, websocket: WebSocket):
       await websocket.accept()
       self.active_connections.append(websocket)
   def disconnect(self, websocket: WebSocket):
       self.active_connections.remove(websocket)
   async def broadcast(self, message: dict):
       for connection in self.active_connections:
           try:
               await connection.send_json(message)
           except WebSocketDisconnect:
               self.disconnect(connection)
manager = ConnectionManager()

# Generate a 3D orbit
def generate_orbit():
   a = 7000 * u.km  # Semi-major axis
   ecc = 0.01 * u.one  # Eccentricity
   inc = 45 * u.deg  # Inclination
   raan = 80 * u.deg  # Right Ascension of Ascending Node
   argp = 0 * u.deg  # Argument of Perigee
   nu = 0 * u.deg  # True Anomaly
   return Orbit.from_classical(Earth, a, ecc, inc, raan, argp, nu, J2000)

# Convert ECI to ECEF
def eci_to_ecef(position_eci, epoch):
   # Convert datetime to string in ISO format for Time object
   if isinstance(epoch, datetime.datetime):
       # Format with 'Z' to indicate UTC timezone (ISO 8601 compliant)
       epoch_str = epoch.strftime('%Y-%m-%dT%H:%M:%S.%fZ') 
   else:
       # Ensure string format is ISO 8601 compliant
       epoch_str = str(epoch)
       if not epoch_str.endswith('Z'):
           epoch_str += 'Z'
   
   try:
       time = Time(epoch_str, format='isot', scale='utc')
       gcrs = GCRS(CartesianRepresentation(position_eci * u.km), obstime=time)
       itrs = gcrs.transform_to(ITRS(obstime=time))
       return np.array([itrs.x.to_value(u.km), itrs.y.to_value(u.km), itrs.z.to_value(u.km)])
   except Exception as e:
       print(f"Error converting time: {epoch_str}, Error: {e}")
       # Fallback to current time if there's an error
       current_time = Time.now()
       gcrs = GCRS(CartesianRepresentation(position_eci * u.km), obstime=current_time)
       itrs = gcrs.transform_to(ITRS(obstime=current_time))
       return np.array([itrs.x.to_value(u.km), itrs.y.to_value(u.km), itrs.z.to_value(u.km)])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
   await manager.connect(websocket)
   print("WebSocket client connected!")
   try:
       while True:
           orbit = generate_orbit()
           # Generate time points for propagation (every 10 seconds for 10 minutes)
           current_time = datetime.datetime.utcnow()
           times = [current_time + datetime.timedelta(seconds=i) for i in range(0, 600, 10)]
           
           # Propagate the orbit to each time point and convert to ECEF
           positions = []
           for idx, t in enumerate(range(0, 600, 10)):
               # Propagate the orbit forward t seconds
               propagated_orbit = orbit.propagate(t * u.s)
               # Get the position vector in ECI
               position_eci = propagated_orbit.r.to_value(u.km)
               # Convert to ECEF using the corresponding time
               position_ecef = eci_to_ecef(position_eci, times[idx])
               positions.append(position_ecef)
           
           # Send each position with its timestamp
           for time_point, pos in zip(times, positions):
               message = {
                   "timestamp": time_point.isoformat(),
                   "position": pos.tolist()
               }
               # Print diagnostic info
               mag = np.sqrt(np.sum(np.array(pos)**2))
               print(f"Sending position: [{pos[0]:.2f}, {pos[1]:.2f}, {pos[2]:.2f}] km, magnitude: {mag:.2f} km")
               await manager.broadcast(message)
               await asyncio.sleep(1)
   except WebSocketDisconnect:
       print("WebSocket client disconnected")
       manager.disconnect(websocket)