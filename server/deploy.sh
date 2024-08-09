echo "Switching to branch master"
git checkout main

echo "Cloning repository..."
git clone https://github.com/PenKK/charted

echo "Stopping server..."
ssh deploy pm2 stop chartedAPI && pm2 delete chartedAPI

echo "Deploying files to server..."
ssh deploy 'find /home/penk/Desktop/ChartedAPI -mindepth 1 ! -name "process.json" -delete'
scp -r charted/server/* deploy:/home/penk/Desktop/ChartedAPI

echo "Installing dependicies..."
ssh deploy mkdir -p /home/penk/Desktop/ChartedAPI/node_modules
ssh deploy npm install --prefix /home/penk/Desktop/ChartedAPI/
scp process.json deploy:/home/penk/Desktop/ChartedAPI

echo "Starting server..."
ssh deploy pm2 start /home/penk/Desktop/ChartedAPI/process.json

rm -rf charted

echo "Done"