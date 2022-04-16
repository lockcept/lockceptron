FROM node:16

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn
RUN yarn global add pm2
RUN yarn global add ts-node

COPY . .

RUN pm2 install typescript
CMD ["pm2-runtime", "start", "./src/app.ts", "--name", "lockceptronstart"]
