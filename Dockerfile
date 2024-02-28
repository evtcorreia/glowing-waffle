FROM node:20-alpine3.16

WORKDIR /app

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories
RUN apk update
RUN apk add mongodb mongodb-tools
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -

ENV MONGOMS_SYSTEM_BINARY=/usr/bin/mongod

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . ./

EXPOSE 3000
EXPOSE 9000

CMD pnpm dev