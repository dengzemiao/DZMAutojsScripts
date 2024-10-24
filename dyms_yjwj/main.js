// 项目信息：红包助手 2024-10-21 11:00:00
// 脚本版本：autojs pro 9.3.11
"ui";
// 权限处理
// 检查无障碍服务是否已经启用，如果没有启用则跳转到无障碍服务启用界面，并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行。
// auto.waitFor();
// auto.setMode('fast');
// 检查悬浮窗权限
// if (!floatyCheckPermission()) {
//   // 提示
//   toast("本服务需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
//   // 没有悬浮窗权限，提示用户并跳转请求
//   floatyRequestPermission();
//   // 退出
//   exit();
// }

// 日志
var isLog = true;
// App名称
var appName = '抖音秒杀';
var appNameKey = 'dyms_yjwj';
// 本地存储
var storage = storages.create(appNameKey);
// 游戏ID
var gameId = storage.get('gameId') || '';
// 游戏昵称
var gameName = storage.get('gameName') || '';
// 服务是否启动了
var isRun = false;
// 运行子线程
var thread = null;

// ========================================= 《 公共 》

// 入口函数
function main() {
  // UI渲染
  ui.layout(
    <frame>
      <vertical>、
        <ScrollView>
          <vertical padding="16">
            <text text="【水哥哥的抖音秒杀】" textSize="20sp" marginBottom="10" textColor="black" gravity="center" />
            <text textSize="16sp" textColor="black" marginTop="10" text="游戏ID"/>
            <input hint="请输入" inputType="text" id="gameId"/>
            <text textSize="16sp" textColor="black" marginTop="10" text="游戏昵称"/>
            <input hint="请输入" inputType="text" id="gameName"/>
            <button marginTop="20" id="submit" text="启动服务"/>
            <button marginTop="20" id="console" text="查看日志"/>
            {/* <button marginTop="20" id="consoleclear" text="清空日志"/> */}
            <text textSize="16sp" marginTop="20" textColor="#28A745" id="hint0" text="提示：本服务需要悬浮窗权限、无障碍服务启动，推荐设置电池不优化白名单保活。根据要求，依次打开下面权限，才能正常使用，点击没跳转则多次点击尝试。"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint1" text="【必选】1、启用无障碍服务。（点击）"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint2" text="【必选】2、打开悬浮窗权限。（点击）"/>
            <text textSize="16sp" marginTop="20" textColor="#0000FF" id="hint3" paddingBottom="100" text="【建议】3、打开电池优化白名单。（点击）"/>
          </vertical>
        </ScrollView>
      </vertical>
    </frame>
  );
  // 设置游戏ID
  ui.gameId.setText(gameId + '');
  // 设置游戏昵称
  ui.gameName.setText(gameName + '');
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
  // 查看日志
  if (ui.console) {
    ui.console.on("click", function() {
      threads.start(function () {
        // 检查悬浮窗权限
        if (!checkFloatyPermission()) { return }
        // 打开与配置日志
        isLog = true
        console.hide();
        sleep(100);
        console.show();
        console.setTitle("日志");
        console.setPosition(240, 0);
      })
    });
  }
  // 清空日志
  if (ui.consoleclear) {
    ui.consoleclear.on("click", function() {
      threads.start(function () {
        console.clear();
      })
    });
  }
  // 点击启动
  ui.submit.on("click", function() {
    // 根据状态进行操作
    if (isRun) {
      // 停止服务
      stop();
    } else {
      // 获取游戏ID并存储
      gameId = (ui.gameId.getText() || '') + '';
      storage.put('gameId', gameId + '');
      // 获取游戏昵称并存储
      gameName = (ui.gameName.getText() || '') + '';
      storage.put('gameName', gameName + '');
      // 启动服务
      run();
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
        textSize="16sp"
        alpha="0"
        bg="#4CAF50"
        layout_width="80dp"
        layout_height="40dp"
      />
    </frame>
  );
  // visibility
  // 0：表示可见（visible）
  // 8：表示不可见（gone）
  // 4：不可见，但仍然占用位置（invisible）
  // window.status.visibility = 8; 
  // 设置背景
  // window.status.setBackground(createDrawable("#4CAF50"));
  // 延迟确保获得到按钮尺寸
  sleep(200);
  // 初始化悬浮窗位置到右上角（单位：dp）
  // 获取屏幕宽度和高度
  var screenWidth = device.width;
  // var screenHeight = device.height;
  // 获取悬浮窗的宽度和高度
  var windowWidth = window.status.getWidth();
  // var windowHeight = window.status.getHeight();
  // 计算屏幕中心坐标
  // var centerX = (screenWidth - windowWidth) / 2;
  // var centerY = (screenHeight - windowHeight) / 2;
  // 初始化悬浮窗位置到屏幕中心
  window.setPosition(screenWidth - windowWidth - 10, 5);
  // 设置按钮点击事件
  window.status.alpha = 0.9;
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
function run() {
  // 启动
  if (!isRun) {
    // 子线程处理
    thread = threads.start(function () {
      try {
        // 检查无障碍服务权限
        if (!checkAutoPermission()) { return }
        // 检查悬浮窗权限
        if (!checkFloatyPermission()) { return }
        // 日志
        if (isLog) { console.info('>> 服务已启动'); }
        // 创建悬浮窗
        floaty.closeAll();
        createWindow();
        // 前台保活
        KeepAliveService.start(appNameKey, appName);
        // 切换启动状态
        isRun = true;
        // 更新文案，由于不能在子线程操作UI，所以要抛到UI线程执行
        ui.post(() => {
          ui.submit.setText("停止服务");
        });
        // 提示用户
        toast("服务已启动");
        // 启动
        start();
      } catch (error) {
        // 错误信息
        var message = (error && error.message) || '未知错误';

        // 方式一：
        // com.stardust.autojs.runtime.exception.ScriptInterruptedException：这个错误是子线程被中断准备退出报的错，不用管
        var ScriptInterruptedException = 'com.stardust.autojs.runtime.exception.ScriptInterruptedException';
        // 如果是白名单错误则不做处理
        if (message.includes(ScriptInterruptedException)) {
          // 不错处理
          if (isLog) { console.warn('>> 白名单错误：' + message); }
        } else {
          // 需要处理
          if (isLog) { console.error('>> 错误信息：' + message); }
          // 提示
          // toast(error);
          // 停止服务
          stop();
        }

        // 方式二：
        // // 日志
        // if (isLog) { console.error('>> 错误信息：' + message); }
        // // 提示
        // toast(error);
        // // 停止服务
        // stop();
      }
    });
  }
}

// 停止服务
function stop() {
  // 日志
  if (isLog) { console.info('>> 服务已停止'); }
  // 停止前台保活
  KeepAliveService.stop();
  // 停止子线程
  thread && thread.interrupt();
  thread = null;
  // 移除悬浮窗
  floaty.closeAll();
  // 设置启动状态
  isRun = false;
  // 更新文案，由于不能在子线程操作UI，所以要抛到UI线程执行
  ui.post(() => {
    ui.submit.setText("启动服务");
  });
  // 提示用户
  toast('服务已停止');
}

// 创建背景
// function createDrawable(color) {
//   var drawable = new android.graphics.drawable.GradientDrawable();
//   // drawable.setShape(android.graphics.drawable.GradientDrawable.OVAL); // 设置为圆形
//   drawable.setColor(colors.parseColor(color)); // 设置背景颜色
//   drawable.setStroke(5, colors.parseColor("#388E3C")); // 设置边框
//   return drawable;
// }

// 根据 desc 进行点击（在当前屏幕上）
function clickDesc(value) {
  // 查找
  const el = desc(value).findOne();
  // 点击
  return click(el.bounds().centerX(), el.bounds().centerY());
}

// 检查无障碍服务权限，没有则获取
function checkAutoPermission () {
  // 无障碍服务权限
  var isAuto = !!auto.service;
  // 处理
  if (isAuto) {
    // 日志
    if (isLog) { console.info('>> 无障碍权限：已授权'); }
  } else {
    // 日志
    if (isLog) { console.error('>> 无障碍权限：未授权，请授权后再启动'); }
    // 提示
    toast('请授权后再启动');
    // 开始授权
    auto("fast");
  }
  // 返回
  return isAuto
}

// 检查悬浮窗权限，没有则获取
function checkFloatyPermission () {
  // 悬浮窗权限
  var isFloaty = floaty.checkPermission()
  // 处理
  if (isFloaty) {
    // 日志
    if (isLog) { console.info('>> 悬浮窗权限：已授权'); }
  } else {
    // 日志
    if (isLog) { console.error('>> 悬浮窗权限：未授权，请授权后再启动'); }
    // 提示
    toast('请授权后再启动');
    // 开始授权
    floaty.requestPermission();
  }
  // 返回
  return isFloaty
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

// ========================================= 《 填入信息 》

// 开始
function start() {
  var input1 = text('请填写纯数字').findOne();
  var input2 = text('请填写游戏昵称').findOne();
  if (input1) {
    input1.click();
    sleep(100);
    input1.setText(gameId);
  }
  if (input2) {
    input2.click();
    sleep(100);
    input2.setText(gameName);
  }
  start();
}

// ========================================= 《 启动 》

// 调用
main();


