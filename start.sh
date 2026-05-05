#!/bin/bash

echo "Starting FastAPI backend..."
cd /mnt/d/brd-project-salina/backend
source venv-linux/bin/activate
uvicorn main:app --reload &

echo "Starting React frontend..."
cd /mnt/d/brd-project-salina/frontend-v2
npm run dev
