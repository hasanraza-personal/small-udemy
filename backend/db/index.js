const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb://localhost:27017");
    await mongoose.connect(
      "mongodb+srv://harshstocksmarket:gQ37d3mZbEfDzWHg@cluster0.8pntec3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log(`MongoDb connected`);
  } catch (error) {
    console.error("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
