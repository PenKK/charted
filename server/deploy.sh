#!/bin/bash

REMOTE_USER="user"
REMOTE_HOST="server"
APP_DIR="/home/$REMOTE_USER/apps/ChartedAPI"

echo "Switching to branch main"
git checkout main

echo "Cloning repository..."
git clone https://github.com/PenKK/charted

echo "Stopping server..."
ssh $REMOTE_HOST "pm2 stop chartedAPI && pm2 delete chartedAPI || true"

echo "Deploying files to server..."
ssh $REMOTE_HOST "mkdir -p $APP_DIR"
ssh $REMOTE_HOST "find $APP_DIR -mindepth 1 ! -name 'process.json' -delete"
scp -r charted/server/* $REMOTE_HOST:$APP_DIR

echo "Installing dependencies..."
ssh $REMOTE_HOST "npm install --prefix $APP_DIR"

echo "Starting server..."
ssh $REMOTE_HOST "cd $APP_DIR && pm2 start process.json"

rm -rf charted

echo "Done"

read -p "Enter to exit"