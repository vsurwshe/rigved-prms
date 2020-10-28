#!/bin/sh
pwd
nodeModules= "/app/node_modules"
dir= pwd
# #this loop will used for the continue running container
# while true; do
#     ls && wait
# done
# this function will help the fetch the project
fetch_project(){
    git --version &&
    if [ "$(ls -A $dir)" ] 
    then
      git remote set-url origin https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms.git &&
      git branch -a &&
      git fetch origin master
    else
      git clone -b master https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms.git .
    fi 
}
# this fucntion will used for cleaing and installing dependcies
install_project_dependancy(){
    npm -v &&
    node -v &&
    npm cache verify && 
    npm cache clean -f && 
    npm install -g n && 
    npm install 
}
# this fucntion will used for building project
build_project(){
    rm -rf build/ &&
    npm install -g serve &&
    npm run build
}
# this function will used for runing project
run_project(){
    serve -s build
}
if [ -d "$nodeModules" ] 
then
    fetch_project &&
    build_project &&
    run_project
else
    fetch_project &&
    install_project_dependancy &&
    build_project &&
    run_project
fi
