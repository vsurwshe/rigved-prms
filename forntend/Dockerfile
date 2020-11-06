FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
# COPY . .
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh && chown root:root /entrypoint.sh
EXPOSE 4001
# CMD [ "npm", "start" ]
ENTRYPOINT ["/entrypoint.sh"]