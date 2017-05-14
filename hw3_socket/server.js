var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var utils = require('./utils');
var model = require('./model');

app.use(express.static(__dirname));

io.on('connection', function (socket) {
    console.log('a user connected ' + socket.id);

    socket.on('disconnect', function () {
        console.log('user disconnected');
        user = model.removeUser(socket);
        if(user != null){
            io.emit(utils.REMOVE_USER, user);
        }
    });

    socket.on('chat message', function (msg) {
        var msg_obj = model.addMessage(socket, msg);
        
        console.log(msg_obj);
        io.emit('chat message', msg_obj);
    });

    socket.on('private message', function (msg_obj) {
        
        var to = msg_obj['user'];
        var message = model.addMessage(socket, msg_obj['msg'], to);
        console.log(message);

        var to_user = model.getUserByName(to);
        var from_user = model.getUser(socket);

        from_user.id.emit('private message', message);
        message.to = from_user.username;
        to_user.id.emit('private message', message);
        message.to = to_user.username;
    });

    socket.on(utils.NEW_USER, function (username) {
        var user = model.addUser(socket, username);
        console.log(user.username);
        //trimite toate informatiile doar noului user
        user.id.emit(utils.NEW_USER, model.getUsernames(user.username));    
        user.id.emit(utils.HISTORY, {
            history: model.getHistory(),
            to: 'group'
        });

        //trimite informatii despre utilizatorul nou logat catre ceilalti useri
        socket.broadcast.emit(utils.NEW_USER_LOGGED, user.username);
        
    });

    socket.on('typing', function (typing) {
        if(typing.bool){
            var user = model.getUser(socket);
            if( typing.user == 'group')
                socket.broadcast.emit(utils.USER_TYPING, user.username);
            else{
                var to = model.getUserByName(typing.user);
                to.id.emit(utils.USER_TYPING, user.username);
            } 
                
        } else {
            socket.broadcast.emit(utils.USER_TYPING, false);
        }
    });

    socket.on(utils.HISTORY, function (to) {
        var from = model.getUser(socket);
        var history = model.getHistoryForOneUser(to, from.username);
        console.log(history);
        from.id.emit(utils.HISTORY, {history: history, to: to});
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});