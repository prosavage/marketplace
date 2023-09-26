#!/bin/bash

collection=$1

ssh demo-server mongoimport --collection $collection --db marketplace --file /root/marketplace-demo/sample-data/$collection.json --port 27018
# mongoimport --collection resources --db marketplace --file /sample-data/resources.json
# mongoimport --collection versions --db marketplace --file /sample-data/versions.json
# mongoimport --collection categories --db marketplace --file /sample-data/categories.json
# mongoimport --collection reviews --db marketplace --file /sample-data/reviews.json
# mongoimport --collection sellers --db marketplace --file /sample-data/sellers.json
# mongoimport --collection payments --db marketplace --file /sample-data/payments.json