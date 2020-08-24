let http = require('http');
let fs = require('fs');
let url = require('url');

// 1.第一次：S->C: 'last-modified'
// 2.第二次：C->S: 'if-modified-since'
// 3.第二次：S->C: 200||304
http.createServer((req, res) => {
    let {pathname} = url.parse(req.url);
    fs.stat(`www${pathname}`, (err, stats) => {
        if (err) {
            res.writeHead(404);
            res.write('Not Found');
            res.end();
        } else {
            if (req.headers['if-modified-since']) {
                let mTime = new Date(req.headers['if-modified-since'])
                let timeClient = Math.floor(mTime.getTime() / 1000)
                let timeServer = Math.floor(stats.mtime.getTime() / 1000)
                if (timeServer > timeClient) {
                    sendFileToClient();
                } else {
                    res.writeHead(304);
                    res.write('Not Modified');
                    res.end();
                }
            } else {
                sendFileToClient();
            }
            
            function sendFileToClient() {
                let rs = fs.createReadStream(`www${pathname}`);
                res.setHeader('last-modified', stats.mtime.toUTCString());
                // 输出
                rs.pipe(res);
                rs.on('error', err => {
                    if (err) {
                        res.writeHead(404);
                        res.write('Not Found');
                        res.end();
                    }
                })
            }
            
        }
    })
    
}).listen(8181)