// const mongoose = require("mongoose")
const connectDB = require("./database/database")
const dotenv = require('dotenv');
const express = require('express');
const authRoutes = require("./routes/authRoutes")
const patientRoutes = require("./routes/patientRoutes")

const cors = require('cors');




dotenv.config();
connectDB();

const app = express()
app.use(cors({
    // origin: 'http://localhost:5173', // Your frontend's URL
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
  


// Middleware to parse JSON requests
app.use(express.json());

//Routes
app.use('/api/auth',authRoutes);
app.use('/api',patientRoutes)

app.use("/", (req, res) => {
    res.send("server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`)
});

