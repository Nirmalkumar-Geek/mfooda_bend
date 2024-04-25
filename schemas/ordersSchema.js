const Joi = require('joi');

const createOrderSchema = Joi.object({
    restaurant_id: Joi.number().required(),
    customer_id: Joi.number().required(),
    payment_method_type: Joi.string().required(),
    order_status: Joi.string().required(),
    line_items: Joi.array().items(
        Joi.object({
            "name": Joi.string().required(),
            "quantity": Joi.number().required(),
            "item_id": Joi.number().required(),
            "price": Joi.number().required(),
        }).required()
    ).required(),
    delivery_address: Joi.string().required(),
});


module.exports = { createOrderSchema }