# Sandbox Web Application

version 0.1.0

## Requirements

* Git
* Node
* Java + Jena
* Graphviz
* G2G + PG

Example of their installation process:

    $ sudo yum -y install git graphviz
    $ tar xvJf node-v8.9.1-linux-x64.tar.xz
    ...

## Install

    $ git clone -b v0.1.0 https://github.com/g2glab/sandbox.git
    $ cd sandbox
    $ npm install
    $ cp index.html /var/www/html/

    $ git clone -b v0.1.0 https://github.com/g2glab/g2g.git
    $ cd g2g
    $ npm install
    $ npm link

    $ git clone -b v0.1.0 https://github.com/g2glab/pg.git
    $ cd pg
    $ npm install
    $ npm link

## Run

    $ cd sandbox
    $ sh restart-server.sh
