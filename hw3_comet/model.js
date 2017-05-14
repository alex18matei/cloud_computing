
var users = [];
var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];
var history = []

module.exports.Message = Message;

function Message(user, color, message, to = 'group') {
    this.user = user;
    this.color = color;
    this.message = message;
    this.to = to;
}

module.exports.getHistoryForOneUser = function (to = 'group', from = 'group') {
    return history.filter((el) => 
        (el.to == to && el.user == from) ||
        (el.to == from && el.user == to)
    );
}

module.exports.getUsers = function(){
    return users;
}

module.exports.getHistory = function(){
    return history.filter((el) => el.to == 'group');
}

module.exports.User = User;

function User(id, color, username) {
    this.username = username;
    this.color = color;
    this.id = id;
}

module.exports.getUsernames = function (exclude_user) {
    usernames = [];
    for (index in users) {
        if(users[index].username != exclude_user)
            usernames[index] = users[index].username;
    }
    return usernames;
}

module.exports.addUser = addUser;

function addUser(socket_id, username) {
    var length = users.push(new User(
        socket_id,
        getRandomColor(),
        username
    ));
    return users[length - 1];
}

module.exports.getUser = getUser;
function getUser(socket_id){
    var index = users.findIndex(function (element) {
        return element.id == socket_id;
    });
    if (index > -1) {
        return users[index];
    } else return null;
}

module.exports.getUserByName = getUserByName;
function getUserByName(name){
    var index = users.findIndex(function (element) {
        return element.username == name;
    });
    if (index > -1) {
        return users[index];
    } else return null;
}

module.exports.removeUser = removeUser;

function removeUser(socket_id) {
    var index = users.findIndex(function (element) {
        return element.id == socket_id;
    });
    if (index > -1) {
        console.log(users[index].username);
        var user = JSON.parse(JSON.stringify(users[index].username));
        remove(index);
        return user;
    } else return null;
}

function remove(index) {
    users.splice(index, 1);
}

module.exports.addMessage = addMessage;

function addMessage(socket_id, msg, to) {
    var index = users.findIndex(function (element) {
        return element.id == socket_id;
    });
    if (to != null){
        var length = history.push(new Message(
        users[index].username,
        users[index].color,
        msg,
        to
    ));
    } else {
        var length = history.push(new Message(
            users[index].username,
            users[index].color,
            msg
        ));
    }
    return history[length - 1];
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}