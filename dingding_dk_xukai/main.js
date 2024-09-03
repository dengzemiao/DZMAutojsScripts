// 钉钉(dingding)自动打卡脚本 2024-09-02 18:00:00

// 定时器
var timer = null;
// 间隔时间（单位：毫秒）
var interval = 5 * 1000;

// 入口函数
function main() {
  // 检查无障碍服务是否已经启用，如果没有启用则跳转到无障碍服务启用界面，并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行。
  auto.waitFor();
  // 时间表
  const times = ['16:01:00', '18:04:00'];
  // 日期表（添加上今天日期）
  const dates = times.map(time => getCurrentDate() + ' ' + time);
  // 时间戳表
  let timestamps = dates.map(date => datetimeToTimestamp(date));
  // 排序（从小到大）
  timestamps.sort(function(a, b) {
    return a - b;
  });
  // 移除已经过期的时间表
  timestamps = removeExpiredTimestamps(timestamps);
  // 如果时间表不为空，则添加定时器
  if (timestamps.length > 0) {
    addTimer(timestamps);
  }
  // 日志
  console.log(`
    时间表：${times}
    日期表：${dates}
    时间戳表：${timestamps}
  `);
  // 提示用户
  toast('钉钉打卡脚本已启动');
}

// 功能实现
function run () {
  // 屏幕是否唤醒成功
  if (!device.isScreenOn()) {
    // 如果屏幕关闭，则打开屏幕
    device.wakeUp();
    // 等待屏幕点亮
    sleep(1000);
  }
  // 等待
  sleep(1000);
  // 解锁

  // 等待
  sleep(1000);
  // 退出APP
  home();
  // 等待
  sleep(1000);
  // 回到首页
  home();
  // 等待
  sleep(1000);
  // 打开钉钉
  click('钉钉');
}

// 添加定时器
function addTimer(timestamps) {
  // 定时唤醒屏幕
   timer = setInterval(() => {
    // 日志
    toast('脚本处于激活状态，正在执行任务');
    // 是否存在小于当前时间戳的时间表
    if (hasExpiredTimestamps(timestamps)) {
      // 移除已经过期的时间表
      timestamps = removeExpiredTimestamps(timestamps);
      // 定时唤醒屏幕
      run();
    }
    // 如果时间表为空，则停止定时器
    if (timestamps.length === 0) {
      removeTimer();
    }
  }, interval);
}

// 移除定时器
function removeTimer() {
  timer && clearInterval(timer);
  timer = null;
}

// 是否存在小于当前时间戳的时间表
function hasExpiredTimestamps(timestamps) {
  // 当前时间戳
  var currentTimestamp = new Date().getTime();
  // 是否存在小于当前时间戳的时间表
  return timestamps.some(function(timestamp) {
    return timestamp < currentTimestamp;
  });
}

// 移除过期时间戳
function removeExpiredTimestamps(timestamps) {
  // 当前时间戳
  var currentTimestamp = new Date().getTime();
  // 过期时间戳
  var expiredTimestamps = timestamps.filter(function(timestamp) {
    return timestamp < currentTimestamp;
  });
  // 移除过期时间戳
  timestamps = timestamps.filter(function(timestamp) {
    return !expiredTimestamps.includes(timestamp);
  });
  // 日志输出
  console.log(`
    当前时间戳：${currentTimestamp}
    过期时间戳：${expiredTimestamps}
    剩余时间戳：${timestamps}  
  `);
  // 返回剩余时间戳
  return timestamps;
}

// 日期转时间戳（日期格式：YYYY-MM-DD HH:mm:ss）
function datetimeToTimestamp(datetime) {
  const parts = datetime.split(' ');
  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':');

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // 月份从 0 开始
  const day = parseInt(dateParts[2], 10);

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);

  const date = new Date(year, month, day, hours, minutes, seconds);
  return date.getTime();
}

// 时间戳转日期（日期格式：YYYY-MM-DD HH:mm:ss）
function timestampToDatetime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 获取当前日期（日期格式：YYYY-MM-DD）
function getCurrentDate() {
  const date = new Date();
  
  const year = date.getFullYear(); // 获取当前年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取当前月份（月份从0开始，所以要加1）
  const day = String(date.getDate()).padStart(2, '0'); // 获取当前日期
  
  return `${year}-${month}-${day}`; // 返回格式化后的字符串
}

// 调用
main();


