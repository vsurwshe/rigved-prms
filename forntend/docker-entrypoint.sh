#!/bin/sh
# Variable declrations
nodeModules= "/usr/src/app/node_modules"
dir= pwd
username=$1
password=$2

# #this loop will used for the continue running container
# contious_run(){
#   while true; do
#       ls && wait
#   done
# }
check_git_available(){
    command -v git >/dev/null 2>&1 ||
    { echo >&2 "Git is not installed. Installing..";
      yum install git -y
    }
    echo "In PRMS-Forntend GIT Version";
    git --version 
}

# this fucntion will used for the remove old content
remove_old_content(){
   if [ "$(ls -A $dir)" ]
    then 
        echo "Removing old content..." &&
        cp -af . /usr/src/ &&
        rm -r * &&
        echo "Removed old conetent..."
    fi
}

# this function will help the fetch the project
fetch_project(){
    inside_git_repo="$(git rev-parse --is-inside-work-tree 2>/dev/null)"
    if [ "$inside_git_repo" ]; then
        echo "You already in git repo"
        git remote set-url origin https://$username:$password@gitlab.com/joshi.rites/rigved-prms.git &&
        git branch &&
        git pull origin dockerBranch &&
        git log -1 --stat --oneline
    else
        echo "You are not in git repo, pulling git repo"
        remove_old_content &&
        git clone -b dockerBranch https://$username:$password@gitlab.com/joshi.rites/rigved-prms.git .
    fi
}

# this fucntion will used for cleaing and installing dependcies
install_project_dependancy(){
    echo "Clean NPM Cache..." &&
    npm cache verify && 
    npm cache clean -f && 
    echo "Check the npm version and update npm" &&
    npm install -g n &&
    echo "packages installing........" && 
    npm install 
    echo "packages installed........"
}
# this fucntion will used for building project
build_project(){
    echo "Project building...." &&
    rm -rf build/ &&
    npm install -g serve &&
    npm run build
}
# this function will used for runing project
run_project(){
    serve -s build
}

#  main  function executing 
if [ -d "$nodeModules" ] 
then
    check_git_available &&
    fetch_project &&
    build_project &&
    run_project
else
    check_git_available &&
    fetch_project &&
    install_project_dependancy &&
    build_project &&
    run_project
fi
