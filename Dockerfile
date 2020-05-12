FROM node:12.16.1-alpine3.9 as prod

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]