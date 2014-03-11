#NodeJs学习 Express+jade+socket.io的聊天室
   聊天室页面不能刷新 刷新会断开连接 考虑解决方法
   聊天室中能保存100条信息
   本聊天室基于NodeJs+chrome浏览器完成
###笔记
   1.首先制作html页面,完成后转义成jade编码
      聊天室的页面基本只有一个页面,使用的方式是连接时候显示登陆用户名界面,
      检测用户名没有问题之后再将登陆界面hide,show出聊天室页面.
   2.完成界面之后,依据界面开发app.js,app.js中需要改造和express结合的socket.io
      具体代码如下
        var server = http.createServer(app);
        var io = require('socket.io').listen(server);
      拿到io对象这样就能对客户端进行操作了.
   3.页面中作为登陆用户名的表单需要使用客户端的socket.io将提交内容通知给服务器端的socket.io
      客户端的socket对象获取方法为:
        先导入socket.io.js库文件,然后 var socket = io.connect();即获得socket对象
        用户名需要在客户端预先验证是否合法在传给后台.
        用户名通过socket.on('username', usernameVal, callback)的方式通知服务器,并且创建一个用户名是否重名的回调函数
   4.服务器端的用户名使用一个数组保存,检测用户名是否重名.
      将用户名保存在socket中,当连接断开的时候,将此用户删除
      调用客户端的回调.创建成功就隐藏登陆,显示聊天室
   5.聊天室中的消息默认是保存100条,超过100条会shift掉之前的数据,这个数据是保存在数组中的
      *暂未解决的问题: html未转义,会被脚本侵入
   6.添加聊天室中登出的操作 添加button,监听click事件

###一些改动
    2014-3-11 15:09:07
    1.修改了消息推送的代码,让消息推送能够让载体div自动滑动到底部以显示最新的消息
    2.添加用户连接到聊天室的信息和离开聊天室的信息
    3.添加键盘事件  让sendMessageForm中不用按Post直接Enter也可以发表消息
    4.记录聊天信息将聊天的所有记录都储存在message.txt文本中
聊天室的东西先做到这里了 后面想起功能会继续添加的
