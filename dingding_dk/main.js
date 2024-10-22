// 项目信息：钉钉(dingding)自动打卡脚本 2024-04-09 15:50:00
// 脚本版本：autojs 4.1.1
// 导入工具类
const utils = require('./utils');

// 入口函数
function main() {
  // 检查无障碍服务是否已经启用，如果没有启用则跳转到无障碍服务启用界面，并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行。
  auto.waitFor();
  // 设置开发机的屏幕尺寸
  setScreenMetrics(1080, 2280);
  // 确保在主页面
  home();
  // 延迟调用
  sleep(1000);
  // 确保在主页面
  home();
  // 延迟调用
  sleep(1000);
  // 点击钉钉
  utils.clickApp('钉钉');
  // 延迟调用
  sleep(10000);
  // 没有在消息界面则按登录流程走
  if (!text('消息').findOnce()) {
    // 点击下一步
    utils.clickText('下一步');
    // 延迟调用
    sleep(1000);
    // 点击下一步
    utils.clickText('同意并登录');
    // 延迟调用
    sleep(1500);
    // 点击下一步
    utils.clickText('密码登录');
    // 延迟调用
    sleep(1000);
    // 输入密码
    utils.setTextId('et_pwd_input', 'test123456')
    // setText('dzm340901')
    // 延迟调用
    sleep(1000);
    // 点击登录
    click('登录');
    // 延迟调用
    sleep(1000);
  }
  // 点击消息
  utils.clickText('消息');
  // 延迟调用
  sleep(2000);
  // 点击打卡
  utils.clickText('打卡');
  // 延迟调用
  sleep(10000);
  // 点击打卡
  click(device.width / 2, device.height / 2 + 220);
}

// 调用
main();


