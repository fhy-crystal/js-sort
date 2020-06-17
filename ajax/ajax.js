function ajax(options) {
    let {
        type='GET', 
        url, 
        dataType='JSON', 
        data={}, 
        success, 
        error
    } = options;
    // 处理数据
    let dataArr = [];
    let strData = '';
    for (let key in data) {
        dataArr.push(`${key}=${data[key]}`); // [key=value, key=value] 
    }
    strData = dataArr.join('&'); // key=value&key=value

    let xhr = new XMLHttpRequest(); // readyState = 0 初始化
    if (type == 'GET') {
        xhr.open('GET', `${url}?${strData}`, true); // readyState = 1 连接
        xhr.send(); // readyState = 2 发送
    } else {
        xhr.open('POST', `${url}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(strData);
    }
    xhr.onreadystatechange = function() {
        // readyState = 3 接收head
        // readyState = 4 接收body
        if (xhr.readyState == 4) {
            let res = xhr.responseText;
            switch (dataType) {
                case 'JSON':
                    if (window.JSON && JSON.parse) {
                        res = JSON.parse(res);
                    } else {
                        res = eval('(' + res + ')');
                    }
                    break;
                case 'TEXT':
                    break;
                case 'XML':
                    res = xhr.responseXML;
                    break;
            }
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                success && success(res);
            } else {
                error && error();
            }
        }
    }
}