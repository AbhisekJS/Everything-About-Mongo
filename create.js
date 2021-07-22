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
        
        //create single listing
        await createListing(client,
            {
                name: "Lovely Loft",
                summary: "A charming loft in Paris",
                bedrooms: 1,
                bathrooms: 1
            }
        );
        //create multiple listings
        // await createMultipleListings(client, [
        //     {
        //         name: "Infinite Views",
        //         summary: "Modern home with infinite views from the infinity pool",
        //         property_type: "House",
        //         bedrooms: 5,
        //         bathrooms: 4.5,
        //         beds: 5
        //     },
        //     {
        //         name: "Private room in London",
        //         property_type: "Apartment",
        //         bedrooms: 1,
        //         bathroom: 1
        //     },
        //     {
        //         name: "Beautiful Beach House",
        //         summary: "Enjoy relaxed beach living in this house with a private beach",
        //         bedrooms: 4,
        //         bathrooms: 2.5,
        //         beds: 7,
        //         last_review: new Date()
        //     }
        // ]);
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

// Create Listings

const createListing = async (client, newListing)=>{

    const result = await client.db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertOne(newListing);
    
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// Create Multiple Listings

const createMultipleListings= async(client, newListings)=>{

    const result = await client.db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}
