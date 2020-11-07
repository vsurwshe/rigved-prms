FROM gradle:jdk10
USER root
# Create app directory
WORKDIR /home/gradle/src
# Copy shell file
COPY --chown=gradle:gradle docker-entrypoint.sh  /entrypoint.sh
# make executeable file
RUN chmod a+x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh","developer0688","Vishvanath1"]
