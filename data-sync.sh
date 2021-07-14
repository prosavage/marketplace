echo "starting ssh sync."

echo "exporting data from current database."
./data-export.sh users
./data-export.sh resources
./data-export.sh versions
./data-export.sh categories
./data-export.sh reviews
./data-export.sh sellers
./data-export.sh payments
./data-export.sh teams
./data-export.sh webhooks
./data-export.sh invites
./data-export.sh downloads
./data-export.sh release-channels
./data-export.sh tokens


echo "sending sample-data to server."
echo "SSH PASSWORD REQUIRED:"
scp -r sample-data/ savagelabs-na:~/

echo "using ssh to export data to mongodb data container."
echo "assuming mongodb container is root_mongo_1, make sure it's the right container if something went wrong."
# docker cp ~/sample-data/ root_mongo_1:/



echo "finished importing all data."
