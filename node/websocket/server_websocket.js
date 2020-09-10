const net = require('net');
const crypto = require('crypto')
let server = net.createServer(sock => {
    console.log('连接了');

    // 握手只有一次
    sock.once('data', data => {
        console.log('hand shake start...');

        let strData = data.toString();
        let arrData = strData.split('\r\n');
        arrData = arrData.slice(1, arrData.length - 2);
        let headers = {};
        arrData.forEach(item => {
            let [key, value] = item.split(': ');
            headers[key.toLowerCase()] = value;
        })

        if (headers['upgrade'] != 'websocket') {
            console.log(`其他协议：${headers['upgrade']}`);
            sock.end();
        } else if (headers['sec-websocket-version'] != 13) {
            console.log(`版本不对：${headers['sec-websocket-version']}`);
            sock.end();
        } else {
            let key = headers['sec-websocket-key'];
            let mask = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

            // sha1(key+mask) -> base64 => client
            let hash = crypto.createHash('sha1');
            hash.update(key + mask);
            let hashKey = hash.digest('base64');

            sock.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${hashKey}\r\n\r\n`);

            console.log('hand shake end');
        }

        sock.on('data', data => {
            console.log('有数据');

            let fin = data[0]&0x001;
            let opcode = data[0]&0x0F0;

            let mask = data[1]&0x001;
            let payload = data[1] & 0x0FE;
            console.log(fin, opcode);
            console.log(mask, payload);
        })
    })
    sock.on('end', () => {
        console.log('断开了');
    })
})
server.listen(8066);