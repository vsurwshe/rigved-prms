#!/bin/sh
pwd
nodeModules= "/usr/src/app/node_modules"
dir= pwd
command -v git >/dev/null 2>&1 ||
{ echo >&2 "Git is not installed. Installing..";
  yum install git -y
}
echo "In PRMS-Forntend GIT Version";
git --version 
# #this loop will used for the continue running container
# while true; do
#     ls && wait
# done
remove_old_content(){
   if [ "$(ls -A $dir)" ]
    then 
     mkdir /usr/src/dummy &&
     cp -a . /usr/src/dummy &&
     rm -r ./*
     rm -r ./.*
    fi
}
# this function will help the fetch the project
fetch_project(){
    inside_git_repo="$(git rev-parse --is-inside-work-tree 2>/dev/null)"
    if [ "$inside_git_repo" ]; then
      echo "you are inside git repo"
       git remote set-url origin https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms.git &&
       git branch -a &&
       git fetch origin master
    else
      echo "you are not in git repo"
      remove_old_content &&
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
