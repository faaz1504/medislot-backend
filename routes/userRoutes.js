const express = require('express');
const { createUser, getAllUsers, LoginUser, getUserById, updateUserRole, updateUserStatus, Logout } = require('../controllers/userController');
const { verifyToken, AutherizeUser } = require('../middlewares/auth');

const   router = express.Router();

router.route("/create").post(createUser)

router.route("/login").post(LoginUser)

router.route("/all").get(verifyToken,AutherizeUser(["admin"]),getAllUsers)

router.route("/user/:id").get(verifyToken,AutherizeUser(["admin"]),getUserById)

router.route("/update-role/:id").patch(verifyToken,AutherizeUser(["admin"]),updateUserRole)

router.route("/update-status/:id").patch(verifyToken,AutherizeUser(["admin"]),updateUserStatus)

router.route("/logout").post(Logout)


module.exports = router;