FROM gradle:4.10.0-jdk8-alpine AS build
# ENV APP_HOME=/usr/app/
# WORKDIR $APP_HOME
# COPY build.gradle settings.gradle $APP_HOME
# COPY .gradle $APP_HOME/.gradle
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
# USER root
# RUN chown -R gradle /home/gradle/src
# RUN gradle build || return 0
# COPY . .
# WORKDIR /home/gradle/src
RUN gradle tasks --no-daemon --stacktrace
RUN gradle build --no-daemon --stacktrace

FROM anapsix/alpine-java
ENV ARTIFACT_NAME=RVProjectManagement-0.0.1-SNAPSHOT.jar
# ENV APP_HOME=/usr/app/

# RUN mkdir /app
# COPY build/libs/*.jar /app/spring-boot-application.jar
# WORKDIR $APP_HOME
COPY --from=build /home/gradle/src/build/libs/$ARTIFACT_NAME .
EXPOSE 9002
ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseCGroupMemoryLimitForHeap", "-Djava.security.egd=file:/dev/./urandom","-jar","/app/spring-boot-application.jar"]

