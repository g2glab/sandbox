FROM g2gml/g2g:0.3.4

RUN apt-get update \
 && apt-get install -y \
    apache2 \
    graphviz

WORKDIR /opt/sandbox

RUN cd /opt \
 && git clone -b v0.1.1 https://github.com/g2glab/sandbox.git \
 && cd sandbox \
 && npm install \

RUN cp index.* /var/www/html/ \ 
 && cp -r /opt/sandbox/img /var/www/html/

CMD ["service", "apache2", "start"]