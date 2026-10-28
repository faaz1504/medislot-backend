const express = require("express");
const { createDepartment, viewAllDepartments, viewDepartmentById, updateDepartment, updateDepartmentStatus, viewAllDepartmentsAdmin } = require("../controllers/departmentController");
const { verifyToken, AutherizeUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/create-departments").post(verifyToken,AutherizeUser(["admin"]),createDepartment);

router.route("/view-departments").get(verifyToken,AutherizeUser(["admin","doctor","patient"]),viewAllDepartments);

router.route("/view-departmentsadmin").get(verifyToken,AutherizeUser(["admin"]),viewAllDepartmentsAdmin);

router.route("/department/:id").get(verifyToken,AutherizeUser(["admin"]),viewDepartmentById);

router.route("/update-department/:id").patch(verifyToken,AutherizeUser(["admin"]),updateDepartment)

router.route("/update-status/:id").patch(verifyToken,AutherizeUser(["admin"]),updateDepartmentStatus)

module.exports = router;