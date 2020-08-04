const http = require('http');
const url = require('url');
const fs = require('fs');
const queryString = require('querystring');
let users = {};

let server = http.createServer((req, res) => {
    let {
        pathname,
        query
    } = url.parse(req.url, true);
    let str = '';
    
    switch (pathname) {
        case '/set':
            req.on('data', data => {
                str += data;
            })
            req.on('end', () => {
                let {user, pwd} = queryString.parse(str);
                if (!user) {
                    res.write(`{"status": 500, "msg": "username is required"}`)
                } else if (!pwd) {
                    res.write(`{"status": 500, "msg": "password is required"}`)
                } else if (users[user]) {
                    res.write(`{"status": 500, "msg": "username is exist"}`)
                } else {
                    users[user] = pwd
                    res.write(`{"status": 200, "msg": "success"}`)
                }
                res.end()
            })
            break;
        case '/login':
            let {user, pwd} = query;
            if (!user) {
                res.write(`{"status": 500, "msg": "username is required"}`)
            } else if (!pwd) {
                res.write(`{"status": 500, "msg": "password is required"}`)
            } else if (!users[user]) {
                res.write(`{"status": 500, "msg": "username is not exist"}`)
            } else if (users[user] != pwd) {
                res.write(`{"status": 500, "msg": "username or password is error"}`)
            } else {
                res.write(`{"status": 200, "msg": "success"}`)
            }
            res.end()
            break;
        default:
            fs.readFile(`www${pathname}`, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.write('Not Found');
                } else {
                    res.write(data);
                }
                res.end()
            })
            break;
        
    }
    
    
})
server.listen(8181);