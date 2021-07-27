const {MongoClient} = require('mongodb');
require('dotenv').config()

async function main(){
    const uri = process.env.DB_URL
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('DB Connected')
        // await listDatabases(client)
        
        // await findListingByName(client,"Ribeira Charming Duplex")
        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });
        
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



//Find One By Listing By Name

const findListingByName= async(client, nameOfListing)=> {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the db with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

// Find Listings with minimum bedroom(s) bathroom(s) and most recent review(s)

const findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews=async(client,{  
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {})=>{

    //this will return a cursor

    const cursor = client.db('sample_airbnb').collection("listingsAndReviews")
    .find({
        bedrooms: {$gte:minimumNumberOfBathrooms},
        bathrooms: {$gte:minimumNumberOfBathrooms}
    }
    ).sort({last_review:-1})
    .limit(maximumNumberOfResults)

    const results= await cursor.toArray();

    //print the results

    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}