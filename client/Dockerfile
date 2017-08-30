FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
RUN npm install
RUN npm install -g serve

# Bundle app source
COPY /build/ ./build

EXPOSE 5000
CMD [ "serve", "-s", "build" ]