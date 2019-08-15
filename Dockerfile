FROM alpine:3.9

ENV NODE_VERSION 8.16.0

COPY . /srv/

WORKDIR /srv


RUN apk update
RUN  apk add npm

RUN npm install

CMD /srv/tickets/node ticket_manage.js
