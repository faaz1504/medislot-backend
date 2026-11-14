const express = require("express");
const { createSchedule, viewDoctorSchedule, updateSchedule, viewAllScheduleAdmin, updateScheduleStatus } = require("../controllers/scheduleController");
const { verifyToken, AutherizeUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/create-schedule").post(verifyToken,AutherizeUser(["admin"]),createSchedule);

router.route("/doctor-schedules/:id").get(verifyToken,AutherizeUser(["admin"]),viewDoctorSchedule);

router.route("/all-schedules-admin").get(verifyToken,AutherizeUser(["admin"]),viewAllScheduleAdmin);

router.route("/update-schedule/:id").patch(verifyToken,AutherizeUser(["admin"]),updateSchedule);

router.route("/update-schedule-status/:id").patch(verifyToken,AutherizeUser(["admin"]),updateScheduleStatus);

module.exports = router;