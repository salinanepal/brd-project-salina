#!/bin/bash

echo "Starting FastAPI backend..."
cd /d/brd-project-salina/backend
uvicorn main:app --reload &

echo "Starting React frontend..."
cd /d/brd-project-salina/frontend-v2
npm run dev
