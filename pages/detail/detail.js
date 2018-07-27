//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    isFold: true,
    isCollect:false,
    star: [0, 0, 0, 0, 0],
    detailList:[],
    openid: '',
    session_key: '',
    id:'',
  }, 
  showVideo: function(e){
    const videoID = this.data.detailList[0].videoID;//获取电影/条目的id
    wx.navigateTo({//跳转到详情页面
      // url: 'detail/detail?id=' + id
      url: '../play/play?videoID=' + videoID
    })
  },
  showAll: function (e) {//详情介绍伸缩
    this.setData({
      isFold: !this.data.isFold,
    })
  },
  collect:function(e){//增加/取消收藏
    this.setData({
       isCollect: !this.data.isCollect,
    })
    const that = this;
    if(that.data.isCollect){
      var re = "user_addcollection";
    }
    else{
      var re = "user_cancelcollection";
    }
    wx.request({
      url: 'http://www.smhy.pw/wxproject.php',
      data: {//url参数
        requirement: re,
        animationid: that.data.id,
        wxid: that.data.openid,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: function (res) {
        // console.log(res);
      }
    })
  },
  onLoad:function(options){//获取番剧详细信息
    const that =this;
    that.setData({
      id:options.id
    });
    that.getOpen();
  },
  handleCollection:function(){
    const that = this;
    wx.request({
      url: 'http://www.smhy.pw/wxproject.php',
      data: {//url参数
        requirement: "get_bangumi_detail",
        animationid: that.data.id,
        wxid: that.data.openid,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: function (res) {
        console.log(res.data);
        let detailList = that.data.detailList;
        detailList = detailList.concat(res.data.data);
        that.setData({
          detailList: detailList,
        });
        if (that.data.detailList[0].is_collected == "N") {
          that.setData({
            isCollect: false,
          })
        }
        else if (that.data.detailList[0].is_collected == "Y") {
          that.setData({
            isCollect: true,
          })
        }
        var score = that.data.detailList[0].score;
        var i = 0;
        while (score >= 1) {
          var up = "star[" + i + "]";
          if (that.data.star[i] < 2) {
            that.setData({
              [up]: that.data.star[i] + 1,
            });
            if (that.data.star[i] == 2 && i < 4) {
              i++;
            }
          }
          score--;
        }
        // that.getVideoInfo(that.data.detailList[0].videoid)
      }
    })
  },
  
  getOpen: function () {
    const that = this;
    // const APP_ID = 'wx3197eb2267b3ed21';//输入小程序appid
    // const APP_SECRET = 'c0033e4ebe107cb48699de34e04ca157';//输入小程序app_secret
    const APP_ID = 'wxcaf50973e176aa75';//输入小程序appid
    const APP_SECRET = '6b406d5f41bf6d0d74181eecda73a2f3';//输入小程序app_secret
    util.getOpenId(that, APP_ID, APP_SECRET, that.handleCollection);
  }
})

