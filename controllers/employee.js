import Employee from "../model/employee.js";
import mongoose from "mongoose";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import moment from "moment";

const upload = multer({ dest: "uploads/" }); // Temporary storage for file uploads

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(200).json({
      message:
        employees.length > 0
          ? "Employees retrieved successfully"
          : "No employees found",
      data: employees,
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while retrieving employees",
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employee = req.body;
    const newEmployee = new Employee(employee);

    await newEmployee.save();
    return res.status(201).json({
      data: newEmployee,
      message: "Employee created successfully",
      success: true,
      statusCode: 201,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create employee",
      success: false,
      statusCode: 400,
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  const { id: _id } = req.params;
  const employee = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({
      message: "No employee with that ID",
      success: false,
      statusCode: 404,
    });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      _id,
      { ...employee, _id },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: "Employee not found",
        success: false,
        statusCode: 404,
      });
    }

    return res.status(200).json({
      data: updatedEmployee,
      message: "Employee updated successfully",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update employee",
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      message: "No employee with that ID",
      success: false,
      statusCode: 404,
    });
  }

  try {
    const deletedEmployee = await Employee.findByIdAndRemove(id);

    if (!deletedEmployee) {
      return res.status(404).json({
        message: "Employee not found",
        success: false,
        statusCode: 404,
      });
    }

    return res.status(200).json({
      message: "Employee deleted successfully",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete employee",
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

// New API for importing employees from an Excel/CSV file
const importEmployees = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
        statusCode: 400,
      });
    }

    // Read the file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // First sheet
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Process each row in the file
    const operations = data
      .map((item) => {
        const {
          email,
          name,
          phone,
          salary,
          position,
          dob,
          gender,
          countryCode,
          nationality,
          passportNumber,
          address,
        } = item;
        // Check required fields
        if (
          !email ||
          !name ||
          !phone ||
          !salary ||
          !position ||
          !dob ||
          !gender ||
          !countryCode ||
          !nationality
        ) {
          return null; // Skip entries missing required fields
        }

        return {
          updateOne: {
            filter: { email },
            update: {
              $set: {
                name,
                phone,
                salary,
                position,
                dob: new Date(dob),
                gender,
                countryCode,
                nationality,
                passportNumber: passportNumber || null,
                address: address || null,
              },
            },
            upsert: true,
          },
        };
      })
      .filter(Boolean);

    if (operations.length > 0) {
      await Employee.bulkWrite(operations);
    }
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Employees imported and database updated successfully",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing the file",
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

const exportEmployees = async (req, res) => {
  try {
    const { position, gender, countryCode, minSalary, maxSalary } = req.query;
    const query = {};
    if (position) query.position = position;
    if (gender) query.gender = gender;
    if (countryCode) query.countryCode = countryCode;
    if (minSalary)
      query.salary = { ...query.salary, $gte: parseFloat(minSalary) };
    if (maxSalary)
      query.salary = { ...query.salary, $lte: parseFloat(maxSalary) };

    const employees = await Employee.find(query).lean();

    if (employees.length === 0) {
      return res.status(404).json({
        message: "No employees found matching the criteria",
        success: false,
        statusCode: 404,
      });
    }

    const formattedData = employees.map((employee) => ({
      employee_id: employee.employee_id,
      Name: employee.name,
      Email: employee.email,
      Contact: `${employee.countryCode} ${employee.phone}`,
      dob: employee.dob,
      gender: employee.gender,
      nationality: employee.nationality,
      position: employee.position,
      Salary: employee.salary,
      passportNumber: employee.passportNumber,
      address: employee.address,
      date: employee.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set custom column widths
    worksheet["!cols"] = [
      { wch: 15 }, // employee_id
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 20 }, // Contact
      { wch: 12 }, // dob
      { wch: 10 }, // gender
      { wch: 15 }, // nationality
      { wch: 15 }, // position
      { wch: 12 }, // Salary
      { wch: 20 }, // passportNumber
      { wch: 30 }, // address
      { wch: 20 }, // date
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const fileName = `employees_export_${timestamp}.xlsx`;
    const filePath = path.join("uploads", fileName);
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).json({
          message: "Error sending the file",
          success: false,
          statusCode: 500,
          error: err.message,
        });
      }
      // Delete file after sending
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({
      message: "Error exporting employees",
      success: false,
      statusCode: 500,
      error: error.message,
    });
  }
};

export {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  importEmployees,
  exportEmployees,
};
