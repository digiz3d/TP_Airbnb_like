const socketio = require('socket.io');
const http = require('http');

const socketioserver = http.createServer(function (req, res) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('websocket server :)');
}).listen(3001, function () {
    console.log('listening on *:3001');
});

// no "var" keyword or the variable is local to this module.
let io = socketio(socketioserver);

io.on('connection', function(socket){
    socket.on('message', function(msg){
      io.emit('message', msg);
    });
});

module.exports = {
    sendMessage: function(msg){
        io.emit('message', msg);
    }
}
