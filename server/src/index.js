import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 6000, () => {
      console.log(`Server is running on PORT : ${process.env.PORT || 6000}`);
    })
  })
  .catch((error) => {
    console.log("MONGO_DB Connected failed : ", error);
  });

