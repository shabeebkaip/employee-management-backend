import Employee from "../model/employee.js";
import mongoose from "mongoose";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import moment from "moment";
import colors from "colors";
import db from "../config/db.js";

// Mongo DB Database
// const getEmployees = async (req, res) => {
//   const { page = 1, limit = 10, search = "" } = req.query;

//   try {
//     const skip = (page - 1) * limit;
//     const searchRegex = new RegExp(search, "i");
//     const employees = await Employee.find({
//       $or: [{ name: searchRegex }, { email: searchRegex }],
//     })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .exec();

//     const totalEmployees = await Employee.countDocuments({
//       $or: [{ name: searchRegex }, { email: searchRegex }],
//     });

//     return res.status(200).json({
//       message:
//         employees.length > 0
//           ? "Employees retrieved successfully"
//           : "No employees found",
//       data: employees,
//       success: true,
//       statusCode: 200,
//       pagination: {
//         total: totalEmployees,
//         totalPages: Math.ceil(totalEmployees / limit),
//         currentPage: parseInt(page),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error while retrieving employees",
//       success: false,
//       statusCode: 500,
//       error: error.message,
//     });
//   }
// };

// const createEmployee = async (req, res) => {
//   try {
//     const employee = req.body;
//     const lastEmployee = await Employee.findOne()
//       .sort({ employee_id: -1 })
//       .exec();
//     const newEmployeeId =
//       lastEmployee && parseInt(lastEmployee.employee_id) + 1;

//     const newEmployee = new Employee({
//       ...employee,
//       employee_id: newEmployeeId,
//     });

//     await newEmployee.save();
//     return res.status(201).json({
//       data: newEmployee,
//       message: "Employee created successfully",
//       success: true,
//       statusCode: 201,
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: "Failed to create employee",
//       success: false,
//       statusCode: 400,
//       error: error.message,
//     });
//   }
// };

// const updateEmployee = async (req, res) => {
//   const { id: _id } = req.params;
//   const employee = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(404).json({
//       message: "No employee with that ID",
//       success: false,
//       statusCode: 404,
//     });
//   }

//   try {
//     const updatedEmployee = await Employee.findByIdAndUpdate(
//       _id,
//       { ...employee, _id },
//       { new: true }
//     );

//     if (!updatedEmployee) {
//       return res.status(404).json({
//         message: "Employee not found",
//         success: false,
//         statusCode: 404,
//       });
//     }

//     return res.status(200).json({
//       data: updatedEmployee,
//       message: "Employee updated successfully",
//       success: true,
//       statusCode: 200,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update employee",
//       success: false,
//       statusCode: 500,
//       error: error.message,
//     });
//   }
// };

// const deleteEmployee = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({
//       message: "No employee with that ID",
//       success: false,
//       statusCode: 404,
//     });
//   }

//   try {
//     const deletedEmployee = await Employee.findByIdAndDelete(id); // Updated method

//     if (!deletedEmployee) {
//       return res.status(404).json({
//         message: "Employee not found",
//         success: false,
//         statusCode: 404,
//       });
//     }

//     return res.status(200).json({
//       message: "Employee deleted successfully",
//       success: true,
//       statusCode: 200,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete employee",
//       success: false,
//       statusCode: 500,
//       error: error.message,
//     });
//   }
// };

// const importEmployees = async (req, res) => {
//   console.log(req.file);
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         message: "No file uploaded",
//         success: false,
//         statusCode: 400,
//       });
//     }

//     const filePath = path.resolve(req.file.path);
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//     const operations = data
//       .map((item) => {
//         const {
//           email,
//           name,
//           phone,
//           salary,
//           position,
//           dob,
//           gender,
//           countryCode,
//           nationality,
//           passportNumber,
//           address,
//           employee_id,
//         } = item;

//         if (
//           !email ||
//           !name ||
//           !phone ||
//           !salary ||
//           !position ||
//           !dob ||
//           !gender ||
//           !countryCode ||
//           !nationality
//         ) {
//           return null;
//         }

//         return {
//           updateOne: {
//             filter: { email },
//             update: {
//               $set: {
//                 name,
//                 phone,
//                 salary,
//                 position,
//                 dob: new Date(dob),
//                 gender,
//                 countryCode,
//                 nationality,
//                 passportNumber: passportNumber || null,
//                 address: address || null,
//                 employee_id,
//               },
//             },
//             upsert: true,
//           },
//         };
//       })
//       .filter(Boolean);
//     console.log(operations);
//     if (operations.length > 0) {
//       const result = await Employee.bulkWrite(operations);
//       console.log(result);
//     }
//     fs.unlinkSync(filePath);
//     const employees = await Employee.find();
//     res.status(200).json({
//       message: "Employees imported and database updated successfully",
//       success: true,
//       statusCode: 200,
//       data: employees,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error processing the file",
//       success: false,
//       statusCode: 500,
//       error: error.message,
//     });
//   }
// };
// const exportEmployees = async (req, res) => {
//   try {
//     const { position, gender, countryCode, minSalary, maxSalary } = req.query;
//     const query = {};
//     if (position) query.position = position;
//     if (gender) query.gender = gender;
//     if (countryCode) query.countryCode = countryCode;
//     if (minSalary)
//       query.salary = { ...query.salary, $gte: parseFloat(minSalary) };
//     if (maxSalary)
//       query.salary = { ...query.salary, $lte: parseFloat(maxSalary) };

