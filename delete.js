// import packages
const {MongoClient} = require('mongodb');
require('dotenv').config()

//define main function
async function main(){
    const uri = process.env.DB_URL
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('DB Connected')
        // await listDatabases(client)
        // await deleteListingScrappedBeforeDate(client, new Date("2019-02-15"))
        await deleteListingByName(client, "Lovely Loft")
      
        
    } catch(e){
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

// List Of Databases

const listDatabases = async(client)=>{
const databaseList= await client.db().admin().listDatabases();
databaseList.databases.forEach(db=> console.log(`-${db.name}`))
}


/**
 * Delete an Airbnb listing with the given name
 * @param {MongoClient} client A MongoClient that is connected to a cluster with sample_airbnb database
 * @param {string} nameOfListing The name of the listing you want to be deleted
 */
const deleteListingByName=async(client,nameOfListing)=>{
    const result = await client.db("sample_airbnb").collection('listingsAndReviews').deleteOne({name:nameOfListing});
    console.log(`${result.deletedCount} documents(s) were deleted.`);
}

/**
 * 
 * @param {MongoClient} client A client that is connected to a cluster with the 'sample_Airbnb' database
 * @param {*} date The date to check the last scrapped property against
 */

const deleteListingScrappedBeforeDate = async(client,date)=>{
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}