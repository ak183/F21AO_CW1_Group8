const mongoose = require('mongoose');
const userDetailSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 150
    },
    gender: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    department: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    marital_status: {
        type: String,
        min: 2,
        max: 20,
        required:true
    },
    phone: {
        type: Number,
        min: 7,
        required:true
    },
    country: {
        type: String,
        default: 'United Arab Emirates',
        required:true
    },
    emirate: {
        type: String,
        default: 'Dubai',
        required:true
    },
    address: {
        type: String,
        required: true,
        max: 50,
        min: 2
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
    }

});

module.exports = mongoose.model('UserDetail', userDetailSchema);