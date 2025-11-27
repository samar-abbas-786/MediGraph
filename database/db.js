import mongoose from "mongoose";

const db = () => {
  if (!process.env.MONGO_URI) {
    console.log("No MONGO_URI");
    return;
  }
  try {
    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB Connected");
    });
  } catch (error) {
    console.log("Failed to Connect with database");
  }
};

export default db;
