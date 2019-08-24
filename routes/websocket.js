/**
 *     Created by heyongchao on 2019/7/18 12:57 PM
 */

var express = require('express');
var expressWs = require('express-ws');

var router = express.Router();
expressWs(router);
const WebSocket = require("ws");

const MpegMuxer = require("../service/mpeg-converter");
const querystring = require('querystring')
const debug = require("debug")("rtsp-server");
const url = require("url");
var socketServer = require('../service/socketServer');



CLIENTS = {};
PROC = {};
PROC_LRU = {};
THRESHOLD = 16;

router
    .ws('/', function (ws, req){
        ws.send('你连接成功了');
        var name = url.parse(req.url).pathname;
        var arg = url.parse(req.url).query;
        var params = querystring.parse(arg);
        var rtspAddr = params.addr;
        var display =  params.method;
        if(!name || !arg || !rtspAddr){
            debug(`requested url ${req.url} is error`);
            return;
        }
        else
            debug(`requested url is ${req.url}`);


        if (! (rtspAddr in CLIENTS)){
            debug("client for new channel");
            CLIENTS[rtspAddr] = [ws];
            //create a child_process to convert video type
            var muxer = new MpegMuxer({id: name , url: rtspAddr, display: display});
            PROC[rtspAddr] = muxer;
            muxer.on(name + "-data", (data) =>{
                CLIENTS[rtspAddr] =  CLIENTS[rtspAddr].filter((ele) => ele.readyState === WebSocket.OPEN);
                CLIENTS[rtspAddr].forEach((client) =>{
                    client.send(data);
                });
            });
            muxer.on(name + "-error", (err) => {
                debug(`the error happend for ${name} : ${err}`)
            });
            muxer.on(name + "-output", (output) => {
                debug(`the output for ${name} : ${output}`);
            })

        }
        else {
            debug("client for existing channel");
            CLIENTS[rtspAddr].push(ws);
        }

        ws.on('message', function (msg) {
            // 业务代码
            console.log("msg:",msg);
        });
        ws.on('close',()=> {
            CLIENTS[rtspAddr] =  CLIENTS[rtspAddr].filter((ele) => ele.readyState === WebSocket.OPEN)
            //close no connected process
            Object.keys(CLIENTS).forEach((rtsp) =>{
                if(Object.keys(CLIENTS).length > THRESHOLD && CLIENTS[rtsp].length === 0 ){
                    debug("there are no socket listening " + rtsp);
                    PROC[rtsp].stream.stdout.end();
                    PROC[rtsp].stream.kill();
                    PROC[rtsp].destroy();
                    delete PROC[rtsp];
                    delete CLIENTS[rtsp];
                }

            });
        })
    })
    .ws('/getVideo', function(ws, req) {
        socketServer.init(ws);
    })
    .post('/post', function(req, res) {
    });

module.exports = router;
