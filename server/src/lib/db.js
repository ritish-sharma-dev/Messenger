import mongoose from "mongoose";

// FUNCTION TO CONNECT TO THE MONGODB DATABASE
export const connectDB = async () => {
  try {
    // EVENT LISTENER FOR WHEN THE MONGOOSE CONNECTION IS SUCCESSFUL
    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    })

    // CONNECTS MONGOOSE TO THE MONGODB SERVER
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
} catch (error) {
    console.log(`Database Not Connected : ${error}`);
  }
};



