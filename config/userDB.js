const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
   try {
       await mongoose.connect(process.env.MONGODB_URI,{dbName: "test"});
       console.log("MongoDB connected for test");
   } catch (error) {
       console.error("MongoDB connection error: ", error);
       process.exit(1); // Exit process with failure
   }
};

module.exports = connectDB;
