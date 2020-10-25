FROM gradle:jdk10
USER root
RUN apt update && \
    apt-get install -y libgdal-dev g++  git -o APT::Immediate-Configure=0 --no-install-recommends 
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle docker-entrypoint.sh  /entrypoint.sh
RUN chmod a+x /entrypoint.sh
# COPY --chown=gradle:gradle ./code /home/gradle/src
ENTRYPOINT ["/entrypoint.sh"]
