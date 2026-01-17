import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

let db;

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connectDB = async () => {
  if (db) return db;

  try {
    await client.connect();
    db = client.db("FreshFetch");
    console.log("✅ MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

export { ObjectId };