#!/bin/bash

# Activate the virtual environment -- if needed
source venv/bin/activate

# Run the Streamlit app
python3 -m streamlit run starlink_streamlit_app.py




nvm install 20
nvm use 20

# change to the resium directory
cd dashboard/resium

# Install dependencies
npm install

# Install specific Cesium/Resium packages
npm install cesium resium

cd /Users/asaunders/githubRepos/satellite-tracker/api
python3 -m uvicorn webstocket:app --reload --host 0.0.0.0
python3 -m gunicorn -w 4 -k uvicorn.workers.UvicornWorker webstocket:app --chdir api
python3 -m http.server 8080

# Navigate to the Resium directory
cd /path/to/satellite-tracker/dashboard/resium


# Start the React development server
npm start




##### ----- Issues with FastAPI ----- #####
python3 -m gunicorn -w 1 -k uvicorn.workers.UvicornWorker webstocket:app --chdir api --reload