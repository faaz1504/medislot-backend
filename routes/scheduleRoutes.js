const express = require("express");
const { createSchedule, viewDoctorSchedule, updateSchedule } = require("../controllers/scheduleController");
const { verifyToken, AutherizeUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/create-schedule").post(verifyToken,AutherizeUser(["admin"]),createSchedule);

router.route("/doctor-schedules/:id").get(verifyToken,AutherizeUser(["admin"]),viewDoctorSchedule);

router.route("/update-schedule/:id").patch(verifyToken,AutherizeUser(["admin"]),updateSchedule);

module.exports = router;