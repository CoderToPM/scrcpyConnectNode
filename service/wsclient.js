/**
 *     Created by heyongchao on 2019/7/18 1:25 PM
 */
var ws = require("ws");

class WsClient {
    init(){

        // url ws://127.0.0.1:3001
        // 创建了一个客户端的socket,然后让这个客户端去连接服务器的socket
        var sock = new ws("ws://127.0.0.1:3001");
        sock.on("open", function () {
            console.log("connect success !!!!");

            sock.send("HelloWorld1");
            sock.send("HelloWorld2");
            sock.send("HelloWorld3");
            sock.send("HelloWorld4");
            sock.send(Buffer.alloc(10));
        });

        sock.on("error", function(err) {
            console.log("error: ", err);
        });

        sock.on("close", function() {
            console.log("close");
        });

        sock.on("message", function(data) {
            console.log(data);
        });
    }
};
module.exports = new WsClient();