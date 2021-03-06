const { string } = require('@hapi/joi');
const mongoose = require('mongoose');

const patientCheckupSchema = new mongoose.Schema({
    doctor_id: { type: String },
    patient_id: { type: String },
    date:{type:Date,default:Date.now()},
    complaints:[{type:String}],
    interpretation:[{type:String}]
});

module.exports = mongoose.model('PatientCheckup', patientCheckupSchema);