//     const employees = await Employee.find(query).lean();

//     if (employees.length === 0) {
//       return res.status(404).json({
//         message: "No employees found matching the criteria",
//         success: false,
//         statusCode: 404,
//       });
//     }

//     const formattedData = employees.map((employee) => ({
//       employee_id: employee.employee_id,
//       Name: employee.name,
//       Email: employee.email,
//       Contact: `${employee.countryCode} ${employee.phone}`,
//       dob: employee.dob,
//       gender: employee.gender,
//       nationality: employee.nationality,
//       position: employee.position,
//       Salary: employee.salary,
//       passportNumber: employee.passportNumber,
//       address: employee.address,
//       date: employee.date,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(formattedData);

//     worksheet["!cols"] = [
//       { wch: 15 }, // employee_id
//       { wch: 20 }, // Name
//       { wch: 30 }, // Email
//       { wch: 20 }, // Contact
//       { wch: 12 }, // dob
//       { wch: 10 }, // gender
//       { wch: 15 }, // nationality
//       { wch: 15 }, // position
//       { wch: 12 }, // Salary
//       { wch: 20 }, // passportNumber
//       { wch: 30 }, // address
//       { wch: 20 }, // date
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
//     const fileName = `employees_export_${timestamp}.xlsx`;
//     const filePath = path.join("uploads", fileName);
//     XLSX.writeFile(workbook, filePath);

//     res.download(filePath, fileName, (err) => {
//       if (err) {
//         res.status(500).json({
//           message: "Error sending the file",
//           success: false,
//           statusCode: 500,
//           error: err.message,
//         });
//       }
//       fs.unlinkSync(filePath);
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error exporting employees",
//       success: false,
//       statusCode: 500,
//       error: error.message,
//     });
//   }
// };

// const downloadTemplate = async (req, res) => {
//   try {
//     const employees = await Employee.find().lean();
//     const formattedData = employees.map((employee) => ({
//       employee_id: employee.employee_id || "",
//       name: employee.name || "",
//       email: employee.email || "",
//       phone: employee.phone || "",
//       salary: employee.salary || "",
//       position: employee.position || "",
//       dob: employee.dob ? moment(employee.dob).format("YYYY-MM-DD") : "",
//       gender: employee.gender || "",
//       countryCode: employee.countryCode || "",
//       nationality: employee.nationality || "",
//       passportNumber: employee.passportNumber || "",
//       address: employee.address || "",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(formattedData);
//     worksheet["!cols"] = [
//       { wch: 15 }, // employee_id
//       { wch: 20 }, // name
//       { wch: 30 }, // email
//       { wch: 20 }, // phone
//       { wch: 12 }, // salary
//       { wch: 15 }, // position
//       { wch: 12 }, // dob
//       { wch: 10 }, // gender
//       { wch: 15 }, // countryCode
//       { wch: 15 }, // nationality
//       { wch: 20 }, // passportNumber
//       { wch: 30 }, // address
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

//     const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
//     const fileName = `employee_import_template_${timestamp}.xlsx`;
//     const filePath = path.join("uploads", fileName);
//     XLSX.writeFile(workbook, filePath);

//     res.download(filePath, fileName, (err) => {
//       if (err) {
//         res.status(500).json({
//           message: "Error sending the file",
//           success: false,
//           statusCode: 500,
//           error: err.message,
//         });
//       }
//       fs.unlinkSync(filePath);
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error generating the template",
//       success: false,
//       statusCode: 500,
//       error: error.message,
//     });
//   }
// };

