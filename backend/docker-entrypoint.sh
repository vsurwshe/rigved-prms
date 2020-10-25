#!/bin/sh
pwd
runFile="build/libs/RVProjectManagement-0.0.1.jar"
dir= pwd
# this function will help the fetch the project
fetch_project(){
    git --version &&
    if [ "$(ls -A $dir)" ] 
    then
      git remote set-url origin https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms-backend.git &&
      git branch -a &&
      git fetch origin master
    else
      git clone -b master https://developer0688:Vishvanath1@gitlab.com/joshi.rites/rigved-prms-backend.git .
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
 fetch_project && 
 run_project
else
 fetch_project && 
 build_project &&
 run_project
fi
