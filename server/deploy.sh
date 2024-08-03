echo "Script executed from: ${PWD}"

echo "Switching to branch master"
git checkout main

echo "Cloning repository..."
git clone https://github.com/PenKK/charted

export NODE_ENV=production

echo "Stopping server..."
ssh deploy@10.0.0.137 "pm2 stop chartedAPI && pm2 delete chartedAPI"

echo "Deploying files to server..."
scp -r charted/server/* deploy@10.0.0.137:/home/penk/Desktop/ChartedAPI

echo "Installing dependicies..."
ssh deploy@10.0.0.137 mkdir -p /home/penk/Desktop/ChartedAPI/node_modules
ssh deploy@10.0.0.137 npm install --prefix /home/penk/Desktop/ChartedAPI/

echo "Starting server..."
ssh deploy@10.0.0.137 "pm2 start /home/penk/Desktop/ChartedAPI/server.js --name chartedAPI"

rm -rf charted

echo "Done"

read -p "Press enter to continue"