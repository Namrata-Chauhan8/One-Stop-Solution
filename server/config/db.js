import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    if (conn) {
      console.log(`MongoDB connected ${mongoose.connection.host}`);
    } else {
      console.log(`MongoDB connection failed`);
    }
  } catch (error) {
    console.log(`MongoDB Error ${error}`);
  }
};

export default connectDb;
