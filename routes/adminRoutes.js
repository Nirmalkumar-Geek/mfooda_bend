const express = require('express');
const router = express.Router();

const { get_DUserProfile, getOrders } = require('../controllers/adminController')


router.get('/profile/:id', (req, res) => {

    get_DUserProfile(req.params.id).then(result => {

        if(result.status === 'success'){

            return res.status(200).json(result);

        }else{
            if (result.message == 'user id not exist'){

                return res.status(404).json(result);

            }else{

                return res.status(500).json(result);

            }

        }

    }).catch((error) => {

        return res.status(500).json(error);

    })


})

router.get('/orders/:id', (req, res) => {

    const restaurant_id = req.params.id

    getOrders(restaurant_id).then((result) => {

        if(result.status === 'success'){

            return res.status(200).json(result);

        }else{

            console.log(result)
            return res.status(500).json(result);

        }
        
    }).catch((error) => {
        console.log(error)
        return res.status(500).json(error);
    })


})

module.exports = router