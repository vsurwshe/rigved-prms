#!/bin/sh
# this is virable declrations
runFile="build/libs/RVProjectManagement-0.0.1.jar"
dir= pwd
username=$1
password=$2

# this function checked the git is available or not
check_git_available(){
    command -v git >/dev/null 2>&1 ||
    { echo >&2 "Git is not installed. Installing..";
      yum install git -y
    }
    echo "In PRMS-Backend GIT Version";
    git --version 
}

# this floder used for the remove old content
remove_old_content(){
   if [ "$(ls -A $dir)" ]
    then 
    #  mkdir /home/dummy &&
     cp -af . /home/ &&
     rm -r *
    fi
}

# this function will help the fetch the project
fetch_project(){
   inside_git_repo="$(git rev-parse --is-inside-work-tree 2>/dev/null)"
    if [ "$inside_git_repo" ]; then
      echo "you are inside git repo"
       git remote set-url origin https://$username:$password@gitlab.com/joshi.rites/rigved-prms-backend.git &&
       git branch &&
       git pull origin master
       git log -1 --stat --oneline
    else
      echo "you are not in git repo"
      # remove_old_content &&
      git clone -b master https://$username:$password@gitlab.com/joshi.rites/rigved-prms-backend.git .
    fi
}

# this function will used for the building project
build_project(){
    gradle --version
    gradle build --no-daemon --stacktrace
}

# this funtion will used for the runing project
run_project(){
    java --version
    java -jar $runFile
}

if [ -f "$runFile" ] 
then
 check_git_available &&
 fetch_project && 
 run_project
else
 check_git_available &&
 fetch_project && 
 build_project &&
 run_project
fi