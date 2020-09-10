let sql = require('mysql');

let pool = sql.createPool({
    host: '127.0.0.1',
    port: 8889,
    user: 'root',
    password: 'admin',
    database: 'test'
})
// INSERT INTO user (id, name, gender, math, chinese) VALUES (0, 'Rukuro', '男', 80, 80)
// UPDATE user SET name='Blue' WHERE id=1
// DELETE FROM user WHERE id=1
// SELECT name, gender FROM user WHERE id=2
pool.query(`SELECT name, gender FROM user WHERE id=1`, (err, result) => {
    if (err) {
        console.log('插入失败', err);
    } else {
        console.log(result);
    }
})