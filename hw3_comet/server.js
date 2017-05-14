var express = require('express');
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var utils = require('./utils');
var model = require('./model');
var io = require('./comet/comet.io').createServer();

app.use(express.static(__dirname));
app.use(function (req, res, next) {
    var sResult = io.serve(req, res);
    //console.log(sResult);
    if (!sResult) {
        var err = new Error('Not Found');
        err.status = 404;
        return next(err);
    }
});

io.on('connection', function (socket) {
    console.log('a user connected ' + socket._uuid);

    socket.on('disconnect', function () {
        console.log('user disconnected');
        user = model.removeUser(socket._uuid);
        if (user != null) {
            // io.emit(utils.REMOVE_USER, user);
            emit_to_all(socket._uuid, utils.REMOVE_USER, user);
            // socket.emit(utils.REMOVE_USER, user);
        }
    });

    socket.on('chatmessage', function (message) {
        msg = composeStrMessage(message);
        var msg_obj = model.addMessage(socket._uuid, msg);

        console.log(msg_obj);
        // socket.emit('chatmessage', msg_obj);
        emit_to_all(socket._uuid, 'chatmessage' , msg_obj);
    });

    socket.on('privatemessage', function (msg_obj) {
        console.log(msg_obj);
        var to = msg_obj['user'];
        var message = model.addMessage(socket._uuid, msg_obj['msg'], to);
        console.log(message);

        var to_user = model.getUserByName(to);
        var from_user = model.getUser(socket._uuid);

        // from_user.id.emit('privatemessage', message);
        io._sockets[from_user.id].emit('privatemessage', message);
        message.to = from_user.username;
        // to_user.id.emit('privatemessage', message);
        io._sockets[to_user.id].emit('privatemessage', message);
        message.to = to_user.username;
    });

    socket.on(utils.NEW_USER, function (message) {

        username = composeStrMessage(message);
        var user = model.addUser(socket._uuid, username);
        console.log(user);
        //trimite toate informatiile doar noului user

        socket.emit(utils.NEW_USER, model.getUsernames(user.username));
        socket.emit(utils.HISTORY, {
            history: model.getHistory(),
            to: 'group'
        });
        //trimite informatii despre utilizatorul nou logat catre ceilalti useri
        // socket.broadcast.emit(utils.NEW_USER_LOGGED, user.username);
        broadcast(socket._uuid, utils.NEW_USER_LOGGED, username);
    });

    socket.on('typing', function (typing) {
        console.log(typing);
        if (typing.bool == 'true') {
            var user = model.getUser(socket._uuid);
            if (typing.user == 'group')
                // socket.broadcast.emit(utils.USER_TYPING, user.username);
                broadcast(socket._uuid, utils.USER_TYPING, user.username);
            else {
                var to = model.getUserByName(typing.user);
                io._sockets[to.id].emit(utils.USER_TYPING, user.username);
            }

        } else {
            // socket.broadcast.emit(utils.USER_TYPING, false);
            broadcast(socket._uuid, utils.USER_TYPING, false);
        }
    });

    socket.on(utils.HISTORY, function (to) {
        console.log(to);
        console.log(to['user']);
        var from = model.getUser(socket._uuid);
        var history = model.getHistoryForOneUser(to['user'], from.username);
        console.log(history);
        // from.id.emit(utils.HISTORY, {
        //     history: history,
        //     to: to
        // });
        io._sockets[from.id].emit(utils.HISTORY, {
            history: history,
            to: to
        });
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

function broadcast(socket_id, event, message) {
    var users = model.getUsers();

    for (index in users) {
        if (users[index].id != socket_id)
            io._sockets[users[index].id].emit(event, message);
    }
}

function emit_to_all(socket_id, event, message) {
    var users = model.getUsers();

    for (index in users) {
        io._sockets[users[index].id].emit(event, message);
    }
}

function composeStrMessage(message) {
    // console.log(message);
    str = '';
    for (var i = 0; i < Object.keys(message).length - 1; i++) {
        str += message[i];
    }
    return str;
}