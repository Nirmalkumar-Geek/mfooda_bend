const { verifyUserAccessToken } = require("../controllers/authController")



const verifyToken = (req, res, next) => {

    if (req.headers.authorization != undefined) {

        if (req.headers.authorization.length > 50 && req.headers.authorization.length < 250) {

            const result = verifyUserAccessToken(req.headers.authorization);

            console.log(result)


            if (result.status === "success") {

                next()

            } else {


                return res.status(401).json({ "status": "error", "message": result.message });

            }

        } else {

            return res.status(401).json({ "status": "error", "message": "\"Authorization\" header is not allowed to be empty" });

        }


    } else {

        return res.status(401).json({ "status": "error", "message": "\"Authorization\" header is required" });

    }




}

module.exports = { verifyToken }