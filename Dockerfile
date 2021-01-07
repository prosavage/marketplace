FROM node:12

USER root

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install

# App runs on port 5000
EXPOSE 5000

WORKDIR /usr/src/app/packages/server

RUN npm install -g typescript

RUN tsc

# Start the server!
CMD [ "npm", "run", "prod" ]