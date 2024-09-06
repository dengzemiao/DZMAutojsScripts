// 钉钉(dingding)自动打卡脚本 2024-09-02 18:00:00
"ui";

// 权限处理
// 检查无障碍服务是否已经启用，如果没有启用则跳转到无障碍服务启用界面，并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行。
// auto.waitFor();
// 检查悬浮窗权限
// if (!floatyCheckPermission()) {
//   // 提示
//   toast("本服务需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
//   // 没有悬浮窗权限，提示用户并跳转请求
//   floatyRequestPermission();
//   // 退出
//   exit();
// }

// 本地存储
var storage = storages.create('dingding_dk_dzm');
// 定时器
var timer = null;
// 间隔时间（单位：毫秒）
var interval = 1 * 1000;
// 脚本是否每天自动跑，还是只跑当天
var isEveryday = true;
// 当前时间（时间格式：HH:mm:ss）
var times = storage.get('times') || [];
// 当前日期（日期格式：YYYY-MM-DD）
var today = getCurrentDate();
// 服务是否启动了
var isRun = false;
// 运行子线程
var thread = null;

// 入口函数
function main() {
  // UI渲染
  ui.layout(
    <frame>
      <vertical>、
        <ScrollView>
          <vertical padding="16">
            <text textSize="16sp" textColor="black" text="上班"/>
            <timepicker timePickerMode="spinner" id="timepicker1" />
            <text textSize="16sp" textColor="black" text="下班"/>
            <timepicker timePickerMode="spinner" id="timepicker2" />
            <button id="submit" text="启动服务"/>
            <text textSize="16sp" marginTop="20" textColor="#28A745" id="hint0" text="提示：本服务需要悬浮窗权限、无障碍服务启动，推荐设置电池不优化白名单保活。"/>
            <text textSize="16sp" marginTop="20" textColor="#28A745" id="hint0" text="注意：根据要求，依次打开下面权限，才能正常使用，点击没跳转则多次点击尝试。"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint1" text="【必选】1、启用无障碍服务。（点击）"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint2" text="【必选】2、打开悬浮窗权限。（点击）"/>
            <text textSize="16sp" marginTop="20" textColor="#0000FF" id="hint3" text="【建议】3、打开电池优化白名单。（点击）"/>
          </vertical>
        </ScrollView>
      </vertical>
    </frame>
  );
  // 设置为24小时制
  ui.timepicker1.setIs24HourView(true);
  ui.timepicker2.setIs24HourView(true);
  // 设置初始时间
  if (times.length > 0) {
    ui.timepicker1.setHour(times[0].split(':')[0]);
    ui.timepicker1.setMinute(times[0].split(':')[1]);
    ui.timepicker2.setHour(times[1].split(':')[0]);
    ui.timepicker2.setMinute(times[1].split(':')[1]);
  }
  // 点击无障碍服务
  ui.hint1.on("click", function() {
    accessibilityServicePage();
  })
  // 点击悬浮窗权限
  ui.hint2.on("click", function() {
    floatyRequestPermission();
  });
  // 点击电池优化
  ui.hint3.on("click", function() {
    batteryOptimizationPage();
  });
  // 点击启动
  ui.submit.on("click", function() {
    if (isRun) {
      // 停止服务
      stop();
    } else {
      // 获取上班时间
      let time1 = timeFillZero(ui.timepicker1.getHour(), ui.timepicker1.getMinute());
      // 获取下班时间
      let time2 = timeFillZero(ui.timepicker2.getHour(), ui.timepicker2.getMinute());
      // 保存时间
      times = [time1, time2];
      // 保存时间到本地存储
      storage.put('times', times);
      // 刷新时间表
      let timestamps = refreshTimestamps(today);
      // 如果时间表不为空，则添加定时器
      if (isEveryday || timestamps.length > 0) {
        // 启动服务
        run(timestamps);
      } else {
        // 停止服务
        stop();
      }
    }
  });
}

