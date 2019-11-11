FROM g2glab/g2g:0.3.5

ARG HOST=http://localhost
ARG PORT=8080

ENV G2GSANDBOX_EXTERNAL_HOST $HOST
ENV G2GSANDBOX_EXTERNAL_PORT $PORT

RUN apt-get update \
 && apt-get install -y \
    graphviz

WORKDIR /opt/sandbox

COPY . .

RUN npm install

ENTRYPOINT ["node", "src/server.js"]