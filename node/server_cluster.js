let http = require('http');
let cluster = require('cluster');
let cpuNum = require('os').cpus().length;
let process = require('process')

if (cluster.isMaster) {
    // 主进程（守护进程），才能分裂
    console.log(cpuNum);
    for (let i = 0; i < cpuNum; i++) {
        cluster.fork();
    }
} else {
    // 子进程（工作进程），执行逻辑，一个进程满了才会唤起另一个
    http.createServer((req, res) => {
        console.log(process.pid);
        res.write('aaa')
        res.end();
    }).listen(8181);
}