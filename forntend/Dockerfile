FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Copy shell file
COPY docker-entrypoint.sh /entrypoint.sh
# make executeable file
RUN chmod a+x /entrypoint.sh && chown root:root /entrypoint.sh
EXPOSE 4001
ENTRYPOINT ["/entrypoint.sh","developer0688","Vishvanath1"]