const express= require("express");
const { createDoctor, viewAllDoctors, viewDoctorById, updateDoctor, updateDoctorStatus, viewDoctorsAdmin, viewDoctorByDepartment } = require("../controllers/doctorController");
const { verifyToken, AutherizeUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/create-doctor").post(verifyToken,AutherizeUser(["admin"]),createDoctor);

router.route("/view-doctors").get(verifyToken,AutherizeUser(["admin"]),viewAllDoctors);

router.route("/view-doctors/:id").get(verifyToken,AutherizeUser(["admin"]),viewDoctorById);

router.route("/view-doctors-admin").get(verifyToken,AutherizeUser(["admin"]),viewDoctorsAdmin);

router.route("/view-doctors-by-department/:id").get(verifyToken,AutherizeUser(["admin"]),viewDoctorByDepartment);

router.route("/update-doctors/:id").put(verifyToken,AutherizeUser(["admin"]),updateDoctor);

router.route("/update-doctor-status/:id").patch(verifyToken,AutherizeUser(["admin"]),updateDoctorStatus);

module.exports = router;