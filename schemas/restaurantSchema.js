const Joi = require('joi');

const addRestaurant = Joi.object({
    restaurant_name: Joi.string().required(),
    description: Joi.string().required(),
    phone_number: Joi.number().required(),
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const updateRestaurant = Joi.object({
    restaurant_name: Joi.string().required(),
    description: Joi.string().required(),
    phone_number: Joi.number().required(),
    restaurant_id: Joi.number().required(),
});


module.exports = { addRestaurant, updateRestaurant }