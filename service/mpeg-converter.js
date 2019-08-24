/**
 *     Created by heyongchao on 2019/7/18 2:15 PM
 */
const debug = require("debug")("mpeg-redux");
var child_process = require("child_process")
var EventEmitter  = require("events").EventEmitter

class MpegMuxer extends EventEmitter {
    constructor(options) {
        super()
        this.setMaxListeners(0);
        this.id = options.id;
        this.lastTime = 0;
        this.currentTime = 0;
        this.url = options.url;
        if (options.display === "multiple") {
            this._startRtspMuxer();
            this._monitorRtsp();
        }
        else if (options.display === "single") {
            this._startRtpMuxer();
            this._monitorRtp();
        }
        this._listenEvent();

    }

    _listenEvent(){
        this.stream.stdout.on("data", (data) => {
            this.currentTime += 1;
            this.emit(this.id + "-data", data);
        })
        this.stream.stdout.on("error", (err) => {
            this.emit(this.id + "-error", err);
        })
        this.stream.stderr.on("data", (data) => {
            this.emit(this.id + "-output", data);
        });
    }

    _startRtspMuxer() {
        this.stream = child_process.spawn("ffmpeg", ["-rtsp_transport", "tcp", '-r', '25', "-i", this.url, '-threads', '8', '-f', 'mpegts', '-c:v', 'mpeg1video', '-s', '960x540', '-b:v', '1500k', '-preset', 'ultrafast', '-preset', 'zerolatency', '-bf', '0', '-'], {
            detached: false
        });
    }

    _startRtpMuxer() {
        this.currentTime = 0;
        this.lastTime = 0;
        this.stream = child_process.spawn("ffmpeg", ['-r', '25', "-i", this.url, '-threads', '8', '-vcodec', 'h264', '-b:v', '1500k', '-preset', 'ultrafast'], {
        //this.stream = child_process.spawn("ffmpeg", ['-r', '25', "-i", this.url, '-threads', '8', '-f', 'mpegts', '-c:v', 'mpeg1video', '-s', '960x540', '-b:v', '1500k', '-preset', 'ultrafast', '-preset', 'zerolatency', '-bf', '0', '-'], {
            detached: false
        });
    }

    _monitorRtsp(){
        this.timerRtsp = setInterval(() => {
            if (this.currentTime > this.lastTime) {
                this.lastTime = this.currentTime = 0;
            }
            else {
                console.log("restart rtsp hangout ffmpeg");
                debug("restart rtsp hangout ffmpeg");
                this.stream.stdout.end();
                this.stream.kill();
                this._startRtspMuxer();
                this._listenEvent("multiple");
            }
        }, 5000);
    }

    _monitorRtp() {
        this.timerRtp = setInterval(() => {
            if (this.currentTime > this.lastTime) {
                this.lastTime = this.currentTime = 0;
            }
            else {
                debug("restart rtp hangout ffmpeg");
                console.log("restart rtp hangout ffmpeg");
                this.stream.stdout.end();
                this.stream.kill();
                this._startRtpMuxer();
                this._listenEvent("single");
            }
        }, 5000);
    }

    destory(){
        this.timerRtp && clearInterval(this.timerRtp);
        this.timerRtsp && clearInterval(this.timerRtsp);
    }
}
module.exports = MpegMuxer;