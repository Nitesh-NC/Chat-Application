const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("connected to database");
    });
    connection.on("error", (error) => {
      console.log("error connection in db", error);
    });
  } catch (error) {
    console.log("something is wrong", error);
  }
};

module.exports = connectionDB