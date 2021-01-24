FROM node:15

USER root

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# CRITICAL TO GET NODEJS MONOREPO PROJECT WORKING SMH.
COPY packages/server/package*.json ./packages/server/

# install dependencies
RUN yarn

# Bundle app source
COPY . .

# App runs on port 5000
EXPOSE 5000

WORKDIR /usr/src/app/packages/server

RUN yarn run build

# # Start the server!
CMD [ "yarn", "run", "prod" ]