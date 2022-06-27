const express = require("express");
const router = express.Router();


const userRouter= require("./users.routes");
const schoolsRouter = require("./school.routes");
const authsRouter = require("./auth.routes");
const  registerRouter = require("./register.routes");

router.use("/schools", schoolsRouter);
router.use("/users", userRouter);
router.use("/auth/login", authsRouter);
router.use("/auth/register", registerRouter);

module.exports = router;