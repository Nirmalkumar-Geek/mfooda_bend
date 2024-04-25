const connection = require("../config/database");
const { get_restaurant } = require('../controllers/restaurantController')
const { getOrderItem } = require('../controllers/checkoutController')
const { format } = require('date-fns');
const { getUserProfile } = require('../controllers/userController')

const get_DUserProfile = async (user_id) => {
    let res = {  };

    try {
        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT username,email,phone_number FROM d_users  WHERE id = ?";
            connection.query(select_query, [user_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result) {
            if (result.length === 1) {
                res.status = "success";
                res.data = result[0];

                return res;
            } else {
                res.status = "error";
                res.message = "user id not exist";

                return res;
            }
        }
    } catch (error) {
        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;
    }
};

const getOrders = async (restaurant_id) => {

    let response = {};

    try {

        const result_1 = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM orders WHERE restaurant_id = ? AND status != 'delivered'"

            connection.query(select_query, [restaurant_id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });

        if (result_1.length !== 0) {


            let orders = {}

            for (let order of result_1) {

                const result_1 = await get_restaurant(order.restaurant_id)
                const result_2 = await getOrderItem(order.orderitems_id)
                const result_3 = await getUserProfile(order.customer_id)
                let line_item = JSON.parse(result_2.data.line_items)
                const timestamp = new Date(order.created_time);
                const created_time = format(timestamp, "MMMM dd, yyyy hh:mm:ss aa");
                orders[order.order_id] = { 'restaurant_name': result_1.data.name, 'line_items': line_item, 'order_status': order.status, 'created_at': created_time, 'username': result_3.data.username, 'phone_number': result_3.data.phone_number }

            }

            response.status = "success"
            response.data = orders
            return response


        } else {

            response.status = "success"
            response.data = {}

            return response

        }



    } catch (error) {

        response.status = "error"
        response.error = error
        response.message = "Internal server error"

        console.log(error)

        return response

    }


}

module.exports = {

    get_DUserProfile,
    getOrders

};