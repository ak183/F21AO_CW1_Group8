// validation
const Joi = require('@hapi/joi');

// Patient Register Validation
const patientRegisterValidation = data => { 
    const schema = Joi.object({
        full_name:Joi.string().required(),
        gender:Joi.string().required(),
        dob: Joi.string().required(),
        occupation: Joi.string().required(),
        marital_status: Joi.string().required(),
        email: Joi.string()
    });
    const validation = schema.validate(data);
    return validation;
}


// Patient Register Validation
const patientMedicationValidation = data => { 
    const schema = Joi.object({
        medicine_name: Joi.string().required(),
        usage_type: Joi.string().required(),
        morning: Joi.boolean(),
        afternoon: Joi.boolean(),
        night: Joi.boolean(),
        days:Joi.number().required(),
        quantity: Joi.number().required(),
        notes:Joi.string().required()
    });
    const validation = schema.validate(data);
    return validation;
}

// Patient Register Validation
const patientCheckupValidation = data => { 
    const schema = Joi.object({
        complaints: Joi.array().items(Joi.string().allow(null)),
        interpretation: Joi.array().items(Joi.string().allow(null))
    });
    const validation = schema.validate(data);
    return validation;
}

module.exports.patientRegisterValidation = patientRegisterValidation;
module.exports.patientMedicationValidation = patientMedicationValidation;
module.exports.patientCheckupValidation = patientCheckupValidation;
