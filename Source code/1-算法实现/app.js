// app.js

// //往globalData设置值
// getApp().globalData.data = "12345";
// //取globaData的值
// var data = app.globalData.data;


App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    nums:[],
    choice:-1,
    colors:['#007aff','#ff3b30','#4cd964','#ff9500','#34c759','#ff2d55','#5856d6']
  }
})
