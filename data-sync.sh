echo "starting ssh sync."

echo "exporting data from current database."
./data-export.sh users
./data-export.sh resources
./data-export.sh versions
./data-export.sh categories
./data-export.sh reviews

echo "sending sample-data to server."
echo "SSH PASSWORD REQUIRED:"
scp -r sample-data/ marketplace:~/

echo "using ssh to export data to mongodb data container."
echo "assuming mongodb container is root_mongo_1, make sure it's the right container if something went wrong."
# docker cp ~/sample-data/ root_mongo_1:~/



echo "finished importing all data."
