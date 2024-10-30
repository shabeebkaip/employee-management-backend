import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" }); // Temporary storage for file uploads
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  exportEmployees,
  importEmployees,
} from "./controllers/employee.js";

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
export default router;
