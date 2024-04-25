const connection = require("../config/database");
const {get_restaurant} = require('../controllers/restaurantController')
const {getOrderItem} = require('../controllers/checkoutController')
const { format } = require('date-fns');
const { DateTime } = require('luxon');

const createOrder = async (payment_response) => {

    let res = { "status": null, "error": null, "message": null, "data": null };

    try {

        const payment_id = payment_response.data.object.metadata.payment_id

        const result_1 = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM payment WHERE payment_id = ?"

            connection.query(select_query, [payment_id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });

        if (result_1 && result_1.length === 1){

            const result_2 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM orderItems WHERE id = ?"

                connection.query(select_query, [result_1[0].orderitems_id], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            if (result_2 && result_2.length === 1){

                const result_3 = await new Promise((resolve, reject) => {

                    const insert_query = "INSERT INTO orders (customer_id,restaurant_id,status,orderitems_id,delivery_address,payment_id,created_time) VALUES (?,?,'created',?,?,?,?)"

                    const address = JSON.stringify(result_2[0].delivery_address);
                    const dt = DateTime.local().setZone('Asia/Kuala_Lumpur');
                    const formattedDatetime = dt.toFormat('yyyy-MM-dd HH:mm:ss');

                    connection.query(insert_query, [result_1[0].customer_id, result_2[0].restaurant_id, result_1[0].orderitems_id, address, result_1[0].payment_id, formattedDatetime], (err, result) => {

                        if (err) reject(err);
                        else resolve(result)

                    })

                });


                if(result_3){


                    res.status = "success"
                    res.message = "order successfully created"

                    return res

                }

            }

        }


    } catch (error) {

        res.status = "error"
        res.error = error
        res.message = "Internal server error"

        console.log(error)

        return res

    }


}

const getOrders = async (customer_id) => {

    let response = { "status": null, "error": null, "message": null, "data": null };

    try{

        const result_1 = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_time DESC LIMIT 10"

            connection.query(select_query, [customer_id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });

        if (result_1.length !== 0){

            let orders = {}

            for(let order of result_1){
                console.log(order)
                const result_1 = await get_restaurant(order.restaurant_id)
                const result_2 = await getOrderItem(order.orderitems_id)
                let line_item = JSON.parse(result_2.data.line_items)
                const timestamp = new Date(order.created_time);
                const created_time = format(timestamp, "MMMM dd, yyyy hh:mm:ss aa");

                orders[order.order_id] = { 'restaurant_name': result_1.data.name, 'line_items': line_item,'order_status': order.status, 'created_at': created_time }
                console.log(orders)
                
            }

            //console.log(orders)

            response.status = "success"
            response.data = orders
            return response


        }else{

            response.status = "success"
            response.message = "orders not available"

            return response

        }



    }catch(error){

        response.status = "error"
        response.error = error
        response.message = "Internal server error"

        console.log(error)

        return response

    }


}

const getOrderInfo = async (order_id,customer_id) =>{

    let response = { "status": null, "error": null, "message": null, "data": null };

    try {

        const result_1 = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM orders WHERE customer_id = ? AND order_id = ?"

            connection.query(select_query, [customer_id,order_id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });

        if (result_1.length === 1) {

            const result_2 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM payment WHERE payment_id = ?"

                connection.query(select_query, [result_1[0].payment_id], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });
            

            if(result_2.length === 1){

                const result_3 = await get_restaurant(result_1[0].restaurant_id)
                const result_4 = await getOrderItem(result_1[0].orderitems_id)
                let line_item = JSON.parse(result_4.data.line_items)
                const timestamp = new Date(result_1[0].created_time);
                const created_time = format(timestamp, "MMMM dd, yyyy hh:mm:ss aa");
                const total_amount = result_2[0].amount/100

                const order_info = { 'order_id':result_1[0].order_id,'restaurant_name': result_3.data.name, 'line_items': line_item,'total_amount_paid': total_amount,'order_status': result_1[0].status, 'created_at': created_time }
                console.log(order_info)


                response.status = "success"
                response.data = order_info
                return response

            }else{

                response.status = "error"
                response.message = "Invalide payment id"
                return response

            }


        } else {

            response.status = "success"
            response.message = "orders not available"

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

const updateOrderStatus = async (order_id) =>{

    let response = { "status": null, "error": null, "message": null, "data": null };

    try {

        const result_1 = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM orders WHERE order_id = ?"

            connection.query(select_query, [order_id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });

        if (result_1.length === 1) {

            let status = null

            switch (result_1[0].status){

                case 'created':
                    status = 'accepted'
                    break;
                case 'accepted':
                    status = 'outfordeliver'
                    break;
                case 'outfordeliver':
                    status = 'delivered'
                    break;

            }
            console.log('order staus from database', result_1[0].status)
            console.log('order staus from logic', status)
            if(status === null){

                response.status = "error"
                response.message = "Invalide order status"

                return response

            }

            
            const update_query = "UPDATE orders SET status = ? WHERE order_id = ?";

            const update_result = await new Promise((resolve, reject) => {

                connection.query(update_query, [status, order_id], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            if (update_result.affectedRows === 1) {

                response.status = 'success'
                response.message = 'order status successfully updated'

                return response

            } else {

                response.status = 'error'
                response.message = 'failed to update order status'

                return response

            }


        } else {

            response.status = "error"
            response.message = "Invalide order id"

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

module.exports = { createOrder, getOrders, getOrderInfo, updateOrderStatus }