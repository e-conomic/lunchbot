FROM node:9.9.0-alpine

USER node
WORKDIR /home/node

COPY . .
RUN npm install

EXPOSE 3000 80

CMD npm start