// mysql DB Database
const getEmployees = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const skip = (page - 1) * limit;
    console.log(skip);
    const [employees] = await db.query(
      `SELECT * FROM employees WHERE name LIKE '%${search}%' OR email LIKE '%${search}%' LIMIT ${skip},${limit}`
    );

    const [totalEmployees] = await db.query(
      `SELECT COUNT(*) as total FROM employees WHERE name LIKE '%${search}%' OR email LIKE '%${search}%'`
    );
    console.log(totalEmployees);
    return res.status(200).json({
      message:
        employees.length > 0
          ? "Employees retrieved successfully"
          : "No employees found",
      data: employees,
      success: true,
      statusCode: 200,
      pagination: {
        total: totalEmployees[0].total,
        totalPages: Math.ceil(totalEmployees[0].total / limit),
        currentPage: parseInt(page),
      },
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
    const [lastEmployee] = await db.query(
      `SELECT * FROM employees ORDER BY id DESC LIMIT 1`
    );
    console.log(lastEmployee && lastEmployee[0].id);
    const newEmployeeId = lastEmployee[0]
      ? parseInt(lastEmployee[0].id) + 1
      : 1;

    employee.id = newEmployeeId;
    // console.log(employee);
    const newEmployee = await db.query(`INSERT INTO employees SET ?`, employee);
    res.status(201).json({
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
  const { id } = req.params;
  const employee = req.body;

  try {
    const [updatedEmployee] = await db.query(
      `UPDATE employees SET ? WHERE id = ?`,
      [employee, id]
    );

    if (updatedEmployee.affectedRows === 0) {
      return res.status(404).json({
        message: "Employee not found",
        success: false,
        statusCode: 404,
      });
    }

    return res.status(200).json({
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

  try {
    const [deletedEmployee] = await db.query(
      `DELETE FROM employees WHERE id = ?`,
      id
    );

    if (deletedEmployee.affectedRows === 0) {
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
const importEmployees = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
        statusCode: 400,
      });
    }

    const filePath = path.resolve(req.file.path);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Validate data and filter out invalid rows
    const validData = data.filter((item) => {
      const {
        id,
        name,
        email,
        phone,
        salary,
        position,
        dob,
        gender,
        countryCode,
        nationality,
      } = item;

      // Validate all required fields, including `id`
      return (
        id && // Ensure `id` is present
        name &&
        email &&
        phone &&
        salary &&
        position &&
        dob &&
        gender &&
        countryCode &&
        nationality
      );
    });

    if (validData.length === 0) {
      return res.status(400).json({
        message: "No valid rows found in the uploaded file",
        success: false,
        statusCode: 400,
      });
    }

    // Prepare data for SQL insertion
    const values = validData.map((item) => [
      item.id, // Include `id`
      item.name,
      item.email,
      item.phone,
      item.salary,
      item.position,
      new Date(item.dob), // Ensure proper date format
      item.date ? new Date(item.date) : null, // Optional field
      item.gender,
      item.countryCode,
      item.nationality,
      item.passportNumber || null, // Default to null if missing
      item.address || null, // Default to null if missing
    ]);

    // Insert or update using ON DUPLICATE KEY UPDATE
    const query = `
      INSERT INTO employees (
        id, name, email, phone, salary, position, dob, date, gender, countryCode, nationality, passportNumber, address
      )
      VALUES ?
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        email = VALUES(email),
        phone = VALUES(phone),
        salary = VALUES(salary),
        position = VALUES(position),
        dob = VALUES(dob),
        date = VALUES(date),
        gender = VALUES(gender),
        countryCode = VALUES(countryCode),
        nationality = VALUES(nationality),
        passportNumber = VALUES(passportNumber),
        address = VALUES(address);
    `;

    // Execute the query
    await db.query(query, [values]);

    // Remove the file after processing
    fs.unlinkSync(filePath);

    // Fetch the updated data
    const [employees] = await db.query(`SELECT * FROM employees`);

    res.status(200).json({
      message: "Employees imported and database updated successfully",
      success: true,
      statusCode: 200,
      data: employees,
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

const exportEmployees = async (req, res) => {};
const downloadTemplate = async (req, res) => {
  try {
    const [employees] = await db.query(`SELECT * FROM employees`);
    const formattedData = employees.map((employee) => ({
      id: employee.id || "",
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      salary: employee.salary || "",
      position: employee.position || "",
      dob: employee.dob ? moment(employee.dob).format("YYYY-MM-DD") : "",
      date: employee.date ? moment(employee.date).format("YYYY-MM-DD") : "",
      gender: employee.gender || "",
      countryCode: employee.countryCode || "",
      nationality: employee.nationality || "",
      passportNumber: employee.passportNumber || "",
      address: employee.address || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    worksheet["!cols"] = [
      { wch: 15 }, // id
      { wch: 20 }, // name
      { wch: 30 }, // email
      { wch: 20 }, // phone
      { wch: 12 }, // salary
      { wch: 15 }, // position
      { wch: 12 }, // dob
      { wch: 12 }, // date
      { wch: 10 }, // gender
      { wch: 15 }, // countryCode
      { wch: 15 }, // nationality
      { wch: 20 }, // passportNumber
      { wch: 50 }, // address
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const fileName = `employee_import_template_${timestamp}.xlsx`;
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
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    res.status(500).json({
      message: "Error generating the template",
      success: false,
      statusCode: 500,
      error: err.message,
    });
    console.log(err);
  }
};

export {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  importEmployees,
  exportEmployees,
  downloadTemplate,
};
