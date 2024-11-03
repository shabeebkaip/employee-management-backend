import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  exportEmployees,
  importEmployees,
  downloadTemplate,
} from "./controllers/employee.js";

import {
  getActivityLogs,
  createActivityLog,
  deleteActivityLog,
} from "./controllers/activityLogs.js";

import { createUser, getUsers, deleteUser } from "./controllers/user.js";
import adminLogin from "./controllers/auth.js";
import { validateEmail } from "./middlewares/validateEmail.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Test API is working!");
});

//Employee routes
router.get("/employees", getEmployees);
router.post("/employees", createEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);
router.post("/employees/import", upload.single("file"), importEmployees);
router.get("/employees/export", exportEmployees);
router.get("/employees/template", downloadTemplate);

//Activity logs routes
router.get("/activityLogs", getActivityLogs);
router.post("/activityLogs", createActivityLog);
router.delete("/activityLogs/:id", deleteActivityLog);

// User and Auth routes
router.post("/users", validateEmail, createUser);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.post("/login", adminLogin);

export default router;
