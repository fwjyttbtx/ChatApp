var socket = io.connect();

jQuery(function($){
    var username = $('#username');
    var userRegForm = $('#user-reg-form');
    var userSub = $('.user-sub');
    var regContainer = $(".reg-container");
    var chatContainer = $(".chat-container");
    var userList = $(".user-list ul");
    var sendMessageForm = $("#send-message-form");
    var message = $("#send-message");
    var chatContent = $("#chat-content")
    var loginUsername = $("#login-username");
    var reLogin = $("#relogin")

    userRegForm.submit(function(event){
        event.preventDefault();

        var usernameVal = username.val();
        var prompt = $("#prompt");

        if(usernameVal.length > 6){
            userSub.addClass('error');
            prompt.empty().append('<h5>!用户名的长度必须小于或者等于6</h5>');
            return;
        }else if(usernameVal.trim() === '' || / /.test(usernameVal)){
            userSub.addClass('error');
            prompt.empty().append('<h5>!用户名不能含有空格或者为空</h5>');
            username.val('');
            return;
        }

        socket.emit('username', usernameVal, function(data){
              if(data.flag){
                  userSub.removeClass('error');
                  prompt.empty()
                  username.val('');
                  regContainer.hide();
                  chatContainer.show();
                  loginUsername.text(data.data);
              }else{
                  userSub.addClass('error');
                  prompt.empty().append('<h5>!聊天室中用户名已存在</h5>');
              }
        });
    });

    socket.on('usernames', function(data){
        var html = "<li class='nav-header'>在线列表</li>";
        for(var i = 0; i < data.length; i++){
            html += '<li>'+ data[i] +'</li>'
        }
        userList.empty().append(html);
    });

    sendMessageForm.keydown(function(event){
        if(event.keyCode == 13 && event.ctrlKey){
            sendMessageForm.submit();
            event.preventDefault();
        }
    })

    sendMessageForm.submit(function(event){
        event.preventDefault();
        var messageVal = message.val();
        //解决html转义问题.
        var mes1 = messageVal.replace(/</g, '&lt;');
        var mes2 = mes1.replace(/>/g, '&gt;');
        socket.emit('messages', mes2);
        message.val('').focus();
    });

    socket.on('messages', function(data){
        var html = '';
        var messages = data.messages;
        for(var i = 0; i < messages.length; i++){
            html += messages[i];
        }
        chatContent.html(html);
        chatContent.scrollTop(chatContent[0].scrollHeight);
    });

    reLogin.click(function(){
        socket.emit('relogin');
        regContainer.show();
        username.focus();
        chatContainer.hide();
    });
})