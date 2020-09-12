# develop stage
FROM node:12.8.0 as develop-stage
WORKDIR /home/app/webskit-cmp
RUN apt-get -y update \
  && apt-get install -y git
COPY package.json /home/app/webskit-cmp/package.json
COPY yarn.lock /home/app/webskit-cmp/yarn.lock
RUN yarn config set unsafe-perm true
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/app/webskit-cmp/node_modules/.bin
RUN yarn
COPY . .
EXPOSE 8081
RUN ["chmod", "+x", "start.sh"]
ENTRYPOINT ["./start.sh"]

# build stage
FROM develop-stage as build-stage
RUN npm run build

# production stage
FROM nginx:1.15.7-alpine as production-stage
COPY --from=build-stage /home/app/webskit-cmp/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

