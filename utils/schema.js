const Joi = require('joi');

const registrationSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.number().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Password and Confirm Password must match',
    }),
});

const adminRegistrationSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.number().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Password and Confirm Password must match',
    }),
    role: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const refreshSchema = Joi.object({
    refresh_token: Joi.string().required()
});




module.exports = { registrationSchema, loginSchema, refreshSchema, adminRegistrationSchema }