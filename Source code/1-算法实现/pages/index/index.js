// index.js
const app = getApp()    //引入全局变量使用，排序方式选择

Page({
  navigateToBubbleSort: function() {
    app.globalData.choice = 1
    wx.navigateTo({
      url: '/pages/input/input',
    });
  },
  navigateToquickSort: function() {
    app.globalData.choice = 2
    wx.navigateTo({
      url: '/pages/input/input',
    });
  },
  navigateTochooseSort: function() {
    app.globalData.choice = 3
    wx.navigateTo({
      url: '/pages/input/input',
    });
  },
  navigateToinsertSort: function() {
    app.globalData.choice = 4
    wx.navigateTo({
      url: '/pages/input/input',
    });
  },
  navigateTobinarySort: function() {
    app.globalData.choice = 5
    wx.navigateTo({
      url: '/pages/input/input',
    });
  },

  goToAnotherPage: function () {
    wx.navigateTo({
      url: '/pages/aboutme/aboutme',
    });
  },
  navigateToxierSort: function() {
    app.globalData.choice = 6
    wx.navigateTo({
      url: '/pages/input/input',
    });
  },
});