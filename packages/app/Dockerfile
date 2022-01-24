FROM node:16.13-alpine3.13
WORKDIR '/app'
COPY ./tilt-package.json package.json
RUN npm install --force
COPY . .
EXPOSE 3000

CMD ["npm", "run", "start"]