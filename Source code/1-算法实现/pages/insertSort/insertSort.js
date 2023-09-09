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
    minIndexs: -1,
    nowIndexs: -1,
    chooseIndexs: -1,
  },
  startAnimation: async function () {
    this.setData({
      highlight: true
    });
    let numbers = this.data.numbers.slice();
    await this.insertionSort(numbers);
    let that = this;
    this.setData({
      nowseq: that.data.nowseq + 1
    });
    if (this.data.nowseq !== 0) {
      this.setData({
        bttext: "下一趟排序"
      });
    }
  },

  sleep: function (time) {
    return new Promise(resolve => setTimeout(resolve, time));
  },

  showdata: function (minIndex, nowIndex, chooseIndex) {
    this.setData({
      minIndexs: minIndex,
      nowIndexs: nowIndex,
      chooseIndexs: chooseIndex
    });
  },

  insertionSort: async function (arr) {
    let len = arr.length;
    let that = this;
    for (let i = 1; i < len; i++) {
      let j = i;
      await that.sleep(1000);
      that.showdata(j, j - 1, i);
      while (j > 0 && arr[j].value < arr[j - 1].value) {
        // 交换位置
        let temp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;


        that.setData({
          numbers: arr.slice(),
          swaps: that.data.swaps + 1
        });
        // await that.sleep(1000);
        // that.showdata(j, j - 1, i);
        j--;
        if(j-1>=0){
          await that.sleep(1000);
          that.showdata(j, j - 1, i);
        }
        
        //检查是否已经排序完成
        if (that.isAscending()) {
          await that.sleep(1000);
          wx.showModal({
            title: '排序完成',
            content: '共进行' + that.data.swaps + '次交换',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/index/index',
                });
              }
            }
          });
          break;
        }
      }
    }
  },

  onLoad: function (options) {
    console.log('进入插入排序页面');
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