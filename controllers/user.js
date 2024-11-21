import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import jwt
import db from "../config/db.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body, "req.body");
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    let [lastUserId] = await db.query("SELECT MAX(id) as id FROM users");
    console.log(lastUserId[0].id);
    let userid = lastUserId[0].id ? lastUserId[0].id + 1 : 1;
    if (existingUser.length) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      "INSERT INTO users (id, name, email, password) VALUES (?,?,?,?)",
      [userid, name, email, hashedPassword]
    );
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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

export { createUser, getUsers, deleteUser };
