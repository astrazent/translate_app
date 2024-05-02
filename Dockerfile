FROM node:14-alpine

WORKDIR /translateApp

COPY package*.json ./

RUN npm install

COPY . .
CMD [ "npm", "run", "start"]

# docker build --tag translate-app .
# docker run -p 8080:8080 -d translate-app
#docker stop <id>
#docker rename abc_xyz infinty_translate

#docker stop $(docker ps -a -q)