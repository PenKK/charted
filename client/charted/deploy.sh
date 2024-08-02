echo "Switching to branch master"
git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server..."

scp -r dist/* deploy@10.0.0.137:/var/www/charted.mooo.com

echo "Done"

read -p "Press enter to continue"