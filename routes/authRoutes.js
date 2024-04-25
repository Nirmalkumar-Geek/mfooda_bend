const express = require('express');
const router = express.Router();
const { validateRegistrationInput, validateLoginInput, validateRefreshToken, validateAdminRegistrationInput } = require("../middlewares/inputValidator")
const { userRegistration, userLogin, adminRegistration, adminLogin, verifyUserRefreshToken, getUserProfile, getOwners, getAllUsers } = require("../controllers/authController")


router.post('/refresh_token', validateRefreshToken, (req, res) => {

    const result = verifyUserRefreshToken(req.body.refresh_token);

     if(result.status === "success"){

         return res.status(201).json({ "status": "success", "access_token": result.access_token, "refresh_token": result.refresh_token });

     }else{

         return res.status(401).json({ "status": "error", "message": result.message });

     }

})

router.post('/users/registration', validateRegistrationInput, async (req, res) => {

    req.body.role = "customer"

    userRegistration(req.body).then((result) => {

        if (result.status === "success") {

            return res.status(201).json({ "status": "success", "message": result.message });

        } else {

            if (result.message === "Internal server error") {


                return res.status(500).json({ "status": "error", "message": result.message });

            } else if (result.message === "Email address already exists") {

                return res.status(409).json({ "status": "error", "message": result.message });

            }

        }

    }).catch((error) => {


        console.log(error.message)
        return res.status(409).json({ "status": "error", "message": "Internal server error" });

    })

});

router.post('/users/signin', validateLoginInput, (req, res) => {

    userLogin(req.body).then((result) => {

        if (result.status === "success") {

            return res.status(201).json({ "status": "success", "access_token": result.access_token, "refresh_token": result.refresh_token });

        } else {

            if (result.message === "Internal server error") {


                return res.status(500).json({ "status": "error", "message": result.message });

            } else if (result.message === "Incorrect email or password") {

                return res.status(401).json({ "status": "error", "message": result.message });

            }

        }

    }).catch((error) => {

        return res.status(409).json({ "status": "error", "message": "Internal server error" });

    })


})


router.post('/admins/registration', validateAdminRegistrationInput, async (req, res) => {

    adminRegistration(req.body.username, req.body.email, req.body.phone_number, req.body.password, req.body.role).then((result) => {

        if (result.status === "success") {

            return res.status(201).json({ "status": "success", "message": result.message });

        } else {

            if (result.message === "Internal server error") {


                return res.status(500).json({ "status": "error", "message": result.message });

            } else if (result.message === "Email address already exists") {

                return res.status(409).json({ "status": "error", "message": result.message });

            }

        }

    }).catch((error) => {


        console.log(error.message)
        return res.status(409).json({ "status": "error", "message": "Internal server error" });

    })

});

router.post('/admins/signin', validateLoginInput, (req, res) => {

    adminLogin(req.body).then((result) => {

        if (result.status === "success") {

            return res.status(201).json({ "status": "success", "access_token": result.access_token, "refresh_token": result.refresh_token });

        } else {

            if (result.message === "Internal server error") {


                return res.status(500).json({ "status": "error", "message": result.message });

            } else if (result.message === "Incorrect email or password") {

                return res.status(401).json({ "status": "error", "message": result.message });

            }

        }

    }).catch((error) => {

        return res.status(409).json({ "status": "error", "message": "Internal server error" });

    })


})






module.exports = router

