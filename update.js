const {MongoClient} = require('mongodb');
require('dotenv').config()

async function main(){
    const uri = DB_URL
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('DB Connected')
        await listDatabases(client);
        // await updateListingByName(client, "Infinite Views", { bedrooms: 6, beds: 8 });
        await upsertListingByName(client, "Cozy Cottage", { beds: 3 });


      
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
 //Takes three parameters Client, nameOfListing and Updated Item ## updateOne ##

const updateListingByName = async(client,nameOfListing,updatedListing) =>{
    const result = await client.db('sample_airbnb').collection('listingsAndReviews').updateOne({name:nameOfListing},{$set:updatedListing})

    console.log(`${result.matchedCount} documents(s) matched the criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
    
}

// Upsert Listing By Name -- Update or Insert item

const upsertListingByName = async(client,nameOfListing,updatedListing) =>{
    const result = await client.db('sample_airbnb').collection('listingsAndReviews')
                        .updateOne(
                            {name:nameOfListing},
                            {$set:updatedListing},
                            { upsert: true }
                            )

    if(result.upsertCount > 0){
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    }else{
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    } 
}


//updateMany 
async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
                    .updateMany({ property_type: { $exists: false } }, { $set: { property_type: "Unknown" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}