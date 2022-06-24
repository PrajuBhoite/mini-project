const express = require("express");

const { schoolsController } = require("../../controllers");
const { authMiddleware } =require("../");
const router = express.Router();

router.get("/", authMiddleware, schoolsController.getAllschools); 
router.get("/:schoolId", authMiddleware,schoolsController.getschoolById);
router.post("/", authMiddleware, schoolsController.createschool);
router.put("/:schoolId", authMiddleware, schoolsController.updateschool);
router.delete("/:schoolId", authMiddleware, schoolsController.deleteschool);


module.exports = router;