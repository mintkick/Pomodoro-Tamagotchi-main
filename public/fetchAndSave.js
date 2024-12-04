require("dotenv").config();
import { get } from "axios";
import { connect, disconnect } from "mongoose";
import User from "./models/User";

// MongoDB connection
connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Fetch data from the API and save to MongoDB
async function fetchAndSaveUserData() {
  try {
    // Fetch user data from the API
    const response = await get(
      "https://pomodoro-tamagotchi-main.onrender.com/user"
    );
    const userData = response.data;

    // Save user data to MongoDB
    const user = new User({
      userID: userData.userID,
      email: userData.email,
      password: userData.password, // Ensure it's hashed
      name: userData.name,
    });

    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser);
  } catch (error) {
    console.error("Error fetching or saving user data:", error);
  } finally {
    disconnect();
  }
}

fetchAndSave();
