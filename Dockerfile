FROM g2gml/g2g:0.3.4

RUN apt-get update \
 && apt-get install -y \
    apache2 \
    graphviz

RUN cd /opt \
 && git clone -b v0.1.1 https://github.com/g2glab/sandbox.git \
 && cd sandbox \
 && npm install \
 && cp index.html /var/www/html/

RUN service apache2 start

WORKDIR /work
