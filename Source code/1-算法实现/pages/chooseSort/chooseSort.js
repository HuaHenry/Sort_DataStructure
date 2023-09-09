const app = getApp();

Page({
  data: {
    numbers: [],
    animationRunning: false,
    bttext: "开始排序",
    nowseq: 0,
    highlightIndex: 0,
    highlight: false,
    swaps: 0,
    minIndexs:-1,
    nowIndexs:-1,
    chooseIndexs:-1,
  },
  startAnimation: function () {
    this.setData({
      highlight: true
    })
    let numbers = this.data.numbers.slice();
    // this.selectionSortAnimation(numbers, 0);
    this.selectionSort(numbers,0)
    let that = this
    this.setData({
      nowseq: that.data.nowseq + 1
    })
    if (this.data.nowseq != 0) {
      this.setData({
        bttext: "下一趟排序"
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

   showdata:function(minIndex,nowIndex,chooseIndex){
    this.setData({
      minIndexs:minIndex,
      nowIndexs:nowIndex,
      chooseIndexs:chooseIndex
    })
  },

   selectionSort:function(arr) {
        var len = arr.length;
        let that = this;
        var minIndex, temp;
        for (var i = 0; i < len - 1; i++) {
            minIndex = i;
            this.sleep(1000)
            this.showdata(j,minIndex,i)
            for (var j = i + 1; j < len; j++) {
                this.sleep(1000)
                this.showdata(j,minIndex,i)
                if (arr[j].value < arr[minIndex].value) {     // 寻找最小的数
                    minIndex = j;                 // 将最小数的索引保存
                    this.sleep(1000)
                    this.showdata(j,minIndex,i)
                }
            }
            temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
            that.setData({
              numbers: arr.slice(),
              swaps: that.data.swaps + 1
            });
            this.sleep(1000)
            this.showdata(j,minIndex,i)
            //检查是否已经排序完成
            if(that.isAscending()){
              // that.sleep(1000)
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
              break;
            }
        }
    },

  onLoad: function (options) {
    console.log('进入选择排序页面');
    this.setData({
      nowseq: 0
    });

    // 导入数据
    const temp_nums = [];
    const datalist = app.globalData.nums;
    for (let i = 0; i < datalist.length; i++) {
      temp_nums.push({ value: datalist[i], color: app.globalData.colors[i] });
    }
    this.setData({
      numbers: temp_nums
    });
  },

  isAscending: function () {
    for (let i = 0; i < this.data.numbers.length - 1; i++) {
      if (this.data.numbers[i].value > this.data.numbers[i + 1].value) {
        return false;
      }
    }
    return true;
  }
});