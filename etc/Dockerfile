FROM node:18.18-alpine
WORKDIR /podcast-ui
ARG VUE_APP_API_URL
ARG VUE_APP_WS_URL

RUN apk add yarn

COPY ../package.json .
COPY ../yarn.lock .

RUN yarn install

COPY ../babel.config.js .
COPY ../src ./src

CMD ["yarn", "build"]
