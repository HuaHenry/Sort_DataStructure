// index.js
const app = getApp()    //引入全局变量使用，页面传值

Page({
  data: {
    inputs: ['', '', '', '', '', '', ''],
  },

  handleInput: function(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const inputs = this.data.inputs;
    inputs[index] = value;
    this.setData({
      inputs: inputs,
    });
  },

  handleButtonTap: function() {
    const inputs = this.data.inputs;
    console.log('输入框的值:', inputs);
    // 检查数字是否符合要求
    var minNum = 2147483647
    var maxNum = -2147483648
    var numlist = []
    var bl = false
    for(var i=0;i<inputs.length;i++){
      var str = inputs[i];
      var n = Number(str);
      if(str!=""){
        console.log(str,n,isNaN(n))
        if (!isNaN(n))
        {
            minNum = Math.min(minNum,n)
            maxNum = Math.max(maxNum,n)
            numlist.push(n)
        }
        else{
            wx.showToast({
              title: '请检查数字格式！',
              icon: 'none',
              duration: 2000//持续的时间
            })
            bl = true
        }
      }
    }
    if(!bl){
      wx.showToast({
        title: '输入有效',
        icon: 'success',
        duration: 2000//持续的时间
      })
    }
    console.log(minNum,maxNum)
    console.log(numlist)
    if(maxNum - minNum >20){
      if((maxNum - minNum)/minNum>=10){
        wx.showModal({
          title: '数字差距过大',
          content: '无法使用柱状图表示。请保持(最大数字-最小数字)/最小数字<10',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/input/input',
              })
            }
          }
        });
      }
    }
    else{
      //符合要求
      app.globalData.nums = numlist
      var urlto = '/pages/index/index'
      if(app.globalData.choice==1){
        urlto = '/pages/bubbleSort/bubbleSort'
      }
      else if(app.globalData.choice==2){
        urlto = '/pages/quickSort/quicksort'
      }
      else if(app.globalData.choice==3){
        urlto = '/pages/chooseSort/chooseSort'
      }
      else if(app.globalData.choice==4){
        urlto = '/pages/insertSort/insertSort'
      }
      else if(app.globalData.choice==5){
        urlto = '/pages/binarySort/binarySort'
      }
      else if(app.globalData.choice==6){
        urlto = '/pages/xierSort/xierSort'
      }
      wx.redirectTo({
        url: urlto
      })
    }
  },
});