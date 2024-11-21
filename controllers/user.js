import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "User already exists",
      });
    }

    let [lastUserId] = await db.query("SELECT MAX(id) AS id FROM users");
    const userId = lastUserId[0]?.id ? lastUserId[0].id + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.query(
      "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
      [userId, name, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: newUser.insertId, email }, // Use insertId for the new user's ID
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Registered successfully",
      data: { id: userId, name, email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;
    const [users] = await db.query("SELECT * FROM users LIMIT ?, ?", [
      skip,
      parseInt(limit),
    ]);

    const [totalUsers] = await db.query("SELECT COUNT(*) AS total FROM users");
    const totalPages = Math.ceil(totalUsers[0]?.total / limit);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Users fetched successfully",
      data: users,
      pagination: {
        total: totalUsers[0]?.total,
        totalPages,
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (!user.length) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

export { createUser, getUsers, deleteUser };
