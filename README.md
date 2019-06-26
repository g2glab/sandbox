# Sandbox Web Application

version 0.1.2

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

=====================================================

# Use with Docker

After cloning the repository to your local machine you can build a Docker image with the included Dockerfile

    $ docker build -t sandbox .

For running a container from the built image, use the following command

    $ docker run -d -p 8010:80 -p 8011:8080 --name sandbox sandbox
    $ docker exec sandbox service apache2 start

You can then access the sandbox via http://localhost:8010 on your machine.

For future versions using Docker compose is being considered.