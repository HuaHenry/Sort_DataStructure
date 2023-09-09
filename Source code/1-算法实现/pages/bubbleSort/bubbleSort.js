const app = getApp()    //引入全局变量使用，选择颜色和数据

Page({
  data: {
    numbers: [
    ],
    animationRunning: false,
    bttext: "开始排序",
    nowseq: 0,
    highlightIndex: 0,
    highlight: false,
    swaps:0,
  },
  startAnimation: function () {
    this.setData({
      highlight:true
    })
    let numbers = this.data.numbers.slice();
    this.bubbleSortAnimation(numbers, 0);
    let that = this
    this.setData({
      nowseq : that.data.nowseq+1
    })
    if (this.data.nowseq!=0){
      this.setData({
        bttext : "下一趟排序"
      })
      console.log("inside")
    }
  },

  sleep:function(time){
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while(true){
      if (new Date().getTime() > endTime){
      return;
      } 
    }
   },

  bubbleSortAnimation: function (numbers, i) {
    let that = this;
    let animationRunning = this.data.animationRunning;

    if (i < numbers.length - 1 && !animationRunning) {
      animationRunning = true;
      this.setData({
        animationRunning: true
      });

      let timer = setInterval(function () {
        // console.log("111")
        // 设置高亮索引
        that.setData({
          highlightIndex: i
        });
        if (i === numbers.length - 1) {
          clearInterval(timer);
          that.setData({
            animationRunning: false
          });
          return;
        }

        if (numbers[i].value > numbers[i + 1].value) {
          // 交换位置
          let thats = that
          that.setData({
            swaps: thats.data.swaps + 1
          })
          let temp = numbers[i];
          numbers[i] = numbers[i + 1];
          numbers[i + 1] = temp;

          that.setData({
            numbers: numbers.slice()
          });
        }

        i++;

        if (i === numbers.length - 1) {
          clearInterval(timer);
          that.setData({
            animationRunning: false,
            // highlightIndex: -1
          });
        }
        //检查是否已经排序完成
      }, 1000);
      if(that.isAscending()){
        that.sleep(1000)
        wx.showModal({
          title: '排序完成',
          content: '共进行'+that.data.swaps+'次交换',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          }
        });
      }
    }
  },
  onLoad: function (options) {
    // 在此处进行页面初始化的操作
    console.log('进入冒泡排序页面');
    this.setData({
      nowseq : 0
    })
    //导入数据
    var temp_nums=[]
    let datalist = app.globalData.nums
    for(var i=0;i<datalist.length;i++){
      temp_nums.push({ value: datalist[i], color: app.globalData.colors[i] })
    }
    this.setData({
      numbers:temp_nums
    })
  },
  isAscending:function() {
    for (let i = 0; i < this.data.numbers.length - 1; i++) {
      if (this.data.numbers[i].value > this.data.numbers[i + 1].value) {
        return false;
      }
    }
    return true;
  }
});