// 创建悬浮窗
function createWindow () {
  // 创建悬浮窗
  var window = floaty.window(
    <frame>
      <button
        id="status"
        text="运行中"
        textColor="#FFFFFF"
        textSize="18sp"
        layout_width="80dp"
        layout_height="80dp"
        layout_gravity="center"
      />
    </frame>
  );
  // 设置圆形背景
  window.status.setBackground(createCircleDrawable("#4CAF50"));
  // 初始化悬浮窗位置到右上角（单位：dp）
  // 获取屏幕宽度和高度
  // var screenWidth = device.width;
  var screenHeight = device.height;
  // 获取悬浮窗的宽度和高度
  var windowWidth = window.status.getWidth() || 80;
  var windowHeight = window.status.getHeight() || 80;
  // 计算屏幕中心坐标
  // var centerX = (screenWidth - windowWidth) / 2;
  var centerY = (screenHeight - windowHeight) / 2;
  // 初始化悬浮窗位置到屏幕中心
  window.setPosition(0, centerY);
  // 设置按钮点击事件
  // window.status.click(function () {
  //   // 打开当前应用
  //   try {
  //     app.launchPackage(context.getPackageName());
  //   } catch (error) {
  //     toast("打开应用失败");
  //   }
  // });
  // 初始化一些变量
  var x = 0, y = 0;
  var windowX, windowY;
  var downTime;
  // 设置拖动事件
  window.status.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
      case event.ACTION_DOWN:
        // 记录按下时的坐标和悬浮窗位置
        x = event.getRawX();
        y = event.getRawY();
        windowX = window.getX();
        windowY = window.getY();
        downTime = new Date().getTime();
        return true;
      case event.ACTION_MOVE:
        // 计算移动的距离并更新悬浮窗位置
        window.setPosition(windowX + (event.getRawX() - x), windowY + (event.getRawY() - y));
        return true;
      case event.ACTION_UP:
        // 如果按下和松开的时间短，认为是点击而非拖动
        if (new Date().getTime() - downTime < 200) {
          view.performClick();
        }
        return true;
    }
    return true;
  });
  // 返回悬浮窗
  return window
}

// 启动服务
function run (timestamps) {
  if (!isRun) {
    // 子线程处理
    thread = threads.start(function () {
      console.log('启动服务');
      // 前台保活
      KeepAliveService.start('dingding_dk_dzm', '凯狗专业列车');
      // 创建悬浮窗
      floaty.closeAll();
      createWindow();
      // 更新文案
      ui.submit.setText("停止服务");
      // 设置启动状态
      isRun = true;
      // 添加定时器
      addTimer(timestamps);
      // 提示用户
      toast("服务已启动");
    });
  }
}

// 停止服务
function stop () {
  if (isRun) {
    console.log('停止服务');
    // 停止前台保活
    KeepAliveService.stop();
    // 停止子线程
    thread && thread.interrupt();
    thread = null;
    // 移除定时器
    removeTimer();
    // 移除悬浮窗
    floaty.closeAll();
    // 设置启动状态
    isRun = false;
    // 更新文案
    ui.submit.setText("启动服务");
    // 提示用户
    toast('服务已停止');
  }
}

// 开始唤醒打卡
function start () {
  threads.start(function () {
    // 唤醒屏幕
    wakeUpAndUnlock();
    // 如果有在其他软件内，退出APP
    home();
    // 等待
    sleep(1000);
    // 回到应用列表第一页
    home();
    // 等待
    sleep(1000);
    // 打开钉钉
    clickDesc('钉钉');
  });
}

// 添加定时器
function addTimer(timestamps) {
  // 移除定时器
  removeTimer();
  // 定时唤醒屏幕
  timer = setInterval(() => {
    // 每天执行的情况
    if (isEveryday) {
      // 当前日期
      const currentDate = getCurrentDate();
      // 跟今天进行对比，是否同一天
      if (currentDate !== today) {
        // 更新日期
        today = currentDate
        // 刷新时间表
        timestamps = refreshTimestamps(currentDate);
      }
    }
    // 是否存在小于当前时间戳的时间表
    const isHas = hasExpiredTimestamps(timestamps);
    // 日志
    console.log('运行中：', isHas, new Date().getTime(), timestamps);
    // 存在则执行
    if (isHas) {
      // 移除已经过期的时间表
      timestamps = removeExpiredTimestamps(timestamps);
      // 开始执行任务
      start();
    }
    // 如果时间表为空，则停止定时器
    if (!isEveryday && timestamps.length === 0) {
      // 停止服务
      stop();
    }
  }, interval);
}

// 移除定时器
function removeTimer() {
  timer && clearInterval(timer);
  timer = null;
}

// 刷新时间表
function refreshTimestamps(today) {
  // 日期表（添加上今天日期）
  const dates = times.map(time => today + ' ' + time);
  // 时间戳表
  let timestamps = dates.map(date => datetimeToTimestamp(date));
  // 排序（从小到大）
  timestamps.sort(function(a, b) {
    return a - b;
  });
  // 移除已经过期的时间表
  timestamps = removeExpiredTimestamps(timestamps);
  // 日志
  // console.log(`
  //   时间表：${times}
  //   日期表：${dates}
  //   时间戳表：${timestamps}
  // `);
  // 返回时间戳
  return timestamps
}

