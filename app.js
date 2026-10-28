const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");

const departmentRoutes = require("./routes/departmentRoutes");

const doctorRoutes = require("./routes/doctorRoutes");

app.use("/api/v1/user",userRoutes);

app.use("/api/v1/department",departmentRoutes);

app.use("/api/v1/doctor",doctorRoutes);

module.exports = app;
