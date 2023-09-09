const app = getApp()

Page({
  data: {
    numbers: [
    ],
    animationRunning: false,
    bttext: "开始排序",
    nowseq: 0,
    left:0,
    right:0,
    middle:0,
    swaps:0,
    gos:0
  },
  startAnimation: function () {
    this.setData({
      animationRunning: true
    })
    let numbers = this.data.numbers.slice();
    this.quickSort(numbers, 0, numbers.length - 1);
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

  showdata:function(i,j,empty,nums){
    this.setData({
      left:i,
      right:j,
      middle:empty,
      numbers:nums.slice()
    })
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

  quickSort:function(arr,begin,end){
    let that = this
    this.setData({
      gos : that.data.gos + 1
    })
    
    if(begin < end){
        let i = begin-1;
        let j = end+1;
        let empty = arr[begin].value; 

        while(i < j){
            do{
                i++
                this.showdata(i,j,begin,arr)
                this.sleep(1000)
            }while(arr[i].value < empty)
            do{
                j--
                this.showdata(i,j,begin,arr)
                this.sleep(1000)
            }while(arr[j].value > empty)
            if(i<j){
                let temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
                this.setData({
                  swaps : that.data.swaps + 1
                })
                this.showdata(i,j,begin,arr)
                this.sleep(1000)
            }
        }
        this.quickSort(arr,begin,j);
        this.quickSort(arr,j+1,end);
    }else{
        if(this.isAscending()){
          this.sleep(1000)
          console.log(this.gos)
          wx.showModal({
            title: '排序完成',
            content: "共交换"+that.data.swaps+"次",
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
        return;
    }
  },

  partition: function (numbers, low, high) {
    let pivot = numbers[high].value;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (numbers[j].value < pivot) {
        i++;
        let temp = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = temp;
      }
    }

    let temp = numbers[i + 1];
    numbers[i + 1] = numbers[high];
    numbers[high] = temp;

    this.setData({
      numbers: numbers.slice()
    });

    return i + 1;
  },

  onLoad: function (options) {
    console.log('进入快速排序页面');
    let that = this
    this.setData({
      nowseq: 0,
      left:0,
      right: that.data.numbers.length-1
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

  isAscending: function () {
    for (let i = 0; i < this.data.numbers.length - 1; i++) {
      if (this.data.numbers[i].value > this.data.numbers[i + 1].value) {
        return false;
      }
    }
    return true;
  }
});