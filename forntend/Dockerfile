# pull official base image
FROM node:13.12.0-alpine as build
# set working directory
WORKDIR /app
RUN apk add build-base \
  git \
  openssh-client \
&& rm -rf /var/cache/apk/*
ENV PATH /app/node_modules/.bin:$PATH
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh && chown root:root /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
