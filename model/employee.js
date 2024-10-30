import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    gender: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    passportNumber: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    employee_id: {
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", schema);
export default Employee;
