const http = require('http');
const queryString = require('querystring');
const urlLib = require('url');

http.createServer((req, res) => {
    let {
        pathname: url, 
        query: getData
    } = urlLib.parse(req.url, true)
    // req.headers['origin'] == 'null' || /^https?:\/\/(\w+\.)+aaa\.com/.test(req.headers['origin'])
    // 文件调试或本地调试
    if (req.headers['origin'] == 'null' || req.headers['origin'].startsWith('http://localhost')) {
        res.setHeader('Access-Control-Allow-Origin', '*')
    }
    
    let arr = [];
    req.on('data', data => {
        arr.push(data);
    })
    req.on('end', () => {
        let postData = queryString.parse(Buffer.concat(arr).toString());
        console.log(url, getData, postData);
        res.end();
    })
    
}).listen(8066);

// const express = require('express')
// const bodyParser = require('body-parser')
// const multer = require('multer')

// let app = express();
// app.listen(8066);

// app.use(bodyParser.urlencoded({
//     extended: true
// }))
// let multerObj = multer({
//     dest: './upload/'
// });
// app.use(multerObj.any())

// app.post('/login', (req, res) => {
//     console.log(req.body);
//     console.log(req.files);
//     res.send('ok')
// })
