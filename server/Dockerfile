FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
RUN npm Install

# Bundle app source
COPY . .

EXPOSE 8081
CMD [ "npm", "start" ]