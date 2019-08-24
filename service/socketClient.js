/**
 *     Created by heyongchao on 2019/7/18 8:36 PM
 */
// 1 引入模块
const net = require('net');
const readline = require('readline');

class SocketClient{
    init(){

// 2 创建套接字和输入输出命令行
        let rl = readline.createInterface({
// 调用std接口
            input:process.stdin,
            output:process.stdout
        })
        let client = new net.Socket();
// 3 链接
        client.connect(5000,'localhost');

        client.setEncoding('utf8');
        client.on('data',(chunk)=>{
            console.log(chunk);
        })
        client.on('error',(e)=>{
            console.log(e.message);
        })
// 绑定输io流事件,获取输入输出字符
        rl.on('line',(mes)=>{
            client.write(mes);
        })
    }
}
module.exports = new SocketClient();