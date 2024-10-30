import express from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
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
export default router;
