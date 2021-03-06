const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    gender: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    dob: {
        type: String,
        required: true,
        min: 2,
        max: 10
    },
    occupation: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    marital_status: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    email: {
        type: String,
        min: 6,
        max: 255
    },
    status: {
        type: Boolean,
        default: true,
        required:true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    registered_by: {
        type: String,
        required: true,
        min: 2,
        max: 255
    }
});

module.exports = mongoose.model('Patient', patientSchema);