// 唤醒设备并解锁
function wakeUpAndUnlock() {
  // 尝试唤醒屏幕
  device.wakeUpIfNeeded();
  // 等待屏幕点亮
  sleep(1000);
  // 屏幕是否唤醒成功
  if (!device.isScreenOn()) {
    // 如果还没有点亮，强制唤醒
    device.wakeUp();
    // 等待屏幕点亮
    sleep(1000);
  }
  // 针对机型处理
  var startX = device.width / 2;
  // 起点 Y 坐标（靠近屏幕底部）
  var startY = device.height * 0.8;
  // 终点 Y 坐标（靠近屏幕顶部）
  var endY = device.height * 0.2;
  // 进行下划操作（单位：毫秒）
  swipe(startX, endY, startX, startY, 500);
  // 等待下拉菜单
  sleep(1000);
  // 进行上划操作（单位：毫秒）
  swipe(startX, startY, startX, endY, 500);
  // 解锁，模拟上划解锁操作，起点和终点的坐标取决于你的设备的屏幕分辨率
  // 屏幕中间的 X 坐标
  // var startX = device.width / 2;
  // // 起点 Y 坐标（靠近屏幕底部）
  // var startY = device.height * 0.8;
  // // 终点 Y 坐标（靠近屏幕顶部）
  // var endY = device.height * 0.2;
  // // 进行上划操作，500 是滑动时间（单位：毫秒）
  // swipe(startX, startY, startX, endY, 500);
  // 等待解锁完成
  sleep(1000);
}

// 创建圆形背景
function createCircleDrawable(color) {
  var drawable = new android.graphics.drawable.GradientDrawable();
  drawable.setShape(android.graphics.drawable.GradientDrawable.OVAL); // 设置为圆形
  drawable.setColor(colors.parseColor(color)); // 设置背景颜色
  drawable.setStroke(5, colors.parseColor("#388E3C")); // 设置边框
  return drawable;
}

// 对时间进行补 0
function timeFillZero(hours, minutes) {
  return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':00';
}

// 根据 desc 进行点击（在当前屏幕上）
function clickDesc(value) {
  // 查找
  const el = desc(value).findOne();
  // 点击
  return click(el.bounds().centerX(), el.bounds().centerY());
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
    return !(expiredTimestamps.indexOf(timestamp) !== -1);
  });
  // 日志输出
  // console.log(`
  //   当前时间戳：${currentTimestamp}
  //   过期时间戳：${expiredTimestamps}
  //   剩余时间戳：${timestamps}  
  // `);
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
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  // 如果小于10，则在前面加上'0'
  const formattedMonth = month < 10 ? '0' + month : month;
  const formattedDay = day < 10 ? '0' + day : day;
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
  // 返回格式化后的字符串
  return year + '-' + formattedMonth + '-' + formattedDay + ' ' + formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
}


// 获取当前日期（日期格式：YYYY-MM-DD）
function getCurrentDate() {
  // 获取当前日期
  const date = new Date();
  // 获取当前年份
  const year = date.getFullYear();
  // 获取当前月份（月份从0开始，所以要加1）
  const month = date.getMonth() + 1;
  // 获取当前日期
  const day = date.getDate();
  // 如果月份小于10，则在前面加上'0'
  const formattedMonth = month < 10 ? '0' + month : month;
  // 如果日期小于10，则在前面加上'0'
  const formattedDay = day < 10 ? '0' + day : day;
  // 返回格式化后的字符串
  return year + '-' + formattedMonth + '-' + formattedDay;
}

// 请求悬浮窗权限
function floatyRequestPermission () {
  app.startActivity({
    action: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
    data: "package:" + context.getPackageName()
  });
}

// 电池优化页面
function batteryOptimizationPage() {
  app.startActivity({
    action: "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS"
  });
}

// 无障碍服务页面
function accessibilityServicePage() {
  app.startActivity({
    action: "android.settings.ACCESSIBILITY_SETTINGS"
  });
}

// 前台服务保活
let KeepAliveService = {
  // 开启
  start: function (id, title) {
    try {
      id = id || "";
      let channel_id = id + ".foreground";
      let channel_name = title + " 前台服务通知";
      let content_title = title + " 正在运行中";
      let content_text = "请勿手动移除该通知";
      let ticker = title + "已启动";
      let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
      let notification;
      let icon = context.getResources().getIdentifier("ic_3d_rotation_black_48dp", "drawable", context.getPackageName());
      if (device.sdkInt >= 26) {
        let channel = new android.app.NotificationChannel(channel_id, channel_name, android.app.NotificationManager.IMPORTANCE_DEFAULT);
        channel.enableLights(true);
        channel.setLightColor(0xff0000);
        channel.setShowBadge(false);
        manager.createNotificationChannel(channel);
        notification = new android.app.Notification.Builder(context, channel_id).setContentTitle(content_title).setContentText(content_text).setWhen(new Date().getTime()).setSmallIcon(icon).setTicker(ticker).setOngoing(true).build();
      } else {
        notification = new android.app.Notification.Builder(context).setContentTitle(content_title).setContentText(content_text).setWhen(new Date().getTime()).setSmallIcon(icon).setTicker(ticker).build();
      }
      manager.notify(1, notification);
    } catch (error) {
      console.warn("前台保活服务启动失败:" + error);
      console.warn("保活服务启动失败,不影响辅助的正常运行,继续挂机即可.");
    }
  },
  // 停止
  stop: function () {    
    let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
    manager.cancelAll();
  }
};

// 调用
main();

