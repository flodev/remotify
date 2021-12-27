FROM node:16.13-alpine3.13 as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ADD db db
ADD src src
ADD test test
ADD knexfile.ts .
ADD tsconfig.build.json .
ADD tsconfig.json .
ADD knexfile.ts .
ADD nest-cli.json .
RUN ls db
RUN npm run build
FROM node:16.13-alpine3.13 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=development /usr/src/app/dist ./
EXPOSE 4000 4001
CMD ["npm", "run", "start:prod"]