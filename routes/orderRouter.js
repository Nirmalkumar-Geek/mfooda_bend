const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrderInfo, updateOrderStatus } = require('../controllers/orderController')


router.post("/", (req, res) => {


    try {

        createOrder(req.body).then((result) => {
            return res.status(200).json(result);
        }).catch((error) => {
            console.log(error)
            return res.status(400).json(error);
        })



    } catch (error) {

        console.log(error)

    }



})

router.get('/:id', (req, res) => {

    const customer_id = req.params.id

    getOrders(customer_id).then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        console.log(error)
        return res.status(400).json(error);
    })


})

router.post('/order-info', (req, res) => {

    const customer_id = req.body.customer_id
    const order_id = req.body.order_id

    getOrderInfo(order_id, customer_id).then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        console.log(error)
        return res.status(400).json(error);
    })


})

router.put('/',(req,res)=>{

    updateOrderStatus(req.body.order_id).then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        console.log(error)
        return res.status(400).json(error);
    })

})



module.exports = router