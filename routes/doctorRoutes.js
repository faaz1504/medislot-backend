const express= require("express");
const { createDoctor, viewAllDoctors } = require("../controllers/doctorController");
const { verifyToken, AutherizeUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/create-doctor").post(verifyToken,AutherizeUser(["admin"]),createDoctor);

router.route("/view-doctors").get(verifyToken,AutherizeUser(["admin"]),viewAllDoctors);

module.exports = router;