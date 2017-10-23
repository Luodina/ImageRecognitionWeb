FROM node:8-alpine
WORKDIR /app
COPY node_modules node_modules/
COPY build-server build-server/
COPY dist dist/


EXPOSE 9000

CMD ["node", "build-server/app.js"]
