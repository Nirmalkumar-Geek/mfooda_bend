const connection = require("../config/database");

const addMenuItem = async (restaurant_id, name, price, path) => {

    let res = { "status": null, "error": null, "message": null };

    try {

        const result = await new Promise((resolve, reject) => {

            const insert_query = "INSERT INTO menu (restaurant_id,item_name,price,image_path) VALUES (?,?,?,?)"
            connection.query(insert_query, [restaurant_id, name, price, path], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })

        });
        console.log(result)
        if (result) {

            res.status = "success"
            res.message = "menu item successfully added"

            return res
        }



    } catch (error) {

        res.status = "error"
        res.error = error
        res.message = "Internal server error"

        return res


    }


}

const updateMenuItem = async (item_id, name, price, path) => {

    let res = { "status": null, "error": null, "message": null };
    let details = []

    try {

        let update_query = "UPDATE menu  SET"

        if ((item_id != undefined && item_id != null) && ((name != undefined && name != null) || (price != undefined && price != null) || (path != undefined && path != null))) {



            if (name != undefined && name != null) {

                update_query += " item_name = ?"
                details.push(name)

            }

            if (price != undefined && price != null) {

                if (details.length === 0) {

                    update_query += " price = ?"
                    details.push(price)

                } else {

                    update_query += ", price = ?"
                    details.push(price)

                }

            }

            if (path != undefined && path != null) {

                if (details.length === 0) {

                    update_query += " image_path = ?"
                    details.push(path)

                } else {

                    update_query += " , image_path = ?"
                    details.push(path)

                }

            }

            update_query += " WHERE item_id = ? "
            details.push(item_id)



            console.log(update_query)
            console.log(details)

            const result = await new Promise((resolve, reject) => {

                connection.query(update_query, details, (err, result) => {

                    if (err) reject(err);
                    resolve(result)

                });


            })

            if (result) {

                if (result.affectedRows === 1) {

                    res.status = "success"
                    res.message = "menu item successfully updated"

                    return res

                } else {

                    res.status = "error"
                    res.message = "entry doesn't exiest"

                    return res

                }

            }

        } else {

            res.status = "error"
            res.message = "mandatory field are required"

            return res

        }

    } catch (error) {

        res.status = "error"
        res.error = error
        res.message = "Internal server error"

        return res
    }





}

const getMenuItems = async (restaurant_id) => {

    let res = { "status": null, "error": null, "message": null, "data": null };

    try {

        const result = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM menu WHERE restaurant_id = ?"
            connection.query(select_query, [restaurant_id], (err, result) => {

                if (err) reject(err);
                resolve(result)

            })

        })

        if (result) {

            if (result.length > 0) {

                let details = {}

                for (let item of result) {

                    details[item.item_id] = { "item_name": item.item_name, "price": item.price, "img_path": item.image_path }

                }

                res.status = "success"
                res.data = details

                return res

            } else {

                res.status = "error"
                res.message = "items not available"

                return res

            }

        }


    } catch (error) {

        res.status = "error"
        res.error = error
        res.message = "Internal server error"

        return res

    }

}

const deleteItem = async (item_id) => {

    let res = { "status": null, "error": null, "message": null, "data": null };

    try {
        console.log(item_id)
        const result = await new Promise((resolve, reject) => {

            const delete_query = "DELETE FROM menu WHERE item_id = ?"
            connection.query(delete_query, [item_id], (err, result) => {

                if (err) reject(err);
                resolve(result)

            })

        })


        if (result.affectedRows === 1) {

            res.status = "success"
            res.message = "item succesfully deleted"

            return res

        } else {

            res.status = "success"
            res.message = "invalide item id "

            return res

        }

    } catch (error) {

        res.status = "error"
        res.error = error
        res.message = "Internal server error"

        return res


    }


}


module.exports = { addMenuItem, updateMenuItem, getMenuItems, deleteItem }