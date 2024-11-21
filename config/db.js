import mysql2 from "mysql2/promise";

const mysqlPool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "Shabeeb@123#",
  database: "employee_management",
});

export default mysqlPool;
