const dotenv = require('dotenv')

const enviroment = dotenv.config({ path: '/var/labsstorage/home/nirmalkumarv24/htdocs/API/mfooda_rest/config.env' })

if (enviroment.error) {

    console.log(enviroment.error)

}

module.exports = enviroment