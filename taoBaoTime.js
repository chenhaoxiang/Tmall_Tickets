var http = {};
http.quest = function (option, callback, headUrl) {
    var url = option.url;
    var method = option.method;
    var data = option.data;
    var timeout = option.timeout || 0;
    var xhr = new XMLHttpRequest();
    (timeout > 0) && (xhr.timeout = timeout);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                var result = xhr.responseText;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                }
                callback && callback(null, result);
            } else {
                callback && callback('status: ' + xhr.status);
            }
        }
    }.bind(this);
    //打开 xhr
    xhr.open(method, url, true);
    //设置请求头，请求头的设置必须在xhr打开之后，并且在send之前
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    if (typeof data === 'object') {
        try {
            data = JSON.stringify(data);
        } catch (e) {
        }
    }
    xhr.send(data);
    xhr.ontimeout = function () {
        callback && callback('timeout');
        console.log('%c连%c接%c超%c时', 'color:red', 'color:orange', 'color:purple', 'color:green');
    };
};
http.get = function (url, callback, headUrl) {
    var option = url.url ? url : {url: url};
    option.method = 'get';
    this.quest(option, callback, headUrl);
};
http.post = function (option, callback, headUrl) {
    option.method = 'post';
    this.quest(option, callback, headUrl);
};
//
// //普通get请求
// http.get('http://www.baidu.com', function (err, result) {
//     // 这里对结果进行处理
// });
//

//
// //post请求
// http.post({url: '', data: '123', timeout: 1000}, function (err, result) {
//     // 这里对结果进行处理
// });
/**
 * 获取淘宝服务器的时间
 */
function getTaoBaoTime() {
    //定义超时时间(单位毫秒)
    http.get({
        url: 'https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp',
        timeout: 1000
    }, function (err, result) {
        // 这里对结果进行处理
        try {
            var obj = eval(result);
            // console.log('获取的淘宝时间请求结果：'+JSON.stringify(obj));
            taoBaoTime = parseInt(obj.data.t);
            console.log('获取的淘宝时间：' + taoBaoTime);
        } catch (e) {
            console.log('获取淘宝时间出异常啦，可以加QQ群：819539788了解下情况。' + e);
        }
    }, "api.m.taobao.com");
}
