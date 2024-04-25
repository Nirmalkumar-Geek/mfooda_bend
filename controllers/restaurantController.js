const connection = require("../config/database");
const { adminRegistration } = require('./authController')

const add_restaurant = async (name, description, phone_number, banner_path, rating, username, email,password) => {

    let res = { "status": null, "error": null, "message": null };
    try {

        const select_result_1 = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM restaurants WHERE restaurant_name = ? "

            connection.query(select_query, [name], (err, result) => {

                if (err) reject(err);
                resolve(result)

            })

        });

        if (select_result_1.length === 0) {

            const create_user = await adminRegistration(username,email,phone_number,password,"owner")

            if(create_user.status === "success"){

                const select_query = "SELECT id FROM d_users WHERE email = ?";
                const result = await new Promise((resolve, reject) => {
                    connection.query(select_query, [email], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                const owner_id = result[0].id

                const res_insert = await new Promise((resolve, reject) => {

                    const insert_query = "INSERT INTO restaurants (restaurant_name, description, phone_number,banner_path,rating,owner_id) VALUES (?, ?, ?, ?, ?,?)"
                    connection.query(insert_query, [name, description, phone_number, banner_path, rating, owner_id], (err, result) => {

                        if (err) reject(err);
                        else resolve(result)

                    })

                });

                if (res_insert) {

                    res.status = "success"
                    res.message = "restaurant successfully added"

                    return res

                } else {

                    res.status = "error"
                    res.message = "Internal server error"
                    res.error = res_insert

                    return res

                }

            }else{

                if (create_user.message === "Email address already exists"){

                    res.status = "error"
                    res.message = create_user.message

                }
                
                return res

            }

            

        } else {


            res.status = "error"
            res.message = "restaurant already exist"

            return res

        }


    } catch (error) {

        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;

    }


}

const update_restaurant = async (id, name, description, phone_number, banner_path) => {

    let res = { "status": null, "error": null, "message": null };

    try {



        const res_select = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM restaurants WHERE id = ?"

            connection.query(select_query, [id], (err, result) => {

                if (err) reject(err);
                resolve(result)

            })

        });



        if (res_select[0].name === name) {


            const update_query = "UPDATE restaurants SET name = ?,description = ?,phone_number = ?,banner_path = ? WHERE id = ?"

            const result = await new Promise((resolve, reject) => {

                connection.query(update_query, [name, description, phone_number, banner_path, id], (err, result) => {

                    if (err) reject(err);
                    else resolve(result)


                })

            });

            if (result) {


                res.status = "success"
                res.message = "restaurant successfully updated"

                return res


            }



        } else if (res_select.name != name) {

            const res_select_2 = await new Promise((resolve, reject) => {

                const select_query = "SELECT * FROM restaurants WHERE name = ?"

                connection.query(select_query, [name], (err, result) => {

                    if (err) reject(err);
                    resolve(result)

                })

            });


            if (res_select_2.length === 0) {

                const update_query = "UPDATE restaurants SET name = ?,description = ?,phone_number = ?,banner_path = ? WHERE id = ?"

                const res_update_2 = await new Promise((resolve, reject) => {

                    connection.query(update_query, [name, description, phone_number, banner_path, id], (err, result) => {

                        if (err) reject(err);
                        else resolve(result)


                    })

                });

                if (res_update_2) {


                    res.status = "success"
                    res.message = "restaurant successfully updated"

                    return res


                }

            } else {

                res.status = "error"
                res.message = "restaurant already exist"

                return res

            }


        } else {

            res.status = "error"
            res.message = "restaurant already exist"

            return res

        }




    } catch (error) {

        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;
    }


}


const get_all_restaurant = async () => {

    let res = { "status": null, "error": null, "message": null, "data": null };

    try {

        const result = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM restaurants"
            connection.query(select_query, (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })


        })

        if (result) {

            if (result.length != 0) {

                res.data = {}

                for (let row of result) {

                    let restaurant_data = { name: row.restaurant_name, description: row.description, phone_number: row.phone_number, banner_path: row.banner_path, rating: row.rating }

                    res.data[row.restaurant_id] = restaurant_data

                }

                res.status = "success"


                return res

            } else {

                res.status = "success"


                return res

            }

        }


    } catch (error) {

        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;

    }


}

const get_restaurant = async (id) => {

    let res = { "status": null, "error": null, "message": null, "data": null };

    try {

        const result = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM restaurants WHERE restaurant_id=?"
            connection.query(select_query, [id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })


        });

        if (result.length === 1) {

            res.status = "success"
            res.data = { name: result[0].restaurant_name, description: result[0].description, phone_number: result[0].phone_number, banner_path: result[0].banner_path, rating: result[0].rating }

            return res

        } else {

            res.status = "error";
            res.message = "invalide restaurant ID";

            return res;


        }


    } catch (error) {

        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;

    }

}

const delete_restaurant = async (id) => {

    let res = { "status": null, "error": null, "message": null };

    try {

        const result = await new Promise((resolve, reject) => {

            const select_query = "DELETE FROM restaurants WHERE restaurant_id = ?"
            connection.query(select_query, [id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })


        });

        if (result.affectedRows === 1) {

            res.status = "success"
            res.message = "restaurant successfully deleted"

            return res

        } else {

            res.status = "error";
            res.message = "invalide restaurant ID";

            return res;

        }


    } catch (error) {

        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;

    }

}

const get_restaurant_by_owner_id = async (owner_id) =>{

    let res = { "status": null, "error": null, "message": null, "data": null };

    try {

        const result = await new Promise((resolve, reject) => {

            const select_query = "SELECT * FROM restaurants WHERE owner_id=?"
            connection.query(select_query, [owner_id], (err, result) => {

                if (err) reject(err);
                else resolve(result)

            })


        });

        if (result.length === 1) {

            res.status = "success"
            res.data = { restaurant_id: result[0].restaurant_id }

            return res

        } else {

            res.status = "error";
            res.message = "invalide owner_id ID";

            return res;


        }


    } catch (error) {

        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;

    }

}


module.exports = { add_restaurant, update_restaurant, get_all_restaurant, get_restaurant, delete_restaurant, get_restaurant_by_owner_id }

