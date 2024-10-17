// 10.0.51.147:9317

// 设置屏幕分辨率
setScreenMetrics(1600, 900);

// 请求截图
if(!requestScreenCapture(false)){
  toast("请求截图失败");
  exit();
}

// 点击某个按钮
// var img = captureScreen();
// var point = findMultiColors(img, "#ad7705",[[35,0,"#aa770d"],[67,0,"#ad7705"],[31,14,"#f0eeec"],[56,-8,"#ffffff"]],{region:[877,626,167,122],threshold:[26]});
// if(point){
//   toast("找到了");
// } else {
//   toast('未找到');
// }
// console.log(img.getWidth(), img.getHeight(), point.x, point.y);
// click(point.x, point.y)

// while(true) {
//   var img = captureScreen();
//   var point = findMultiColors(img, "#d9e495",[[41,31,"#dde896"],[68,19,"#343314"],[21,54,"#2a2a10"],[32,-23,"#4b5500"],[69,51,"#55440a"],[-8,-11,"#d2c11d"]],{region:[1364,757,177,142],threshold:[26]});
//   if(point){
//     toast("找到了");
//     console.log(img.getWidth(), img.getHeight(), point.x, point.y);
//     click(point.x, point.y);
//     sleep(500);
//   } else {
//     toast('未找到');
//     sleep(500);
//   }
// }

// 拖拽轮盘
// while(true) {
//   var point = findMultiColors(image, "#44caf3",[[1,54,"#63e7ff"],[-12,27,"#fafeff"],[-25,29,"#acf7fd"],[65,11,"#addcf8"],[58,43,"#acd6fb"],[124,30,"#f3f8fc"],[135,31,"#f4fdff"],[102,28,"#e1edf8"]],{region:[29,560,260,154],threshold:[26]});
//   swipe(180, 755, 284, 750, 500);
//   // var img = captureScreen();
//   // var point = findMultiColors(img, "#d9e495",[[41,31,"#dde896"],[68,19,"#343314"],[21,54,"#2a2a10"],[32,-23,"#4b5500"],[69,51,"#55440a"],[-8,-11,"#d2c11d"]],{region:[1364,757,177,142],threshold:[26]});
//   // if(point){
//   //   toast("找到了");
//   //   console.log(img.getWidth(), img.getHeight(), point.x, point.y);
//   //   click(point.x, point.y);
//   //   sleep(500);
//   // } else {
//   //   toast('未找到');
//   //   sleep(500);
//   // }
// }

var img = captureScreen();
var temp = images.read('/sdcard/Pictures/image.png');


// var p = findImage(img, , )


toast("脚本执行完毕");