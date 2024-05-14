const connection = require("../config/database");

const getUserProfile = async (user_id) => {
    let res = { status: null, error: null, message: null, data: null };

    try {
        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT username,email,phone_number FROM customers WHERE id = ?";
            connection.query(select_query, [user_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result) {
            if (result.length === 1) {
                res.status = "success";
                res.data = result[0];

                return res;
            } else {
                res.status = "error";
                res.message = "user id not exist";

                return res;
            }
        }
    } catch (error) {
        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;
    }
};

const check_email_availablity = async (email) =>{

    try{

        const select_result = await new Promise((resolve, reject) => {
            const select_query = "SELECT username,email,phone_number FROM customers WHERE email = ?";
            connection.query(select_query, [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log(select_result)

        if(select_result.length === 1){

            return 1

        }else{

            return 0

        }

    }catch(error){

        return -1

    }

}

const updateProfile = async (user_id,username,email,phone_number) =>{

    let res = { status: null, error: null, message: null, data: null };

    try {
        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT username,email,phone_number FROM customers WHERE id = ?";
            connection.query(select_query, [user_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result) {
            if (result.length === 1) {

                if(result[0].email !== email){

                    const isEmailExist = await check_email_availablity(email)

                    console.log("is email exist: ", isEmailExist)

                    if (isEmailExist === 0) {



                    } else if (isEmailExist === 1) {

                        res.status = "error";
                        res.message = "email already exist"

                        return res


                    } else {

                        res.status = "error";
                        res.message = "Internal server error";

                        return res;


                    }

                }


                const result_2 = await new Promise((resolve, reject) => {

                    const update_query = "UPDATE customers SET username = ?,email = ?, phone_number = ? WHERE  id = ?";
                    connection.query(update_query, [username, email, phone_number, user_id], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                if (result_2.affectedRows === 1) {

                    res.status = "success";
                    res.message = "Profile successfully updated"

                    return res

                } else {

                    res.status = "error";
                    res.message = "Failed to update profile"

                    return res

                }


            } else {
                res.status = "error";
                res.message = "user id not exist";

                return res;
            }
        }
    } catch (error) {
        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;
    }

}

const getAllUsers = async () => {

    let res = { status: null, error: null, message: null, data: null };

    try {
        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT id,username,email FROM customers";
            connection.query(select_query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result) {
            if (result.length != 0) {
                res.status = "success";
                res.data = result;

                return res;
            } else {
                res.status = "success";
                res.data = {};

                return res;
            }
        }
    } catch (error) {
        res.status = "error";
        res.error = error;
        res.message = "Internal server error";

        return res;
    }

}

module.exports = {
    getUserProfile,
    getAllUsers,
    updateProfile,
};