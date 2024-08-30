// 钉钉(dingding)自动抢红包脚本 2024-04-09 15:50:00

// 只能获取到屏幕可见的红包，进行点击处理，不可见的无法进行操作。

// 导入工具类
const utils = require('./utils');

// 入口函数
function main() {
  // 检查无障碍服务是否已经启用，如果没有启用则跳转到无障碍服务启用界面，并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行。
  auto.waitFor();
  // 设置开发机的屏幕尺寸
  setScreenMetrics(1080, 2280);

  // 领取红包
  // receiveHb(0);
  // 抢到多少钱
  // console.log(id("redpackets_money").findOnce().text());

  // 没有抢的红包
  // id("tv_bless_word")
  // text("恭喜发财，大吉大利！")

  // 抢完的红包
  // id("tv_bless_word")
  // text("手慢了，抢完了")

  // var listView = className("android.widget.ListView").findOne();
  // console.log(listView);
  // listView.scrollDown();
  // // 保证一直在底部
  // setInterval(() => {
  //   // scrollDown();
  //   listView.scrollDown();
  // }, 500);
}

// 领取红包
function receiveHb(index) {
  // 获取当前屏幕未领取的红包
  const item = text("拼手气红包").findOnce(index);
  // 红包是否可以领取
  let isReceive = true;
  // 是否找到
  if (!!item) {
    // 获取红包最大的父容器
    const parent = item.parent();
    // 点击红包
    click(parent.bounds().centerX(), parent.bounds().top + 80);
    // 获取文案
    const word = id("tv_bless_word").findOne(1000);
    // 是否领完了
    if (word && word.text() == "手慢了，抢完了") {
      // 红包不可以领取
      isReceive = false;
      // 返回继续领取
      back();
    } else {
      // 领取红包子元素
      const receive_sub = text("看看大家的手气").findOne(1000);
      // 是否找到这个子元素
      if (receive_sub) {
        // 找到了，点击领取
        const receive_parent = receive_sub.parent().parent()
        click(receive_parent.bounds().centerX(), receive_parent.bounds().centerY() + 350);
      }
      // 是否已经进入了领取红包页面
      if (!!text("钉钉红包").findOne(2000)) {
        // 返回继续领取
        back();
      }
    }
  }
  // 延迟执行
  sleep(100);
  // 继续领取
  if (isReceive) {
    // 这一个红包可以领取，则从 0 重新开始查找，屏幕上没找到也算做领取了
    receiveHb(0);
  } else {
    // 这一个红包不可以领取，从下一个红包开始查找
    receiveHb(index + 1);
  }
}

// 调用
main();


