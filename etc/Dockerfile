FROM node:18.18-alpine
WORKDIR /podcast-ui

RUN apk add yarn

COPY ../package.json .
COPY ../yarn.lock .

RUN yarn install

COPY ../babel.config.js .
COPY ../src ./src

CMD ["yarn", "build"]
