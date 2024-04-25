const { registrationSchema, loginSchema, refreshSchema, adminRegistrationSchema } = require("../utils/schema")
const { addRestaurant, updateRestaurant } = require("../schemas/restaurantSchema")
const { addMenuItems } = require("../schemas/menuSchema")
const { required } = require("joi")
const connection = require("../config/database");

const { createOrderSchema } = require("../schemas/ordersSchema")

const validateJSON = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Invalid JSON payload" });
    } else {
        next();
    }
}

const validateRegistrationInput = (req, res, next) => {


    const { error } = registrationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    next();


}

const validateAdminRegistrationInput = (req, res, next) => {


    const { error } = adminRegistrationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    next();


}


const validateLoginInput = (req, res, next) => {

    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error.details.map(detail => detail.message));
    }

    next();

}

const validateRefreshToken = (req, res, next) => {

    const { error } = refreshSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error.details.map(detail => detail.message));
    }

    next();

}

const validateaddRestaurantInput = (req, res, next) => {

    const { error } = addRestaurant.validate(req.body);
    if (error) {
        return res.status(400).json(error.details.map(detail => detail.message));
    }

    next();

}

const validateupdateRestaurantInput = (req, res, next) => {

    const { error } = updateRestaurant.validate(req.body);
    if (error) {
        return res.status(400).json(error.details.map(detail => detail.message));
    }

    next();

}

const validateaddMenuItem = (req, res, next) => {

    const { error } = addMenuItems.validate(req.body);
    if (error) {
        return res.status(400).json(error.details.map(detail => detail.message));
    }

    next();

}

const validateCreateOrderItem = async (req, res, next) => {

    const { error } = createOrderSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error.details.map(detail => detail.message));
    }

    var select_query = "SELECT * FROM menu WHERE "
    let values = []

    for (let item of req.body.line_items){

        if (values.length === 0) {

            select_query += "item_id = ? "
            values.push(item.item_id)

        } else {

            select_query += "OR item_id = ?"
            values.push(item.item_id)

        }

    }

    const select_result = await new Promise((resolve, reject) => {

        connection.query(select_query, values, (err, result) => {

            if (err) reject(err);
            else resolve(result)

        })

    });


    if (select_result.length === req.body.line_items.length) {

        let invalide_items = []

        for (received_item of req.body.line_items) {

            let check_flg = false
            for (let item of select_result) {

                if (item.item_name === received_item.name) {

                    check_flg = true

                }

            }

            if (!check_flg) {

                invalide_items.push(received_item.name)

            }

        }

        if (invalide_items != 0) {

            return res.status(400).json({ "status": "error", "message": invalide_items + " - Invalide item name found" });

        }


    } else {

        return res.status(400).json({ "status": "error", "message": " Invalide item id found" });

    }

    next();

}

module.exports = {
    validateRegistrationInput,
    validateLoginInput,
    validateJSON,
    validateRefreshToken,
    validateaddRestaurantInput,
    validateupdateRestaurantInput,
    validateaddMenuItem,
    validateAdminRegistrationInput,
    validateCreateOrderItem,
}