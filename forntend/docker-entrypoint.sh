#!/bin/sh
npm -v
node -v
git --version
# #this loop will used for the continue running container
# while true; do
#     ls && wait
# done
pwd
rm -rf build/
npm install -g serve
if [ -d "/app/node_modules" ] 
then
    npm run build && serve -s build 
else
    npm cache verify && npm cache clean -f && npm install -g n && npm install &&  npm run build && serve -s build
fi
