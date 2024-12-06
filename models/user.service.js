const database = require('../database'); 
const { ObjectId } = require('mongodb');
// console.log(client)


async function saveUserData(userdata){
    console.log("entered saveData" );
  try {
    // await database.connectDB();
    console.log("Connected to MongoDB");
    const client = await database.getClient();
    const db = client.db("Tamadoro");
    const collection = db.collection("users");

    // Check if the user exists, if so, don't create the user
    const foundUser = await checkUserExists(userdata.email, collection) 
    if (foundUser){
      return foundUser;
    }
    
    // Add a user
    const user = {
      userID: new ObjectId(),
      email: userdata.email,
      family_name: userdata.family_name,
      given_name: userdata.given_name,
    };

    const result = await collection.insertOne(user);
    console.log("User added:", result.insertedId);
    return user

    
  } catch (err) {
    console.error(err);
  } finally {
    // await database.client.close();
  }
}


async function checkUserExists(email, collection){
  
  const foundUser = await collection.findOne({
    email,
  });
  console.log(foundUser)
  return foundUser;
}

module.exports = {saveUserData}