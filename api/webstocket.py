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


app = FastAPI()
class ConnectionManager:
   def __init__(self):
       self.active_connections = []
   async def connect(self, websocket: WebSocket):
       await websocket.accept()
       self.active_connections.append(websocket)
   def disconnect(self, websocket: WebSocket):
       self.active_connections.remove(websocket)
   async def broadcast(self, message: str):
       for connection in self.active_connections:
           try:
               await connection.send_text(message)
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
   time = Time(epoch, format='iso', scale='utc')
   gcrs = GCRS(CartesianRepresentation(position_eci * u.km), obstime=time)
   itrs = gcrs.transform_to(ITRS(obstime=time))
   return np.array([itrs.x.to_value(u.km), itrs.y.to_value(u.km), itrs.z.to_value(u.km)])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
   await manager.connect(websocket)
   try:
       while True:
           orbit = generate_orbit()
           times = [datetime.datetime.utcnow() + datetime.timedelta(seconds=i) for i in range(0, 600, 10)]
           positions = [eci_to_ecef(orbit.propagate(t * u.s).r.to_value(u.km), times[idx]) for idx, t in enumerate(range(0, 600, 10))]
           for time, pos in zip(times, positions):
               message = {
                   "timestamp": time.isoformat(),
                   "position": pos.tolist()  # Ensure JSON serialization
               }
               await manager.broadcast(str(message))
               await asyncio.sleep(1)
   except WebSocketDisconnect:
       manager.disconnect(websocket)