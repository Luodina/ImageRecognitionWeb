FROM node:8-alpine

COPY Basic/ /app
COPY config.js /app/build-server/config.js

EXPOSE 9000

WORKDIR /app

CMD ["node", "build-server/app.js"]
