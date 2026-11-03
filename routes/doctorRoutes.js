const express= require("express");
const { createDoctor, viewAllDoctors, viewDoctorById, updateDoctor } = require("../controllers/doctorController");
const { verifyToken, AutherizeUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/create-doctor").post(verifyToken,AutherizeUser(["admin"]),createDoctor);

router.route("/view-doctors").get(verifyToken,AutherizeUser(["admin"]),viewAllDoctors);

router.route("/view-doctors/:id").get(verifyToken,AutherizeUser(["admin"]),viewDoctorById);

router.route("/update-doctors/:id").put(verifyToken,AutherizeUser(["admin"]),updateDoctor);

module.exports = router;