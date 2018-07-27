//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    //用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //新番列表
    collectedTVList: [], 
    tvOffset: 0,//从数据offset为开始 新番
    finished:false,//是否加载完毕
    loading: true,//是否到底部加载
    scrollHeight: 0,//滚动页面的高度
    openid:'',
    session_key:'',
    personInfo:{},
  },
  //页面加载函数
  onLoad: function () {
    //收藏信息列表
    const that = this;
    that.getPersonInfo();
    wx.getSystemInfo({//获取用户窗口高度
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
        // console.log(res.windowHeight)
      }
    })
    that.getOpen();
    console.log(that.data.openid);
    //加载收藏数据
  
  },
  getPersonInfo:function(){
    //个人信息获取
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log(this.data.userInfo);
    console.log("hasUserInfo"+this.data.hasUserInfo);
    // console.log(app.globalData.userInfo);
  },
  onGotUserInfo: function (e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    // this.setData({
    //   userInfo: res.userInfo,
    //   hasUserInfo: true
    // })
    this.getPersonInfo();
    this.getOpen();
  },
  onPullDownRefresh:function(){
    this.getOpen();
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon: "none",
      duration: 2000,
      mask: true
    })
  },
  //滚动到底部触发的函数
  lower(e) {
    const that = this;
      if (that.data.finished == false) {//数据未加载全部
        that.setData({
          loading: true//加载
        })
        that.loadCollectedTVList();
      }
      else {//已经不能获取到更多数据
        that.setData({
          loading: false//加载
        })
    }
  },
  loadCollectedTVList: function () {
    const that = this;
    // console.log("..."+that.data.openid);
    wx.request({
      url: 'http://www.smhy.pw/wxproject.php', //仅为示例，并非真实的接口地址
      data: {//url参数
        requirement: "get_collection_info",
        wxid:that.data.openid
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: function (res) {
        console.log(res);
        if (Object.prototype.toString.call(res.data.data.animation_list) === "[object Array]") {
          if (res.data.data.animation_list.length == 0) {
            that.setData({
              collectedTVList: [],
            });
          }
          else {
            let collectedTVList = that.data.collectedTVList;
            collectedTVList = res.data.data.animation_list;
            that.setData({
              collectedTVList: res.data.data.animation_list,
                // tvOffset: that.data.tvOffset + 10,
                // loading: false,//加载完成
            });
          }
       }
       else{
          that.setData({
            collectedTVList: [],
          });
       }
      }
    })
  },
  //获取用户信息
  getUserInfo: function (e) {
    console.log("fffff"+e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getOpen: function () {
    const that = this;
    const APP_ID = 'wxcaf50973e176aa75';//输入小程序appid
    const APP_SECRET = '6b406d5f41bf6d0d74181eecda73a2f3';//输入小程序app_secret
    util.getOpenId(that, APP_ID, APP_SECRET,that.loadCollectedTVList);
  }
})