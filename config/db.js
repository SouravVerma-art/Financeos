const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully...");

  } catch (err) {
  console.error(`❌ MongoDB Connection Error: ${err.message}`);
  throw err; // let the platform log the error without killing everything
}
};

module.exports = connectDB;
