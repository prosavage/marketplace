echo "starting ssh sync."

echo "exporting data from current database."
./data-export.sh users
./data-export.sh resources
./data-export.sh versions
./data-export.sh categories
./data-export.sh reviews

echo "sending sample-data to server."
echo "SSH PASSWORD REQUIRED:"
scp -r sample-data/ marketplace:/

echo "using ssh to export data to mongodb data container."
echo "assuming mongodb container is root_mongo_1, make sure it's the right container if something went wrong."
ssh marketplace "
    docker cp ~/sample-data/ root_mongo_1:/
    docker container exec -it root_mongo_1 mongoimport --collection users --db marketplace --file /sample-data/users.json
    
"
# mongoimport --collection resources --db marketplace --file /sample-data/resources.json
#     mongoimport --collection versions --db marketplace --file /sample-data/versions.json
#     mongoimport --collection categories --db marketplace --file /sample-data/categories.json
#     mongoimport --collection reviews --db marketplace --file /sample-data/reviews.json

echo "finished importing all data."
