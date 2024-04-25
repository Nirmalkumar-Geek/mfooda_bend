const connection = require('../config/database')
const { getUserProfile } = require('./userController')

const getPayments = async() =>{

    let response = { "status": null, "error": null, "message": null, "data": null };

    try{

        const select_query = "SELECT * FROM payment";

        const select_result = await new Promise((resolve, reject) => {

            connection.query(select_query, (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });

        if (select_result && select_result.length !== 0){

            payments = []

            for(payment of select_result){

                const user_profile = await getUserProfile(payment.customer_id)

                if(user_profile.status === 'success'){

                    payments.push({ 'payment_id': payment.payment_id, 'customer_name': user_profile.data.username, 'payment_method': payment.payment_method, 'amount_paid': payment.amount, 'status': payment.status, 'created_at': payment.created_at })

                }

            }

            console.log(payments)
            response.status = "success"
            response.data = payments

            return response

        }else{

            response.status = "success"
            response.data = []

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

const updatePaymentStatus = async (payment_id,status) =>{

    let result = {};

    try{

        const select_query = "SELECT * FROM payment WHERE payment_id = ?";
        const select_result = await new Promise((resolve, reject) => {

            connection.query(select_query,[payment_id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });

        if (select_result.length === 0){

            const update_query = "UPDATE payment SET status = ? WHERE payment_id = ?";

            const update_result = await new Promise((resolve, reject) => {

                connection.query(update_query, [status,payment_id], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)

                })

            });

            if (update_result.affectedRows === 1){

                result.status = 'success'
                result.message = 'payment status successfully updated'

                return result

            }else{

                result.status = 'error'
                result.message = 'failed to update payment status'

                return result

            }

        }else{

            result.status = 'error'
            result.message = 'invalide payment id'

            return result

        }


    }catch(error){

        result.status = 'error'
        result.message = 'failed to update payment status'
        result.error = error
        return result

    }


} 

module.exports = { getPayments, updatePaymentStatus }