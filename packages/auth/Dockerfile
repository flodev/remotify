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
COPY hasura hasura
COPY metadata.json ./
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-2.31-r0.apk
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-bin-2.31-r0.apk
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-i18n-2.31-r0.apk
RUN apk add glibc-2.31-r0.apk glibc-bin-2.31-r0.apk glibc-i18n-2.31-r0.apk
RUN /usr/glibc-compat/bin/localedef -i en_US -f UTF-8 en_US.UTF-8
RUN apk add --no-cache libstdc++
EXPOSE 4000 4001
CMD ["npm", "run", "start:prod"]