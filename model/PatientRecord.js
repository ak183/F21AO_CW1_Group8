const { string } = require('@hapi/joi');
const mongoose = require('mongoose');

const PatientCheckup = require('./PatientCheckup');
const PatientMedication = require('./PatientMedication');

const patientRecordSchema = new mongoose.Schema({
    doctor_id: { type: String },
    patient_id: { type: String },
    checkup_history: [{type: mongoose.Schema.Types.ObjectId, ref: "PatientCheckup"}],
    medication: [{type: mongoose.Schema.Types.ObjectId, ref: "PatientMedication"}]
});

module.exports = mongoose.model('PatientRecord', patientRecordSchema);