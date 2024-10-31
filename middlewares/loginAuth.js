import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { SIGN_OPTION } from "../utils/constants.js";

const authJoi = Joi.object().keys({
  email: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});

export const validate = (req, res, next) => {
  const result = authJoi.validate(req.body);
  if (result.error) {
    return res.status(400).send({ message: result.error.message, code: 1 });
  } else {
    next();
  }
};
export const verify = async (req, res, next) => {
  const auth = await User.findOne({
    email: req.body.email.toLowerCase().trim(),
  });
  if (!auth) {
    return res.status(404).send({ message: "Invalid Email.", code: 2 });
  } else {
    // Attach user details to req.body.userDetails, excluding password
    req.body.auth = auth;
    req.body.userDetails = {
      username: auth.name,
      email: auth.email,
      role: auth.role,
      // Add more fields if needed
    };
    next();
  }
};

export const authenticate = async (req, res, next) => {
  const result = await bcrypt.compare(
    req.body.password,
    req.body.auth.password
  );
  if (result) {
    next();
  } else {
    return res.status(401).send({ message: "Invalid Password.", code: 3 });
  }
};

export const createJwt = (req, res, next) => {
    const token = jwt.sign(
      { id: req.body.userDetails.email, role: req.body.userDetails.role },
      process.env.JWT_KEY,
      SIGN_OPTION()
    );
    if (token) {
      req.body.token = token;
      next();
    } else {
      return res.status(500).send({ message: "Token generation failed.", code: 4 });
    }
  };
  
