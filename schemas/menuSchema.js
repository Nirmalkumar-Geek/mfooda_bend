const Joi = require('joi');

const addMenuItems = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    restaurant_id: Joi.number().required(),
});




module.exports = { addMenuItems }