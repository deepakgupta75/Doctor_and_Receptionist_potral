// routes/patientRoutes.js
const express = require("express");
const { createPatient, getPatients, getPatient, updatePatient, deletePatient } = require("../controllers/patientController");
const { verifyToken, receptionistOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/patients", verifyToken, receptionistOnly, createPatient);
router.get("/patients", getPatients);
router.get("/patients/:id", getPatient); // Corrected function name
router.put("/patients/:id", verifyToken, receptionistOnly, updatePatient);
router.delete("/patients/:id", verifyToken, receptionistOnly, deletePatient);


// Add this to your routes file
router.get("/verify-token", verifyToken, (req, res) => {
    res.json({
        message: "Token is valid",
        user: req.user
    });
});

module.exports = router;