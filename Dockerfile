FROM g2gml/g2g:0.3.4

RUN apt-get update \
 && apt-get install -y \
    apache2 \
    graphviz

RUN cd /opt \
 && git clone -b v0.1.1 https://github.com/g2glab/sandbox.git \
 && cd sandbox \
 && npm install

WORKDIR /opt/sandbox

RUN cp index.* /var/www/html/ \ 
 && cp -r /opt/sandbox/img /var/www/html/

ENTRYPOINT ["sh", "restart-server.sh"]