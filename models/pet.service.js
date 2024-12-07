const database = require('../database'); 
const { ObjectId } = require('mongodb');
// console.log(client)


async function updateSessionCount(userdata){
    console.log("entered saveData" );
  try {
    // await database.connectDB();
    console.log("Connected to MongoDB");
    const client = await database.getClient();
    const db = client.db("Tamadoro");
    const collection = db.collection("users");

    // Check if the user exists, if so, don't create the user
    
    
    

    
  } catch (err) {
    console.error(err);
  } finally {
    // await database.client.close();
  }
}




module.exports = {updateSessionCount}