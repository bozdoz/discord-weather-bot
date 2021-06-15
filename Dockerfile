FROM node:14.17-alpine3.11

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --no-progress --frozen-lockfile

COPY src src

RUN chown -R node:node /app

USER node

CMD [ "yarn", "start" ]
