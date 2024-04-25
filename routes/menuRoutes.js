const express = require("express");
const router = express.Router();
const upload = require("../middlewares/processMulter");
const { validateaddMenuItem } = require("../middlewares/inputValidator")
const {
    addMenuItem,
    updateMenuItem,
    getMenuItems,
    deleteItem,
} = require("../controllers/menuController");

router.post("/", upload, (req, res) => {
    console.log(req.file)
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }

    // If no file was uploaded
    if (!req.file) {
        return res.status(400).json({ "status": "error", "message": "file is required" });
    }

    // If file was uploaded successfully, process restaurant addition

    const path = "/public/images/" + req.file.filename;

    addMenuItem(req.body.restaurant_id, req.body.name, req.body.price, path)
        .then((result) => {
            console.log(result)
            if (result.status === "success") {

                return res.status(201).json({ "status": "success", "message": result.message });

            }

            return res.status(500).json({ "status": "error", "message": "Internal server error" });
        })
        .catch((error) => {
            console.log(error);

            return res.status(500).json({ "status": "error", "message": "Internal server error" });
        });
});

router.put("/", upload, updateMenuItem, (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }

    // If no file was uploaded
    if (!req.file) {
        req.body.path = null;
    } else {
        const path = "/public/images/" + req.file.filename;
        req.body.path = path;
    }

    updateMenuItem(req.body.item_id, req.body.name, req.body.price, req.body.path)
        .then((result) => {
            console.log(result);
            return res.status(201).json({ status: "success" });
        })
        .catch((error) => {
            console.log(error);
            return res.status(401).json({ status: "error" });
        });
});

router.get("/:restaurant_id", (req, res) => {
    getMenuItems(req.params.restaurant_id)
        .then((result) => {
            console.log(result);
            return res.status(200).json(result);
        })
        .catch((error) => {
            console.log(error);
            return res.status(401).json({ status: "error" });
        });
});

router.delete("/:item_id", (req, res) => {

    console.log(req.body)
    deleteItem(req.params.item_id).then((result) => {
        console.log(result);
        return res.status(200).json(result);
    }).catch((error) => {

        console.log(error);
        return res.status(401).json({ status: "error" });
        ``
    })

})

module.exports = router;
