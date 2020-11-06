#!/bin/sh
pwd
runFile="build/libs/RVProjectManagement-0.0.1.jar"
dir= pwd
command -v git >/dev/null 2>&1 ||
{ echo >&2 "Git is not installed. Installing..";
  yum install git -y
}
echo "In PRMS-Backend GIT Version";
git --version 
# this floder used for the remove old content
remove_old_content(){
   if [ "$(ls -A $dir)" ]
    then 
     mkdir /home/dummy &&
     cp -a . /home/dummy &&
     rm -r ./*
     rm -r ./.*
    #  rm -r ./*.*
    fi
}
# this function will help the fetch the project
fetch_project(){
   inside_git_repo="$(git rev-parse --is-inside-work-tree 2>/dev/null)"
    if [ "$inside_git_repo" ]; then
      echo "you are inside git repo"
       git remote set-url origin https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms-backend.git &&
       git branch -a &&
       git fetch origin master
    else
      echo "you are not in git repo"
      remove_old_content &&
      git clone -b master https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms-backend.git .
    fi
    # git --version &&
    # if [ "$(ls -A $dir)" ] 
    # then
    #   git remote set-url origin https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms-backend.git &&
    #   git branch -a &&
    #   git fetch origin master
    # else
    #   git clone -b master https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms-backend.git .
    # fi 
    
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
 fetch_project && 
 run_project
else
 fetch_project && 
 build_project &&
 run_project
fi
