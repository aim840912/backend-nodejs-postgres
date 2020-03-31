FROM node:12.16.1-alpine3.9 as prod

ENV NODE_ENV=production 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production && npm cache clean --force

COPY . . 

EXPOSE 8080

CMD [ "npm", "start" ]

# FROM prod as dev
# ENV NODE_ENV=development
# RUN npm install --only=production
# CMD [ "env-cmd","./config/dev.env nodemon", "src/index.js" ]

# FROM dev as test
# ENV NODE_ENV=development
# CMD [ "npm","test" ]