FROM g2gml/g2g:0.3.4

ENV G2GSANDBOX_EXTERNAL_HOST http://localhost
ENV G2GSANDBOX_EXTERNAL_PORT 8080

RUN apt-get update \
 && apt-get install -y \
    graphviz

WORKDIR /opt/sandbox

COPY . .

RUN npm install

ENTRYPOINT ["node", "src/server.js"]