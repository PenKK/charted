echo "Switching to branch master"
git checkout main

echo "Cloning repository..."
git clone https://github.com/PenKK/charted

echo "Stopping server..."
ssh deploy@10.0.0.137 pm2 stop chartedAPI && pm2 delete chartedAPI

echo "Deploying files to server..."
ssh deploy@10.0.0.137 'find /home/penk/Desktop/ChartedAPI -mindepth 1 ! \( -name ".env" -o -name "ecosystem.config.js" \) -delete'
scp -r charted/server/* deploy@10.0.0.137:/home/penk/Desktop/ChartedAPI

echo "Installing dependicies..."
ssh deploy@10.0.0.137 mkdir -p /home/penk/Desktop/ChartedAPI/node_modules
ssh deploy@10.0.0.137 npm install --prefix /home/penk/Desktop/ChartedAPI/
scp .env deploy@10.0.0.137:/home/penk/Desktop/ChartedAPI

echo "Starting server..."
ssh deploy@10.0.0.137 pm2 start /home/penk/Desktop/ChartedAPI/server.js --name chartedAPI

rm -rf charted

echo "Done"

read -p "asdas"
