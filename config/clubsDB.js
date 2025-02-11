const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectClubDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI,{dbName: "clubsDB"});
        console.log("MongoDB connected for clubsDB");
    } catch (error) {
        console.error("MongoDB connection error: ", error);
        process.exit(1); // Exit process with failure
    }
 };

 module.exports = connectClubDB;
 