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
};