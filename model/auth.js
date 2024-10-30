import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const Auth = mongoose.model("Auth", schema);
export default Auth;
