const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generating the token
const generateToken = (user) => {
    // console.log("JWT_SECRET used for signing:", process.env.JWT_SECRET); // Log the secret
    return jwt.sign(
        { id: user._id, role: user.role }, // Payload
        process.env.JWT_SECRET, // Signing with secret from env
        { expiresIn: '5d' }
    );
};

// Register a new user (doctor or receptionist)
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        // Create a new user with plain text password
        const user = await User.create({
            name,
            email,
            password, // Save the password directly without hashing
            role
        });

        res.status(201).json({
            success: true,
            token: generateToken(user),
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login a user (doctor or receptionist)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Compare the provided password with the stored password
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Return token if authentication is successful
        res.status(200).json({
            success: true,
            token: generateToken(user)
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
