const express = require("express");
const { verifyToken, AutherizeUser } = require("../middlewares/auth");
const { createAppointment, viewAllAppointmentsAdmin, viewPatientAppointment, viewDoctorAppointments, viewAppointmentById, bookAppointment, cancelAppointment } = require("../controllers/appointmentController");

const router = express.Router();

router.route("/book-appointment").post(verifyToken,AutherizeUser(["patient"]),bookAppointment);

router.route("/view-appointments-admin").get(verifyToken,AutherizeUser(["admin"]),viewAllAppointmentsAdmin);

router.route("/view-patient-appointments").get(verifyToken,AutherizeUser(["patient"]),viewPatientAppointment);

router.route("/view-doctor-appointments").get(verifyToken,AutherizeUser(["doctor"]),viewDoctorAppointments);

router.route("/appointment/:id").get(verifyToken,AutherizeUser(["admin"]),viewAppointmentById);

router.route("/cancel-appointment/:id").patch(verifyToken,AutherizeUser(["patient" , "admin"]),cancelAppointment);

module.exports = router;