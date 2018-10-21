FROM node:8

WORKDIR /opt/mw-bank

COPY yarn.lock package*.json ./

RUN yarn

COPY . .

EXPOSE 8080
CMD ["yarn", "start"]