import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SIGN_OPTION } from "../utils/constants.js";
import db from "../config/db.js";

// Validation schema for login
const authJoi = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required(),
});

// Validate input data
export const validate = (req, res, next) => {
  const { error } = authJoi.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
      statusCode: 400,
    });
  }
  next();
};

// Verify if user exists in the database
export const verify = async (req, res, next) => {
  try {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      req.body.email.toLowerCase().trim(),
    ]);

    if (!user.length) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
        statusCode: 404,
      });
    }

    // Attach user details to req for the next middleware
    req.body.auth = user[0];
    req.body.userDetails = {
      username: user[0].name,
      email: user[0].email,
      role: user[0].role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Database query failed.",
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

// Authenticate user password
export const authenticate = async (req, res, next) => {
  try {
    const isMatch = await bcrypt.compare(
      req.body.password,
      req.body.auth.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password.",
        success: false,
        code: 3,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Password comparison failed.",
      success: false,
      error: error.message,
    });
  }
};

// Create JWT token
export const createJwt = (req, res, next) => {
  try {
    const token = jwt.sign(
      { id: req.body.userDetails.email, role: req.body.userDetails.role },
      process.env.JWT_KEY,
      SIGN_OPTION()
    );

    if (!token) {
      return res.status(500).json({
        message: "Token generation failed.",
        success: false,
        code: 4,
      });
    }

    req.body.token = token;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Token generation failed.",
      success: false,
      error: error.message,
    });
  }
};
