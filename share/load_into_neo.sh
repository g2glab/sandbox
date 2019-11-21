#!/bin/bash

ID=`cd share && ls -I load_into_neo.sh -t | head -n1`
NEO_DIR="./share/${ID}/neo/"

rm -rf data/databases/graph.db/

neo4j-admin import \
  --database=graph.db \
  --nodes=${NEO_DIR}/tmp.neo.nodes \
  --relationships=${NEO_DIR}/tmp.neo.edges \
  --delimiter='\t'

chown -R root:root /data

kill 1 # kill itself to restart

