async function saveUserData(userdata){
    console.log("entered saveData");
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("Tamadoro");
    const collection = db.collection("users");

    // Add a user
    const user = {
      userID: new ObjectId(),
      email: userdata.email,
      family_name: userdata.family_name,
      given_name: userdata.given_name,
    };

    const result = await collection.insertOne(user);
    console.log("User added:", result.insertedId);

    // Find a user by email
    const foundUser = await collection.findOne({
      email: "example@example.com",
    });
    console.log("User found:", foundUser);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

// console.log("entered saveData");
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB");
//     const db = client.db("Tamadoro");
//     const collection = db.collection("users");

//     // Add a user
//     const user = {
//       userID: new ObjectId(),
//       email: userdata.email,
//       family_name: userdata.family_name,
//       given_name: userdata.given_name,
//     };

//     const result = await collection.insertOne(user);
//     console.log("User added:", result.insertedId);

//     // Find a user by email
//     const foundUser = await collection.findOne({
//       email: "example@example.com",
//     });
//     console.log("User found:", foundUser);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     await client.close();
//   }