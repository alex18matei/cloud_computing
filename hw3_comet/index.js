$(document).ready(function () {

    var logged = 0;
    $('.modal').modal({
        dismissible: false,
    });
    $('#modal-user').modal('open');

    var socket = comet.connect();
    $('.form-user').submit(function () {
        $('#modal-user').modal('close');
        var user_name = $('#user_name').val();
        socket.emit("newuser", user_name);
        return false;
    });


    $('.form-message').submit(function () {
        var select_tab = $('ul.tabs .active').text();
        var message = $('#m').val()
        if (select_tab == 'GROUP') {
            socket.emit('chatmessage', message);
        } else {
            socket.emit('privatemessage', {
                user: select_tab,
                msg: message
            });
        }
        $('#m').val('');
        return false;
    });

    socket.on('chatmessage', function (msg) {
        addMessage(msg, 'group');
    });

    socket.on('privatemessage', function (msg) {
        console.log(msg);
        addMessage(msg, msg.to);
    });

    socket.on('newuser', function (users) {
        for (index in users) {
            $('#online-users ul').append($('<li id="' + users[index] + '">').text(users[index]));
        }
    });

    socket.on('new user logged', function (user) {
        $('#online-users ul').append($('<li id="' + user + '">').text(user));
    });

    socket.on('history', function (history_obj) {
        console.log(history_obj);
        var history = history_obj.history;
        var to = history_obj.to;
        for (index in history) {
            addMessage(history[index], to);
        }
    });

    socket.on('removeuser', function (username) {
        element = document.getElementById(username);
        element.parentNode.removeChild(element);
    });

    socket.on('user typing', function (username) {

        var div_typing = $('#typing_on');
        console.log(username);
        if (username === false) {
            div_typing.html("");
        } else {
            var html_content = '<p id="' + username + '">' +
                username + ' is typing...</p>';
            div_typing.html(html_content);
        }
    });

    var timeout = 0;

    function timeoutFunction() {
        socket.emit('typing', {
            bool: false,
            user: 'group'
        });
    }

    $('#m').keyup(function () {
        var select_tab = $('ul.tabs .active').text().toLowerCase();
        socket.emit('typing', {
            bool: true,
            user: select_tab
        });
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 1000);
    });

    $('ul.tabs').tabs();

    $('#users').click(function (event) {
        if (event.target.id != 'users') {

            if ($('.mesaje #' + event.target.id + ' li').length == 0) {

                var childrens = getTabs();
                var index = childrens.findIndex(function (element) {
                    return element == event.target.id;
                });

                if (index < 0) {
                    createTab(event.target.id);
                }
                $('ul.tabs').tabs('select_tab', event.target.id);
                socket.emit('history', {'user': event.target.id});
            }
        }
    });
});

function getTabs() {
    return $('ul.tabs li').map(function () {
        return $(this).text();
    }).toArray();
}

function createTab(user) {
    var html_content = '<li class="tab col s3">' +
        '<a href="#' + user + '">' + user +
        '</a></li>';
    $('ul.tabs').append($(html_content));

    $('.mesaje').append($('<ul id="' + user + '"></ul>'));
}

function addMessage(msg, list) {
    console.log(list);
    var username = msg.user;
    var text_color = msg.color;
    var message = msg.message;
    var html_content = '<p><span>' + username + '</span>: ' + message + '</p>';
    $('.mesaje #' + list).append($('<li class="' + username + '">').html(html_content));
    $('.mesaje #' + list + ' .' + username + ' span').css("color", text_color);
}