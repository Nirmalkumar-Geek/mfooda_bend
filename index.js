const express = require('express');
const environment = require("./config/config");
const connection = require("./config/database");
const { validateJSON } = require("./middlewares/inputValidator");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRouter")
const paymentRoutes = require('./routes/paymentRoutes')
const adminRoutes = require('./routes/adminRoutes')
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const app = express();


app.use(express.json())
app.use(cors({ origin: '*' }));


const server = http.createServer(app);
const io = new Server(server, {
    cors: ['https://rooky.selfmade.lol', 'https://admin.socket.io'],
});

io.use((socket,next)=>{

    if(false){

        next()

    }
    console.log('connection id: ', socket.id)

})

io.on('connection', (socket) => {

    console.log(socket.id)
    
});

instrument(io, {
    auth: false
});

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(validateJSON);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/payment', paymentRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin/', adminRoutes)

server.listen(environment.parsed.PORT, () => {
    console.log("HTTP service running on port: " + environment.parsed.PORT);
});
