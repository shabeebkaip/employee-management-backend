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
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(parseInt(limit)).exec();

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: users,
      pagination: {
        total: totalUsers,
        totalPages,
        currentPage: parseInt(page),
      },
      message: "Users fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

export { createUser, getUsers };
