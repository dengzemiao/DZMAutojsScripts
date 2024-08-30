// 唤醒手机
function wakeupPhone() {
  // 如果屏幕没有点亮，则唤醒设备
  device.wakeUpIfNeeded();
  // 屏幕是否唤醒成功
  if (!device.isScreenOn()) {
    // 没有则再次尝试唤醒
    keepDrow();
  } else {
    // 屏幕保持常亮的时间（单位毫秒）如果不加参数，则一直保持屏幕常亮
    // 在某些设备上，如果不加参数 timeout，只能在 Autox.js 的界面保持屏幕常亮，在其他界面会自动失效，这是因为设备的省电策略造成的。因此，建议使用比较长的时长来代替"一直保持屏幕常亮"的功能
    // device.keepScreenOn(3600 * 1000);
    // 取消屏幕常亮
    // device.cancelKeepingAwake();
  }
}

/**
 * 根据应用名称进行点击(在当前屏幕上)
 * @param {string} value 应用名称
 */
function clickApp(value) {
  // 点击
  clickDesc(value);
}

/**
 * 根据 desc 进行点击(在当前屏幕上)
 * @param {string} value 字符串
 */
function clickDesc(value) {
  // 查找
  const el = desc(value).findOne();
  // 点击
  return click(el.bounds().centerX(), el.bounds().centerY());
}

/**
 * 根据 text 进行点击(在当前屏幕上)
 * @param {string} value 字符串
 */
function clickText(value) {
  // 查找
  const el = text(value).findOne();
  // 点击
  return click(el.bounds().centerX(), el.bounds().centerY());
}

/**
 * 根据 id 进行点击(在当前屏幕上)
 * @param {string} value 字符串
 */
function clickId(value) {
  // 查找
  const el = id(value).findOne();
  // 点击
  return click(el.bounds().centerX(), el.bounds().centerY());
}

/**
 * 根据 id 文本框设置指定内容(在当前屏幕上)
 * @param {string} value 字符串
 * @param {string} text 字符串
 */
function setTextId(value, text) {
  // 查找
  const el = id(value).findOne();
  // 点击
  return el.setText(text);
}

module.exports = {
  wakeupPhone,
  clickApp,
  clickDesc,
  clickText,
  clickId,
  setTextId
}