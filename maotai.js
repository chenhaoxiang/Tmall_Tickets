/**
 * 定时器
 * @type {null}
 */
var timer = null;

/**
 * 淘宝的时间，毫秒
 * @type {number}
 */
var taoBaoTime = new Date().getTime();

/**
 * 检测状态
 * @param path
 * @param callback
 */
function checkElementState(path, callback) {
    var ele = document.querySelector(path);
    if (ele) {
        callback && callback();
    } else {
        console.log('异步加载元素中....' + path);
        setTimeout(function () {
            checkElementState(path, callback);
        }, 200);
    }
}


/**
 * 点击购买按钮
 */
function clickBuy() {

    console.log('买！');

    //票的数量  如果还不可以购买，这个地方获取会失败
    var amount = document.getElementsByClassName('mui-amount-increase')[0];
    amount && amount.click();  //+1

    var btnBuy = document.querySelector('');

}


/**
 * 结算
 */
function checkOut() {


    console.log('结算开始....');
    var btn = document.getElementById('J_Go');

    if (btn) {
        btn.click();
    } else {
        console.log('结算按钮没找到');
    }

}

/**
 * 购物车倒计时结束便会到这里
 */
function checkOutAsync() {
    //点击结算
    checkElementState('#J_Go', checkOut);
}

/**
 * 提交订单
 */
function submitOrder() {

    console.log('提交订单开始....');


    checkElementState('.go-btn', function () {
        var btn = document.querySelector(".go-btn");

        if (btn) {
            btn.click();
        } else {
            console.log('提交订单按钮没找到');
        }

    });
}


/**
 * 目标时间,也就是开始抢购的时间点
 * @type {Date}
 */
var dDate = new Date();  //10点和20点开抢
if (dDate.getHours() < 10) {
    dDate.setHours(9, 59, 59.2);
} else {
    dDate.setHours(19, 59, 59.2);
    // dDate.setHours(21, 59, 59.2);
}

/**
 * 间隔时间：毫秒
 * @type {number}
 */
var intervalTime = 300;

var times = 0;
/**
 * 进入时间判断循环
 * @param callback
 */
function enterTimeCheckLoop(callback) {
    //当前的时间，获取淘宝的时间，而不是本地的
    var time = dDate.getTime();
    var diff = time - taoBaoTime;
    console.log("距离开始抢购倒计时：" + diff + "毫秒/" + (diff/1000)+"秒,倒计时次数:" + (++times));
    //间隔时间需要计算，当在1分钟内时，使用300。暂时先这样吧
    if(diff < 20000){
        intervalTime=300;
    }else if(diff < 60000){
        intervalTime=1000;
    }else if(diff < 300000 ){
        intervalTime = 10000;
        console.log('间隔时间大于1分钟，10秒输出一次倒计时');
    }else {
        intervalTime = 30000;
        console.log('间隔时间大于5分钟，30秒输出一次倒计时');
    }
    if (diff < -900) {
        console.log('时间过了！');
    } else if (diff < 400) {
        //当误差时间在500毫秒，开始进行抢购，这里不稳，可以修改为400毫秒
        callback && callback();
        console.log('时间到了！开抢');
    } else {
        //这里是300毫秒一次请求,这里的间隔时间呀，应该动态变化，现在这个请求太频繁，没必要，我想想
        setTimeout(function () {
            //在判断前，进行请求一次淘宝的时间,更新 taoBaoTime
            getTaoBaoTime();
            enterTimeCheckLoop(callback);
        }, intervalTime);
    }
}


//主要函数
function main() {
    console.log('############################开始抢购茅台############################');

    //debugger;
    getTaoBaoTime();

    var href = window.location.href;
    if (href.indexOf('cart.tmall.com') > -1) {
        //结算页面

        //进入时间判断
        enterTimeCheckLoop(checkOutAsync);


    } else if (href.indexOf('buy.tmall.com') > -1) {
        //提交订单页面

        submitOrder();
    }else {
        console.log('本页面地址不对，请进入天猫购物车结算页面');
    }

}


main();