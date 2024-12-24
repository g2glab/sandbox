# G2G Sandbox

`version 0.2.3`

## Web Application

You can find the sandbox at https://purl.org/g2gml

## Local usage

### Use with Docker

You can run the sandbox using Docker as follows:

    $ docker run -d \
      -p 8080:8080 \
      -v $HOME/sandbox_data:/opt/sandbox/static/tmp/ \
      --name sandbox \
      g2glab/sandbox:0.2.3

Alternatively, you can build the image locally:

    $ git clone https://github.com/g2glab/sandbox.git
    $ cd sandbox
    $ docker build -t g2g_sandbox .
    $ docker run -d \
    -p 8080:8080 \
    -v $HOME/sandbox_data:/opt/sandbox/static/tmp/ \
    --name sandbox \
    g2g_sandbox

When the container is running you can access the sandbox at http://localhost:8080

### Use without Docker

You can install the sandbox locally without Docker, but be sure that *all*  requirements listed below are installed on your machine and available in your $PATH.

* Git
* Node
* Java
* [Apache Jena](https://jena.apache.org/download/index.cgi#apache-jena)
* [Graphviz](https://graphviz.gitlab.io/download/)
* [G2G](https://github.com/g2glab/g2g) + [PG](https://github.com/g2glab/pg) 
  
---
Install:

    $ git clone https://github.com/g2glab/sandbox.git
    $ cd sandbox
    $ npm install

Run:

    $ cd sandbox
    $ npm start
