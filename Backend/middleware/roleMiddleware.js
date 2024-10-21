

  // middleware/roleMiddleware.js




// middleware/roleMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).send('No authorization header found');
        }

        // Check if the header follows the Bearer scheme
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).send('Invalid authorization format');
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).send('No token provided');
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).send('Server configuration error');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            console.error("Token verification error:", err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Token has expired');
            }
            return res.status(401).send('Invalid token');
        }
    } catch (error) {
        console.error("Middleware error:", error);
        return res.status(500).send('Server error during authentication');
    }
};


exports.receptionistOnly = (req, res, next) => {
    const user = req.user; // Assuming user is set on req after authentication
    if (user && user.role === 'receptionist') {
        return next(); // User is a receptionist, allow access
    } else {
        return res.status(403).json({ error: "Access denied. Receptionist role required to edit the patient." });
    }
};

