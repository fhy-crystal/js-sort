let http = require('http');
let fs = require('fs');
let zlib = require('zlib');

let server = http.createServer((req, res) => {
    // readFile 先把所有数据全读到内存，然后回调
    // 1. 及其占用内存， 2.资源利用及其不充分（内存和磁盘运用不均）
    // fs.readFile(`www${req.url}`, (err, data) => {
    //     if (err) {
    //         res.writeHead(404);
    //         res.write('Not Found');
    //     } else {
    //         res.write(data);
    //     }

    //     res.end();
    // })
    res.setHeader('content-encoding', 'gzip');
    let rs = fs.createReadStream(`www${req.url}`);
    let gzip = zlib.createGzip(); // 压缩
    rs.on('error', err => {
        res.writeHead(404);
        res.write('Not Found');
        res.end();
    })
    rs.pipe(gzip).pipe(res);
    // rs.pipe(res)
})
server.listen(8181);