import Employee from "../model/employee.js";
import mongoose from "mongoose";

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    if (employees.length === 0) {
      return res.status(200).json({
        message: "No employees found",
        data: [],
        success: true,
        statusCode: 200,
      });
    }
    res.status(200).json({
      message: "Employees retrieved successfully",
      data: employees,
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  const employee = req.body;
  const newEmployee = new Employee(employee);
  try {
    await newEmployee.save();
    res.status(201).json({
      data: newEmployee,
      message: "Employee created successfully",
      success: true,
      statusCode: 201,
    });
  } catch (error) {
    res.status(409).json({
      message: error.message,
      success: false,
      statusCode: 409,
    });
  }
};

const updateEmployee = async (req, res) => {
  const { id: _id } = req.params;
  const employee = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send({
      message: "No employee with that id",
      success: false,
      statusCode: 404,
    });
  }
  const updatedEmployee = await Employee.findByIdAndUpdate(
    _id,
    { ...employee, _id },
    { new: true }
  );
  res.json({
    data: updatedEmployee,
    message: "Employee updated successfully",
    success: true,
    statusCode: 200,
  });
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({
      message: "No employee with that id",
      success: false,
      statusCode,
    });
  }
  await Employee.findByIdAndRemove(id);
  res.json({
    success: true,
    statusCode: 200,
    message: "Employee deleted successfully",
  });
};

export { getEmployees, createEmployee, updateEmployee, deleteEmployee };
``;
