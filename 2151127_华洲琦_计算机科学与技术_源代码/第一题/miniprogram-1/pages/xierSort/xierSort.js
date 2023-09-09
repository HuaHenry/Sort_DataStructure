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
    await this.shellSort(numbers);
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

  shellSort: async function (arr) {
    let len = arr.length;
    let gap = Math.floor(len / 2);
    let that = this;

    while (gap > 0) {
      for (let i = gap; i < len; i++) {
        let temp = arr[i];
        let j = i;
        
        await that.sleep(1000);
        that.showdata(j, j - gap, -1);

        while (j >= gap && arr[j - gap].value > temp.value) {
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = temp;

        that.setData({
          numbers: arr.slice(),
          swaps: that.data.swaps + 1
        });
      }
      gap = Math.floor(gap / 2);
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
    }
  },

  onLoad: function (options) {
    console.log('进入希尔排序页面');
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