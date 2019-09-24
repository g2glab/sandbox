# Sandbox Web Application

version 0.1.6

## Use with Docker

You can run the sandbox using the latest published image as follows:

    $ docker run -d \
      -p 8080:8080 \
      -v $HOME/sandbox_data:/opt/sandbox/static/tmp/ \
      --name sandbox \
      g2glab/sandbox:0.1.6

Alternatively, you can build an image locally if you have cloned the repository to your machine:

    $ cd $SANDBOX_PATH
    $ docker build -t g2g_sandbox .
    $ docker run -d \
    -p 8080:8080 \
    -v $HOME/sandbox_data:/opt/sandbox/static/tmp/ \
    --name sandbox \
    g2g_sandbox

When the container is running you can access the sandbox on http://localhost:8080

## Use without Docker

### Requirements

* Git
* Node
* Java + Jena
* Graphviz
* G2G + PG

Example of their installation process:

    $ sudo yum -y install git graphviz
    $ tar xvJf node-v8.9.1-linux-x64.tar.xz
    ...

### Install

    $ git clone https://github.com/g2glab/sandbox.git
    $ cd sandbox
    $ npm install
    $ export G2GSANDBOX_EXTERNAL_HOST="http://localhost"
    $ export G2GSANDBOX_EXTERNAL_PORT="8080"

    $ git clone https://github.com/g2glab/g2g.git
    $ cd g2g
    $ npm install
    $ npm link

    $ git clone https://github.com/g2glab/pg.git
    $ cd pg
    $ npm install
    $ npm link

### Run

    $ cd sandbox
    $ npm start
