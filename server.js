const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const os = require('os');
const path = require('path');
const route = require('./route/api/api_routes.js');

const app = express();
const Server = http.createServer(app);
const io = socketIO(Server);

const pageRoute = require('./route/pages/page_route.js');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/')));

//used for backend api routing
app.use('/api', route);

//used for page pathing
app.use('/', pageRoute);

app.set('view engine', 'ejs');

//function to fetch local Ip
function getIp(){
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const iface = interfaces[interfaceName];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getIp();


Server.listen(3000, () => {
    process.stdout.write(`\x1Bc`); //clears console
    console.log(`Server is running on http://${localIP}:3000/login`); //displays the link of the server
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);


    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});