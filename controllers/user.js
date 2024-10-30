import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import jwt

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    // Generate JWT token after user registration
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email }, // Payload with user ID and email
      process.env.JWT_KEY, // Secret key from environment variables
      { expiresIn: "1h" } // Set token expiration time
    );

    res.status(201).json({
      data: newUser,
      success: true,
      statusCode: 201,
      message: "Registered Successfully",
      token, // Include the token in the response
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      success: false,
      statusCode: 404,
    });
  }
};

export { createUser, getUsers };
