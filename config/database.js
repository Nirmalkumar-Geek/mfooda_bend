const mysql = require('mysql')
const enviroment = require('./config')

const connection_details = {

    host: enviroment.parsed.DB_HOST,
    user: enviroment.parsed.DB_USERNAME,
    password: enviroment.parsed.DB_PASSWORD,
    port: enviroment.parsed.DB_PORT,
    database: enviroment.parsed.DATABASE_NAME,
    
}

const connection = mysql.createConnection(connection_details)

connection.connect((err) => {

    if (err) {

        console.log("Failed to make connection to the database. Error message: " + err.sqlMessage)


    } else {

        console.log("successfully connected to the database server(" + enviroment.parsed.DB_HOST + ").")

    }



})

module.exports = connection