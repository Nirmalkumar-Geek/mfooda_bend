const connection = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const enviroment = require("../config/config");

const verifyUserAccessToken = (token) => {
    const result = { status: null, message: null, error: null };

    try {
        const decoded_data = jwt.verify(token, enviroment.parsed.SECRET_KEY_1);

        if (decoded_data) {
            result.status = "success";
            return result;
        }
    } catch (error) {
        result.status = "error";
        result.error = error;
        if (error.message === "jwt expired") {
            result.message = "refresh token expired";
        } else if (error.message === "invalid signature") {
            result.message = "invalid refresh token";
        } else {
            result.message = error.message;
        }

        return result;
    }
};

const verifyUserRefreshToken = (token) => {
    const result = {
        status: null,
        message: null,
        access_token: null,
        refresh_token: null,
        error: null,
    };

    try {
        const decoded_data = jwt.verify(token, enviroment.parsed.SECRET_KEY_2);

        if (decoded_data) {
            let payload = { data: decoded_data.data };
            const access_token = generateAccessToken(payload);
            const refresh_token = generateRefreshToken(payload);

            if (access_token && refresh_token) {
                result.status = "success";
                result.access_token = access_token;
                result.refresh_token = refresh_token;
                return result;
            } else {
                result.status = "error";
                result.message = "internal server error";

                return result;
            }
        }
    } catch (error) {
        result.status = "error";
        if (error.message === "jwt expired") {
            result.message = "refresh token expired";
        } else if (error.message === "invalid signature") {
            result.message = "invalid refresh token";
        } else {
            result.message = error.message;
        }
        result.error = error;

        return result;
    }
};

const generateAccessToken = (payload) => {
    try {
        return jwt.sign(payload, enviroment.parsed.SECRET_KEY_1, {
            expiresIn: "15m",
        });
    } catch (error) {
        return false;
    }
};

const generateRefreshToken = (payload) => {
    try {
        return jwt.sign(payload, enviroment.parsed.SECRET_KEY_2, {
            expiresIn: "10m",
        });
    } catch (error) {
        return false;
    }
};

const userRegistration = async (user_details) => {
    try {
        const res = { status: null, error: null, message: null };

        const select_query = "SELECT * FROM customers WHERE email = ?";
        const result = await new Promise((resolve, reject) => {
            connection.query(select_query, [user_details.email], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(user_details.password, salt);

            const insert_query =
                "INSERT INTO customers (username, email, password,phone_number,created_at) VALUES (?, ?, ?,?,NOW())";
            await new Promise((resolve, reject) => {
                connection.query(
                    insert_query,
                    [user_details.username, user_details.email, hashed_password, user_details.phone_number],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            res.status = "success";
            res.message = "User registration successful";
        } else {
            res.status = "error";
            res.message = "Email address already exists";
        }

        return res;
    } catch (error) {
        console.log(error)
        return { status: "error", error: error, message: "Internal server error" };
    }
};

const userLogin = async (user_cred) => {
    const res = {
        status: null,
        error: null,
        message: null,
        access_token: null,
        refresh_token: null,
    };

    try {
        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT * FROM customers WHERE email = ?";
            connection.query(select_query, [user_cred.email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result.length === 1) {
            try {
                const validate_password = await bcrypt.compare(
                    user_cred.password,
                    result[0].password
                );

                if (validate_password) {
                    const payload = { data: { user_id: null, role: null } };
                    payload.data.user_id = result[0].id;
                    payload.data.role = result[0].role;


                    const access_token = generateAccessToken(payload);
                    const refresh_token = generateRefreshToken(payload);

                    if (access_token && refresh_token) {
                        res.status = "success";
                        res.access_token = access_token;
                        res.refresh_token = refresh_token;
                        res.message = "User login successful";
                        return res;
                    } else {
                        res.status = "error";
                        res.message = "Internal server error";
                        return res;
                    }
                } else {
                    res.status = "error";
                    res.message = "Incorrect email or password";
                    return res;
                }
            } catch (bcryptError) {
                // Handle bcrypt error
                res.status = "error";
                res.error = bcryptError;
                res.message = "Incorrect email or password";
                return res;
            }
        } else {
            res.status = "error";
            res.message = "Incorrect email or password";
            return res;
        }
    } catch (error) {
        // Handle database query error
        res.status = "error";
        res.error = error;
        res.message = "Internal server error";
        return res;
    }
};

const adminLogin = async (user_cred) => {
    const res = {
        status: null,
        error: null,
        message: null,
        access_token: null,
        refresh_token: null,
    };

    try {
        const result = await new Promise((resolve, reject) => {
            const select_query = "SELECT * FROM d_users WHERE email = ?";
            connection.query(select_query, [user_cred.email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log(result)

        if (result.length === 1) {
            try {
                const validate_password = await bcrypt.compare(
                    user_cred.password,
                    result[0].password
                );

                

                if (validate_password) {
                    const payload = { data: { user_id: null, role: null } };
                    payload.data.user_id = result[0].id;
                    payload.data.role = result[0].role;


                    const access_token = generateAccessToken(payload);
                    const refresh_token = generateRefreshToken(payload);

                    if (access_token && refresh_token) {
                        res.status = "success";
                        res.access_token = access_token;
                        res.refresh_token = refresh_token;
                        res.message = "User login successful";
                        return res;
                    } else {
                        res.status = "error";
                        res.message = "Internal server error";
                        return res;
                    }
                } else {
                    res.status = "error";
                    res.message = "Incorrect email or password";
                    console.log(res)
                    return res;
                }
            } catch (bcryptError) {
                // Handle bcrypt error
                res.status = "error";
                res.error = bcryptError;
                res.message = "Incorrect email or password";
                console.log(res)
                return res;
            }
        } else {
            res.status = "error";
            res.message = "Incorrect email or password";
            console.log(res)
            return res;
        }
    } catch (error) {
        // Handle database query error
        res.status = "error";
        res.error = error;
        res.message = "Internal server error";
        return res;
    }
};

const adminRegistration = async (username,email,phone_number,password,role) => {
    try {
        const res = { status: null, error: null, message: null, insert_id: null };

        const select_query = "SELECT * FROM d_users WHERE email = ?";
        const result = await new Promise((resolve, reject) => {
            connection.query(select_query, [email], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(password, salt);

            const insert_query =
                "INSERT INTO d_users (username, email, password,phone_number,role,created_at) VALUES (?, ?, ?,?,?,NOW())";
            await new Promise((resolve, reject) => {
                connection.query(
                    insert_query,
                    [username, email, hashed_password, phone_number, role],
                    (err) => {
                        if (err) reject(err);
                        else resolve("");
                    }
                );
            });

            res.status = "success";
            res.message = "User registration successful";
        } else {
            res.status = "error";
            res.message = "Email address already exists";
        }

        return res;
    } catch (error) {
        console.log(error)
        return { status: "error", error: error, message: "Internal server error" };
    }
};


module.exports = {
    userRegistration,
    userLogin,
    adminRegistration,
    adminLogin,
    verifyUserRefreshToken,
    generateAccessToken,
    generateRefreshToken,
    verifyUserAccessToken,
    
};
