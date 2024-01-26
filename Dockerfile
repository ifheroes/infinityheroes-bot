FROM node:16.20.2

WORKDIR /bot
COPY /bot ./ 

RUN npm install
RUN mkdir /bot/exports

WORKDIR /bot
COPY /bot ./ 

RUN npm run deploy
CMD npm run start