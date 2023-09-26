echo "starting ssh sync."

echo "exporting data from current database."
./data-export.sh users
./data-export.sh resources
./data-export.sh versions
./data-export.sh categories
./data-export.sh reviews
./data-export.sh sellers
./data-export.sh payments

echo "sending sample-data to server."
scp -r sample-data/ demo-server:~/marketplace-demo

./mongodb-import.sh users
./mongodb-import.sh resources
./mongodb-import.sh versions
./mongodb-import.sh categories
./mongodb-import.sh reviews
./mongodb-import.sh sellers
./mongodb-import.sh payments

echo "finished importing all data."
