import mongoose from "mongoose";
import envConfig from "./env.config.mjs";

// Para conectar a MongoDb Atlas según documentación
const mongoUri = envConfig.MONGO_URI;
export { mongoUri };
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export const initializeMongoDb = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(mongoUri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.log(error);
  }
};

export const disconnectMongoDb = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.log(error);
  }
};
