# Sandbox

## Pre-requirement

* Git
* Node
* Jena (+ Java)
* Graphviz

Example of their installation process:

    $ sudo yum -y install git graphviz
    $ tar xvJf node-v8.9.1-linux-x64.tar.xz
    ...

## Install

    $ git clone https://github.com/g2gml/sandbox.git
    $ cd sandbox
    $ npm install
    $ cp index.html /var/www/html/

    $ git clone https://github.com/g2gml/g2g.git
    $ cd g2g
    $ npm install
    $ npm link

    $ git clone https://github.com/g2gml/pg.git
    $ cd pg
    $ npm install
    $ npm link

## Run

    $ cd sandbox
    $ sh restart-server.sh
