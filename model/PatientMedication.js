const { string } = require('@hapi/joi');
const mongoose = require('mongoose');

const patientMedicationSchema = new mongoose.Schema({
    doctor_id: { type: String },
    patient_id: {type:String},
    medicine_name:{type:String},
    usage_type:{type:String},
    morning:{type:Boolean},
    afternoon:{type:Boolean},
    night:{type:Boolean},
    days:{type:Number},
    quantity:{type:Number},
    notes:{type:String}
});

module.exports = mongoose.model('PatientMedication', patientMedicationSchema);