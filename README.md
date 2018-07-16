# browser

## Pre-requirement

* Git
* Node
* Jena (+ Java)
* Graphviz

    $ sudo yum -y install git graphviz

## Install

    $ git clone https://github.com/g2gml/browser.git
    $ cd browser
    $ npm install
    $ cp index.html /var/www/html/

    $ git clone https://github.com/g2gml/g2gml.git
    $ cd g2gml
    $ npm install
    $ npm link

    $ git clone https://github.com/g2gml/pg.git
    $ cd pg
    $ npm install
    $ npm link

## Run

    $ cd browser
    $ sh restart-server.sh

