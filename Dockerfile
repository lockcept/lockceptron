FROM node:16

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn
RUN yarn global add ts-node

COPY . .

CMD ["ts-node", "./src/app.ts"]
