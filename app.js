
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var usernames = [];
var messages = [];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
    res.render('index');
});

io.set('log level', 2);
io.sockets.on('connection', function(socket){
    socket.on('username', function(data, callback){
        console.log(usernames.indexOf(data));
        if(usernames.indexOf(data) !== -1){
            callback({flag: false, data: data});
        }else{
            callback({flag: true, data: data});
            usernames.push(data);
            messages.push('<div><strong>----&nbsp;&nbsp;'+ data + '&nbsp;&nbsp;在&nbsp;&nbsp;' +
                new Date().toLocaleTimeString() +
                '&nbsp;&nbsp;连接到了聊天室' +'</strong></div>');
            socket.username = data;
            console.log('Usernames are: ' + usernames);
            io.sockets.emit('usernames', usernames);
            io.sockets.emit('messages', {
                messages: messages
            });
        }
    });

    socket.on('messages', function(data){
        fs.appendFile('message.txt', socket.username + ' : '
            + data + '  (' + new Date().toUTCString() + ')\r\n', function(err){
            if(err) throw err;
        });
        if(messages.length < 100){
            messages.push('<div><strong id="poster-name">' + socket.username + '</strong>&nbsp;&nbsp;' +
                new Date().toLocaleTimeString() +
                '<div>&nbsp;&nbsp;&nbsp;&nbsp;' + data + '</div></div>');
        }else{
            messages.shift();
            messages.push('<div><strong id="poster-name">' + socket.username + '</strong>&nbsp;&nbsp;' +
                new Date().toLocaleTimeString() +
                '<div>&nbsp;&nbsp;&nbsp;&nbsp;' + data + '</div></div>');
        }
        io.sockets.emit('messages', {
            messages: messages
        });

    });

    socket.on('relogin', function(){
        if(!usernames) return;
        if(usernames.indexOf(socket.username) > -1){
            //将当前断开的连接的用户从数组中移除
            usernames.splice(usernames.indexOf(socket.username), 1);
            //记录用户的登出消息 并且广播出去
            messages.push('<div><strong>----&nbsp;&nbsp;'+ socket.username + '&nbsp;&nbsp;在&nbsp;&nbsp;' +
                new Date().toLocaleTimeString() +
                '&nbsp;&nbsp;离开了聊天室' +'</strong></div>');
            io.sockets.emit('messages', {
                messages: messages
            });
        }
        console.log('Usernames are: ' + usernames);
        io.sockets.emit('usernames', usernames);
    });

    socket.on('disconnect', function(){
        if(!usernames) return;
        if(usernames.indexOf(socket.username) > -1){
            //将当前断开的连接的用户从数组中移除
            usernames.splice(usernames.indexOf(socket.username), 1);
            //记录用户的登出消息 并且广播出去
            messages.push('<div><strong>----&nbsp;&nbsp;'+ socket.username + '&nbsp;&nbsp;在&nbsp;&nbsp;' +
                new Date().toLocaleTimeString() +
                '&nbsp;&nbsp;离开了聊天室' +'</strong></div>');
            io.sockets.emit('messages', {
                messages: messages
            });
        }
        console.log('Usernames are: ' + usernames);
        io.sockets.emit('usernames', usernames);
    });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
