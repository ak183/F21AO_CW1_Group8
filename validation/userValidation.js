// validation
const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = data => { 
    const schema = Joi.object({
        name:Joi.string().min(3).required(),
        email:Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required(),
        user_role:Joi.string().min(2).required()
    });
    const validation = schema.validate(data);
    return validation;
}

// Login Validation
const loginValidation = data => { 
    const schema = Joi.object({
        email:Joi.string().min(4).required().email(),
        password:Joi.string().min(6).required()
    });
    const validation = schema.validate(data);
    return validation;
}

// User Register Validation
const userRegisterValidation = data => { 
    const schema = Joi.object({
        age:Joi.number().required(),
        gender:Joi.string().required(),
        department: Joi.string().required(),
        marital_status: Joi.string().required(),   
        phone:Joi.number().required(),
        country:Joi.string().required(),
        emirate: Joi.string().required(),
        address:Joi.string().required(),
    });
    const validation = schema.validate(data);
    return validation;
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.userRegisterValidation = userRegisterValidation;
