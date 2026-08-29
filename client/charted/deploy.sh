echo "Switching to branch main"
git checkout main

export NODE_ENV=production

echo "Building app..."
npm run build

echo "Deleting old files on server..."
ssh server "rm -rf /var/www/charted.mooo.com/*"

echo "Deploying files to server..."

scp -r dist/* server:/var/www/charted.mooo.com

rm -r dist

echo "Done"

read -p "Enter to exit"