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
} from "./controllers/activityLogs.js";

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

export default router;
