const environment = require("../config/config");
const stripe = require('stripe')(environment.parsed.SECRET_KEY_3);
const connection = require('../config/database')

const createOrderItem = async (orderItems) => {

    let response = { "status": null, "error": null, "message": null, "data": null };

    try {

        const line_items = []
        var select_query = "SELECT * FROM menu WHERE "
        let values = []

        for (let item of orderItems.line_items) {

            if (values.length === 0){

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

        let item_price = {}
        if (select_result.length === orderItems.line_items.length) {

            for (let item of select_result) {

                item_price[item.item_id] = item.price

            }

        } else {

            response.status = "error"
            response.message = "mismatch in line items"

            return response

        }

        for (let item of orderItems.line_items) {

            if (item_price[item.item_id] !== item.price){

                response.status = "error"
                response.message = "mismatch in items price"

                return response

            }

        }

        // calculate grand total 
        let total_amount = 0;

        for (let item of orderItems.line_items) {

            total_amount += (Number(item.quantity) * Number(item_price[item.item_id])) * 100
            let actual_item = {}
            line_items.push(actual_item)

        }

        if (total_amount !== 0 && total_amount < 100000) {


            const result_1 = await new Promise((resolve, reject) => {

                const insert_query = "INSERT INTO orderItems (line_items,customer_id,restaurant_id,delivery_address,created_at) VALUES (?,?,?,?,NOW())"

                const items = JSON.stringify(orderItems.line_items);
                const delivery_address = JSON.stringify(orderItems.delivery_address);

                connection.query(insert_query, [items, orderItems.customer_id, orderItems.restaurant_id, delivery_address], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })


            });

            if (result_1 && result_1.affectedRows === 1) {
                const result_2 = await new Promise((resolve, reject) => {

                    const insert_query = "INSERT INTO payment (customer_id,instent_id,payment_method,amount,status,orderitems_id,created_at) VALUES (?,?,?,?,?,?,NOW())"

                    connection.query(insert_query, [orderItems.customer_id, null, 'card', total_amount, 'created', result_1.insertId], (err, result) => {

                        if (err) reject(err);
                        else resolve(result)

                    })


                });

                if (result_2 && result_2.affectedRows === 1){

                    let paymentIntent = null;

                    try {

                        paymentIntent = await stripe.paymentIntents.create({
                            amount: total_amount,
                            currency: 'myr',
                            payment_method_types: ['card',],
                            metadata: {

                                payment_id: result_2.insertId,

                            }
                        });

                    } catch (error) {

                        response.message = "failed to create payment intent"
                        response.error = error
                        response.status = "error"

                        return response

                    }

                    if(paymentIntent && paymentIntent.id){


                        const result_3 = await new Promise((resolve, reject) => {

                            const update_query = "UPDATE payment SET instent_id = ? WHERE payment_id = ?"

                            connection.query(update_query, [paymentIntent.id, result_2.insertId], (err, result) => {

                                if (err) reject(err);
                                else resolve(result)

                            })


                        });

                        if (result_3 && result_3.affectedRows === 1){


                            return { clientSecret: paymentIntent.client_secret }


                        }else{

                            response.message = "failed to update payment intent id"
                            response.error = paymentIntent
                            response.status = "error"

                            return response

                        }


                    }else{

                        response.message = "failed to create payment intent"
                        response.error = paymentIntent
                        response.status = "error"

                        return response

                    }

                }else{

                    response.message = "failed to insert payment details"
                    response.error = result_2
                    response.status = "error"

                    return response

                }

                
            } else {

                response.message = "failed to insert orderItems"
                response.error = result_1
                response.status = "error"

                return response

            }

            


        } else {

            if (total_amount === 0) {

                response.message = "totoal amount 0 is not allowed"

            } else {

                response.message = "totoal amount is > 100000 hance not allowed"

            }

            response.status = "error"

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

const getOrderItem = async (orderItemId) =>{

    let response = { "status": null, "error": null, "message": null, "data": null };

    try{

        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT * FROM orderItems WHERE id = ?";
            connection.query(select_query, [orderItemId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result.length !== 0) {

            response.status = "success"
            response.data = result[0]

            return response

        }else{

            response.status = "success"
            response.data = null

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


module.exports = { createOrderItem, getOrderItem }

