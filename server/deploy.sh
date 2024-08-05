echo "Switching to branch master"
git checkout main

echo "Cloning repository..."
git clone https://github.com/PenKK/charted

echo "Stopping server..."
ssh deploy pm2 stop chartedAPI && pm2 delete chartedAPI

echo "Deploying files to server..."
ssh deploy 'find /home/penk/Desktop/ChartedAPI -mindepth 1 ! -name ".env" -delete'
scp -r charted/server/* deploy:/home/penk/Desktop/ChartedAPI

echo "Installing dependicies..."
ssh deploy mkdir -p /home/penk/Desktop/ChartedAPI/node_modules
ssh deploy npm install --prefix /home/penk/Desktop/ChartedAPI/
scp .env deploy:/home/penk/Desktop/ChartedAPI

echo "Starting server..."
ssh deploy NODE_ENV=production pm2 start /home/penk/Desktop/ChartedAPI/server.js --name chartedAPI

rm -rf charted

echo "Done"