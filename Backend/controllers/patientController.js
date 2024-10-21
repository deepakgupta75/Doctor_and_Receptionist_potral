const Patient = require("../models/Patient");

// Create a new patient (POST method)
exports.createPatient = async (req, res) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json(patient); // 201 Created
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all patients (GET method)
exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a specific patient by ID (GET method)
exports.getPatient = async (req, res) => { // Ensure this function is defined correctly
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ error: "Patient not found" });
        res.status(200).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a patient by ID (PUT method)
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) return res.status(404).json({ error: "Patient not found" });
        res.status(200).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a patient by ID (DELETE method)
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ error: "Patient not found, cannot delete" });
        res.status(200).json({ message: "Patient deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
