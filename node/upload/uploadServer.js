let http = require('http');
let common = require('./common');
let fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let server = http.createServer((req, res) => {
    let arr = [];
    req.on('data', data => {
        arr.push(data)
    })
    req.on('end', () => {
        let queryData = {};
        let queryFiles = {};
        let data = Buffer.concat(arr);
        // 解析二进制文件上传数据
        if (req.headers['content-type']) {
            let contentType = req.headers['content-type'].split('; ')[1];
            if (contentType) {
                // 1.用 < 分隔符 > 拆分数据
                let boundary = `--${contentType.split('=')[1]}`
                let dataArr = data.split(boundary);
                // 2. 去头去尾
                dataArr.shift();
                dataArr.pop();
                // 3.去除每一项头尾"\r\n"
                dataArr = dataArr.map(item => item.slice(2, -2));
                // 4.用第一次"\r\n\r\n"拆分数据
                dataArr.forEach(item => {
                    let n = item.indexOf('\r\n\r\n');
                    let desc = item.slice(0, n);
                    let con = item.slice(n+4);
                    desc = desc.toString();
                    if (desc.indexOf('\r\n') == -1) {
                        // 普通数据
                        con = con.toString();
                        let key = desc.split('; ')[1].split('=')[1];
                        key = key.substring(1, key.length-1);
                        queryData[key] = con;
                    } else {
                        // 文件数据
                        let [line1, line2] = desc.split('\r\n');
                        let [, key, fileName] = line1.split('; ');
                        let type = line2.split(': ')[1];
                        key = key.split('=')[1];
                        fileName = fileName.split('=')[1];
                        key = key.substring(1, key.length - 1);
                        fileName = fileName.substring(1, fileName.length - 1);
                        let path = `file/${uuidv4().replace(/\-/g, '')}${fileName}`;
                        fs.writeFile(path, con, err => {
                            if (err) {
                                console.log('文件写入失败');
                            } else {
                                queryFiles[key] = {
                                    fileName,
                                    path,
                                    type
                                }
                                console.log('文件写入成功');
                            }
                            console.log(queryData, queryFiles);
                        })
                        
                    }
                });
                

            }
        }
        
        res.end(); 
    })
})

server.listen(8181)