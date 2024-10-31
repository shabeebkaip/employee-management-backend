import express from "express";
import {
  authenticate,
  createJwt,
  validate,
  verify,
} from "../middlewares/loginAuth.js";

const adminLogin = express.Router();

adminLogin.post(
  "/login",
  validate,
  verify,
  authenticate,
  createJwt,
  async (req, res) => {
    try {
      const { userDetails, token } = req.body;

      res.status(200).json({
        status: true,
        message: "Login Success.",
        token,
        user: userDetails, // Send back user details in the response
      });
    } catch (error) {
      res.status(500).json({ message: "Unable to verify the credentials." });
    }
  }
);

export default adminLogin;
