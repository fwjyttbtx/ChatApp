#NodeJs学习 Express+jade+socket.io的聊天室<br />
&nbsp; &nbsp;聊天室页面不能刷新 刷新会断开连接 考虑解决方法<br />
&nbsp; &nbsp;聊天室中能保存100条信息<br />
&nbsp; &nbsp;本聊天室基于NodeJs+chrome浏览器完成<br />
###笔记<br />
&nbsp; &nbsp;1.首先制作html页面,完成后转义成jade编码<br />
&nbsp; &nbsp; &nbsp; 聊天室的页面基本只有一个页面,使用的方式是连接时候显示登陆用户名界面,<br />
&nbsp; &nbsp; &nbsp; 检测用户名没有问题之后再将登陆界面hide,show出聊天室页面.<br />
&nbsp; &nbsp;2.完成界面之后,依据界面开发app.js,app.js中需要改造和express结合的socket.io<br />
&nbsp; &nbsp; &nbsp; 具体代码如下<br />
&nbsp; &nbsp; &nbsp; &nbsp; var server = http.createServer(app);<br />
&nbsp; &nbsp; &nbsp; &nbsp; var io = require('socket.io').listen(server);<br />
&nbsp; &nbsp; &nbsp; 拿到io对象这样就能对客户端进行操作了.<br />
&nbsp; &nbsp;3.页面中作为登陆用户名的表单需要使用客户端的socket.io将提交内容通知给服务器端的socket.io<br />
&nbsp; &nbsp; &nbsp; 客户端的socket对象获取方法为:<br />
&nbsp; &nbsp; &nbsp; &nbsp; 先导入socket.io.js库文件,然后 var socket = io.connect();即获得socket对象<br />
&nbsp; &nbsp; &nbsp; &nbsp; 用户名需要在客户端预先验证是否合法在传给后台.<br />
&nbsp; &nbsp; &nbsp; &nbsp; 用户名通过socket.on('username', usernameVal, callback)的方式通知服务器,并且创建一个用户名是否重名的回调函数<br />
&nbsp; &nbsp;4.服务器端的用户名使用一个数组保存,检测用户名是否重名.<br />
&nbsp; &nbsp; &nbsp; 将用户名保存在socket中,当连接断开的时候,将此用户删除<br />
&nbsp; &nbsp; &nbsp; 调用客户端的回调.创建成功就隐藏登陆,显示聊天室<br />
&nbsp; &nbsp;5.聊天室中的消息默认是保存100条,超过100条会shift掉之前的数据,这个数据是保存在数组中的<br />
&nbsp; &nbsp; &nbsp; *暂未解决的问题: html未转义,会被脚本侵入（已解决）<br />
&nbsp; &nbsp;6.添加聊天室中登出的操作 添加button,监听click事件<br />
<br />
###一些改动<br />
&nbsp; &nbsp; 2014-3-11 15:09:07<br />
&nbsp; &nbsp; 1.修改了消息推送的代码,让消息推送能够让载体div自动滑动到底部以显示最新的消息<br />
&nbsp; &nbsp; 2.添加用户连接到聊天室的信息和离开聊天室的信息<br />
&nbsp; &nbsp; 3.添加键盘事件 &nbsp;让sendMessageForm中不用按Post直接Enter也可以发表消息<br />
&nbsp; &nbsp; 4.记录聊天信息将聊天的所有记录都储存在message.txt文本中<br />
&nbsp; &nbsp; 5.修改了登陆后错误依然存在的问题 显示了发言人的颜色<br />
&nbsp; &nbsp; 6.添加title和将发送消息快捷键改成Ctrl+Enter<br /><br />
&nbsp; &nbsp; 2014年3月24日10:01:11<br />
&nbsp; &nbsp; 7.添加创建本地存储文件夹的代码<br />
<br />
聊天室的东西先做到这里了 后面想起功能会继续添加的
