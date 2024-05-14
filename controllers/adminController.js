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

const get_DUsers = async (user_id) => {
    let res = {};

    try {
        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT id,username,email,role FROM d_users WHERE role ='admin' ";
            connection.query(select_query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result) {
            if (result.length >= 1) {
                res.status = "success";
                res.data = result;

                return res;
            }else{

                res.status = "success";
                res.data = [];

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

                const result_2 = await getOrderItem(order.orderitems_id)
                const result_3 = await getUserProfile(order.customer_id)
                let line_item = JSON.parse(result_2.data.line_items)
                const timestamp = new Date(order.created_time);
                const created_time = format(timestamp, "MMMM dd, yyyy hh:mm:ss aa");
                orders[order.order_id] = { 'restaurant_name': result_2.data.restaurant_name, 'line_items': line_item, 'order_status': order.status, 'created_at': created_time, 'username': result_3.data.username, 'phone_number': result_3.data.phone_number, 'address': order.delivery_address }

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

const getReviews = async(restaurant_id) =>{

    let response = {};

    try {

        const result_1 = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM orders WHERE restaurant_id = ? AND rating IS NOT NULL AND review IS NOT NULL"

            connection.query(select_query, [restaurant_id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });

        if (result_1.length !== 0) {


            let reviews = []

            for (let order of result_1) {

                reviews.push({ 'order_id': order.order_id, 'rating': order.rating, 'comment': order.review })

            }

            response.status = "success"
            response.data = reviews
            return response


        } else {

            response.status = "success"
            response.data = []

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

const deleteDUser = async(user_id) =>{
    let res = {};
    try {
        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT username,email,role FROM d_users WHERE id = ? ";
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

                const result_2 = await new Promise((resolve, reject) => {
                    const select_query = "DELETE FROM  d_users WHERE id = ? ";
                    connection.query(select_query, [user_id], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                if(result_2.affectedRows === 1){


                    res.status = "success";
                    res.message = "user successfully deleted";

                    return res;

                }

            } else {

                res.status = "error";
                res.message = "invalide user id";
                console.log(user_id)

                return res;

            }
        }
    } catch (error) {
        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;
    }


}

const getDashboard = async (dashboard_type, restaurant_id) =>{

    let res = {}

    try{

        if (dashboard_type === "admin") {

            const result_1 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM d_users WHERE role ='admin' "

                connection.query(select_query, (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            const result_2 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM restaurants"

                connection.query(select_query, (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            const result_3 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM customers"

                connection.query(select_query, (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            const result_4 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM orders"

                connection.query(select_query, (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            res.status = "success"
            res.data = {"admins_count":result_1.length,"restaurant_count":result_2.length,"customer_count": result_3.length,"orders_count":result_4.length}

            return res


        } else if (dashboard_type === "owner"){

            const result_1 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM orders WHERE restaurant_id = ? "

                connection.query(select_query, [restaurant_id], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            const result_2 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM orders WHERE restaurant_id = ? AND status = 'delivered' "

                connection.query(select_query, [restaurant_id], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            const result_3 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM restaurants WHERE restaurant_id = ?"

                connection.query(select_query, [restaurant_id], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            

            let total_amount = 0;

            console.log(result_2.length)

            for (order of result_2){

                

                const result_4 = await new Promise((resolve, reject) => {

                    const select_query = "SELECT * FROM payment WHERE payment_id = ?"

                    connection.query(select_query, [order.payment_id], (err, result) => {

                        if (err) reject(err);
                        else resolve(result)

                    })

                });

                if(result_4.length === 1){

                    total_amount += result_4[0].amount


                }


            }

            total_amount = total_amount / 100


            res.status = "success"
            res.data = { "orders_count": result_1.length, "delivered_count": result_2.length, "rating": result_3[0].rating,"revenue": total_amount}
            
            return res

        }

    }catch(error){

        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;

    }

}

module.exports = {

    get_DUserProfile,
    getOrders,
    getReviews,
    get_DUsers,
    deleteDUser,
    getDashboard

};