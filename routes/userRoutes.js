const express = require('express');
const router = express.Router();

const { getUserProfile, getOwners, getAllUsers, updateProfile } = require("../controllers/userController")


router.get('/profile/:id', (req, res) => {

    getUserProfile(req.params.id).then(result => {

        return res.status(201).json(result);

    }).catch((error) => {

        return res.status(401).json(error);

    })


})

router.get('/owners', (req, res) => {

    getOwners().then((result) => {

        return res.status(201).json(result);

    }).catch((error) => {

        return res.status(401).json(error);

    })

})

router.get('/', (req, res) => {

    getAllUsers().then((result) => {

        return res.status(201).json(result);

    }).catch((error) => {

        return res.status(401).json(error);

    })

})

router.put('/profile', (req, res) => {

    updateProfile(req.body.user_id,req.body.username,req.body.email,req.body.phone_number).then((result) => {

        return res.status(201).json(result);

    }).catch((error) => {

        return res.status(401).json(error);

    })

})



module.exports = router