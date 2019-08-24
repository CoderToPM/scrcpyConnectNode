var express = require('express');
var router = express.Router();
const fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('video', { title: 'Video' });
  //res.render('video_wfs', { title: 'Video' });
});


router.get('/video1', function(req, res, next) {

    let head = { 'Content-Type': 'video/mp4' };
    //需要设置HTTP HEAD
    res.writeHead(200, head);
    //使用pipe
    fs.createReadStream('./files/VID_20181215_075710.mp4')
        .pipe(res);

});
router.get('/video', function(req, res, next) {
    let path = './files/VID_20181215_075710.mp4';
    let stat = fs.statSync(path);
    let fileSize = stat.size;
    let range = req.headers.range;

    // fileSize 3332038

    if (range) {
        //有range头才使用206状态码

        let parts = range.replace(/bytes=/, "").split("-");
        let start = parseInt(parts[0], 10);
        let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;

        // end 在最后取值为 fileSize - 1
        end = end > fileSize - 1 ? fileSize - 1 : end;

        let chunksize = (end - start) + 1;
        let file = fs.createReadStream(path, { start, end });
        let head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        let head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }

});

/*io.on('connection', function(ws){ // socket相关监听都要放在这个回调里
    console.log('a user connected');
    ws.on('error', (err)=>{
        debug(`${err} happened for connection`);
    });

    ws.on("disconnect", function() {
        console.log("a user go out");
    });

    ws.on("msg", function(obj) {
        //延迟3s返回信息给客户端
        setTimeout(function(){
            console.log('the websokcet message is'+obj);
            io.emit("msg", obj);
        },3000);
    });
});
//开启端口监听socket
server.listen(3001);*/

module.exports = router;
