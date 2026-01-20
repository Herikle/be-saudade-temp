FROM node:24-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY src ./src

COPY . .

RUN npm install
RUN npm run build

FROM node:24-slim

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY src ./src
RUN npm install
COPY --from=0 /usr/src/app/dist ./dist
EXPOSE 8080

RUN npm run build

CMD npm start