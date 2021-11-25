FROM node:16.13-alpine3.13 as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN ls -la

COPY . .

RUN npm run build

FROM node:16.13-alpine3.13 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# comment out to avoid having all files
# remove comment if you wanna exec tests for instance

COPY --from=development /usr/src/app/dist ./

RUN ls -la

EXPOSE 4000 4001

CMD ["npm", "run", "start:prod"]