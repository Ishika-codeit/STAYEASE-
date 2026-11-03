const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/stayease";

  if (primaryUri) {
    try {
      console.log("Attempting to connect to MongoDB Atlas...");
      await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log("MongoDB Atlas connected successfully ✅");
      return;
    } catch (atlasErr) {
      console.warn("⚠️  Atlas connection failed or timed out (IP whitelist / network).");
      console.warn(`Reason: ${atlasErr.message}`);
      console.log(`🔄 Falling back to local MongoDB (${localUri})...`);
    }
  }

  try {
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log("Local MongoDB connected successfully ✅");
  } catch (localErr) {
    console.error("❌ Both Atlas and Local MongoDB connections failed!");
    console.error(localErr.message);
    process.exit(1);
  }
};

module.exports = connectDB;