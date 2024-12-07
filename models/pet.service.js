async function getCollection(callback){
  try {
    // await database.connectDB();
    console.log("Connected to MongoDB");
    const client = await database.getClient();
    const db = client.db("Tamadoro");
    const collection = db.collection("pet");

    return await callback(collection);

    
  } catch (err) {
    console.error(err);
  } finally {
    // await database.client.close();
  }
}


module.exports = {
  getPet: async (userId) => {
    return await getCollection(async (collection) => {
      return await collection.find({ userId }).toArray();
    });
  },

  createPet: async (task) => {
    return await getCollection(async (collection) => {
      const result = await collection.insertOne({
        ...task,
        id: new ObjectId().toString() // Ensure each task has a unique id
      });
      return { ...task, id: result.insertedId };
    });
  },

  updatePet: async (id, updatedData) => {
    return await getCollection(async (collection) => {
      console.log('update task', [
        { id },
        { $set: updatedData },
        { returnDocument: 'after' }
      ])
      console.log('update task payload', updatedData)
      return await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedData },
        { returnDocument: 'after' }
      );
    });
  }
};



