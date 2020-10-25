FROM gradle:jdk10 as builder
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle docker-entrypoint.sh  /entrypoint.sh
RUN chmod a+x /entrypoint.sh
COPY --chown=gradle:gradle ./code /home/gradle/src
ENTRYPOINT ["/entrypoint.sh"]
