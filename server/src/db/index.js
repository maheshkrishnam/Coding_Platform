import mongoose from "mongoose";

// connecting to mongodb database
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`MONGO_DB Connected at PORT ${process.env.PORT}`);
    // console.log(`connectionInstance : `, connectionInstance);
  } catch (error) {
    console.log("MONGO_DB Connection error occured : ", error);
    process.exit(1);
  }
}

export default connectDB;