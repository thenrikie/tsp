FROM node:6.11.2-alpine
ADD . /tsp
WORKDIR /tsp
RUN npm install
CMD [ "node", "app" ]
