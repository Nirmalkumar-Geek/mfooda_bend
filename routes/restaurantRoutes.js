const express = require('express');
const router = express.Router();
const upload = require("../middlewares/processMulter");
const { validateaddRestaurantInput, validateupdateRestaurantInput } = require("../middlewares/inputValidator");
const { add_restaurant, update_restaurant, get_all_restaurant, get_restaurant, delete_restaurant, get_restaurant_by_owner_id } = require("../controllers/restaurantController");


router.post("/", upload, validateaddRestaurantInput, async (req, res) => {
    // If multer has passed an error, handle it here
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // If file was uploaded successfully, process restaurant addition

    const path = "/public/images/" + req.file.filename

    add_restaurant(req.body.restaurant_name, req.body.description, req.body.phone_number, path, 5, req.body.username, req.body.email, req.body.password).then((result) => {

        console.log(result)

        return res.status(201).json(result);

    }).catch((error) => {

        console.log(error)

        return res.status(401).json({ status: "success" });

    })


});


router.put("/", upload, validateupdateRestaurantInput, (req, res) => {

    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }

    // If no file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // If file was uploaded successfully, process restaurant addition

    const path = "/public/images/" + req.file.filename

    update_restaurant(req.body.restaurant_id, req.body.restaurant_name, req.body.description, req.body.phone_number, path).then((result) => {

        console.log(result)

        return res.status(201).json({ status: "success" });

    }).catch((error) => {

        console.log(error)

        return res.status(401).json({ status: "success" });

    })

})

router.get("/", (req, res) => {

    get_all_restaurant().then((result) => {

        console.log(result)
        return res.status(201).json(result);
    }).catch((error) => {

        console.log(error)
        return res.status(201).json(error);

    })


})

router.get("/:id", (req, res) => {

    get_restaurant(req.params.id).then((result) => {

        console.log(result)
        return res.status(201).json(result);
    }).catch((error) => {

        console.log(error)
        return res.status(201).json(error);

    })


})

router.get("/owner/:id", (req, res) => {

    get_restaurant_by_owner_id(req.params.id).then((result) => {

        console.log(result)
        return res.status(201).json(result);
    }).catch((error) => {

        console.log(error)
        return res.status(400).json(error);

    })


})

router.delete("/:id", (req, res) => {

    delete_restaurant(req.params.id).then((result) => {

        console.log(result)
        return res.status(201).json(result);
    }).catch((error) => {

        console.log(error)
        return res.status(201).json({ status: "success" });

    })

})


module.exports = router;
