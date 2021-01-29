#!/bin/bash

collection=$1

echo "Removing old data file."
rm sample-data/$collection.json

# exporting collection from database.
mongoexport --db marketplace --collection $collection --out sample-data/$collection.json
