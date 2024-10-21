const mongoose = require("mongoose")

const PatientSchema = new mongoose.Schema({

    name:{
        type:String,
    required:true,
    },
    email:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    registrationDate:{
        type:Date,
        default:Date.now,
    },
});

module.exports = mongoose.model('Patient',PatientSchema);