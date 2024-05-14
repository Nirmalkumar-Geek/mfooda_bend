const express = require('express');
const router = express.Router();

const { getDashboard,get_DUserProfile, getOrders, getReviews, get_DUsers, deleteDUser } = require('../controllers/adminController')


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
router.get('/orders/reviews/:id', (req, res) => {

    const restaurant_id = req.params.id

    getReviews(restaurant_id).then((result) => {

        if (result.status === 'success') {

            return res.status(200).json(result);

        } else {

            console.log(result)
            return res.status(500).json(result);

        }

    }).catch((error) => {
        console.log(error)
        return res.status(500).json(error);
    })


})

router.get('/users', (req, res) => {

    get_DUsers().then((result) => {

        if (result.status === 'success') {

            return res.status(200).json(result);

        } else {

            console.log(result)
            return res.status(500).json(result);

        }

    }).catch((error) => {
        console.log(error)
        return res.status(500).json(error);
    })


})

router.delete('/users/:id',(req,res)=>{

    const user_id = req.params.id
    deleteDUser(user_id).then((result) => {

        if (result.status === 'success') {

            return res.status(200).json(result);

        } else {

            console.log(result)
            return res.status(500).json(result);

        }

    }).catch((error) => {
        console.log(error)
        return res.status(500).json(error);
    })

})

router.get('/dashboard/:type', (req, res) => {

    const type = req.params.type

    getDashboard(type).then((result) => {

        console.log(result.status)

        if (result.status === 'success') {

            return res.status(200).json(result);

        } else {

            console.log(result)
            return res.status(500).json(result);

        }

    }).catch((error) => {
        console.log(error)
        return res.status(500).json(error);
    })


})

router.get('/dashboard/:type/:id', (req, res) => {

    const type = req.params.type
    const restaurant_id = req.params.id

    getDashboard(type, restaurant_id).then((result) => {

        console.log(result)

        if (result && result.status === 'success') {

            return res.status(200).json(result);

        } else {

            console.log(result)
            return res.status(500).json(result);

        }

    }).catch((error) => {
        console.log(error)
        return res.status(500).json(error);
    })


})

module.exports = router