const { createOrderItem, createOrderItem_2 } = require('../controllers/checkoutController')
const { validateCreateOrderItem } = require('../middlewares/inputValidator')
const { getPayments } = require('../controllers/paymentController')
const express = require("express");
const router = express.Router();



router.post("/create-payment-intent", validateCreateOrderItem, (req, res) => {


    try {

        createOrderItem(req.body).then((result) => {
            return res.status(200).json(result);
        }).catch((error) => {
            console.log(error)
            return res.status(400).json(error);
        })

    } catch (error) {

        console.log(error)

    }



})

router.post("/create-order", validateCreateOrderItem, (req, res) => {


    try {

        createOrderItem_2(req.body).then((result) => {
            return res.status(200).json(result);
        }).catch((error) => {
            console.log(error)
            return res.status(400).json(error);
        })

    } catch (error) {

        console.log(error)

    }



})

router.get('/',(req,res) =>{

    try{

        getPayments().then((result) => {
            return res.status(200).json(result);
        }).catch((error) => {
            console.log(error)
            return res.status(400).json(error);
        })


    }catch(error){

        console.log(error)

    }

})




module.exports = router