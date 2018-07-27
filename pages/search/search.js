const util = require('../../utils/util.js');
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    resultList:[],
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      resultList:[],
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  inputConfirm:function(){
    const that = this;
    that.setData({
      resultList:[]
    })
    wx.request({
      url: 'http://www.smhy.pw/wxproject.php',
      data:{
        requirement:'search',
        search: that.data.inputVal,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 
      },
      success:function(res){
        console.log(res);
        if (Object.prototype.toString.call(res.data.data) === "[object Array]"){
          if (res.data.data.length == 0) {
            wx.showToast({
              title: '查无信息，换个关键字吧',
            })
          }
          else {
            let resultList = that.data.resultList;
            resultList = resultList.concat(res.data.data);
            that.setData({
              resultList: resultList,
            })
            console.log(res);
          }
        }
      },
      fail: err => {
        reject(err)
      }
    })
  }
});