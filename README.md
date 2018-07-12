# browser

## Pre-requirement

* Git
* Node
* Jena (+ Java)

## Install

    $ cd
    $ git clone https://github.com/g2gml/browser.git
    $ cd ~/browser
    $ npm install
    $ cp index.html /var/www/html/

    $ cd
    $ git clone https://github.com/g2gml/g2gml.git
    $ npm install
    $ npm link
    $ mkdir /var/www/html/g2gml
    $ cp -r examples /var/www/html/g2gml/

    $ cd
    $ git clone https://github.com/g2gml/pg.git
    $ npm install
    $ npm link

    $ yum install graphviz
