const Joi = require('joi')
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 5,
    max: 14,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
  };

const createuservalidation = (data)=>{
    const schema = Joi.object({
        user_name : Joi.string().required().max(8),
        first_name:Joi.string().required().max(255),
        last_name:Joi.string().required().max(255),
        user_role : Joi.string().required().disallow(""),  
        password: passwordComplexity(complexityOptions),
        phoneno : Joi.number().required(),
        email: Joi.string().email().max(255).required(),
        address : Joi.string().required(),
    });
   
    return schema.validate(data)
}

const userloginvalidation = (data)=>{
    const schema = Joi.object({
        user_name : Joi.string().lowercase().required(),
        password: Joi.string().required(),
    });
   
    return schema.validate(data)
}

const usergetdatavalidation = (data)=>{
    const schema = Joi.object({
        user_name : Joi.string().lowercase().allow(""),
        staff_id : Joi.number().allow(""),
    });
   
    return schema.validate(data)
}

const changeuservalidation = (data)=>{
    const schema = Joi.object({
        first_name:Joi.string().required().max(255),
        last_name:Joi.string().required().max(255),
        user_name : Joi.string().lowercase().required().max(8),
        user_role : Joi.string().required().disallow(""),  
        phoneno : Joi.number().required(),
        email: Joi.string().email().max(255).required(),
        address : Joi.string().required(),
    });
   
    return schema.validate(data)
}

const changeuserpasswordvalidation = (data)=>{
    const schema = Joi.object({
        user_name: Joi.string().required(),
        password: passwordComplexity(complexityOptions),
    });
   
    return schema.validate(data)
}

const deleteuservalidation = (data)=>{
    const schema = Joi.object({
        user_name: Joi.string().required(),
    });
   
    return schema.validate(data)
}

module.exports= {createuservalidation,userloginvalidation,usergetdatavalidation,changeuserpasswordvalidation,changeuservalidation}