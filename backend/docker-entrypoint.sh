#!/bin/sh
java --version
gradle --version
pwd
runFile="build/libs/RVProjectManagement-0.0.1.jar"
if [ -f "$runFile" ] 
then
 java -jar $runFile
else
 gradle build --no-daemon --stacktrace
fi
