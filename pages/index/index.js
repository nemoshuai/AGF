//index.js
const util = require('../../utils/util.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    navbarList:['新番列表','今日更新','即将上映'],
    currentTab: 0,//当前tag的下标
    imgUrls: [],
    //轮播图相关设置
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    //电影信息列表
    newTVList:[],//新番列表
    whatsNewsList:[],//今日更新
    comingSoonList:[],//即将上映
    //控制显示数量
    tvOffset:0,//从数据offset为开始 新番
    newsOffset:0,//
    comingSoonOffset:0,//即将
    loading: true,//是否到底部加载
    finished:[false,false,false],//是否加载完毕
    scrollHeight:0,//滚动页面的高度
    isConnected:true,
  },
  //顶部导航栏的切换函数
  navbarTap: function (e) {
    const that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,//设置当前的tab标记
    })
  if (that.data.currentTab == 1) {//判断当前页面是哪个tag，区分获取哪部分数据
    let finished = that.data.finished;
    finished[that.data.currentTab] = false;//重新刷新，设定加载未结束
    that.setData({
      whatsNewsList: [],//数据清理
      newsOffset: 0,
      finished: finished,
    })
    that.loadWhatsNewsList();
  }
  else if (that.data.currentTab == 2) {//判断当前页面是哪个tag，区分获取哪部分数据
    let finished = that.data.finished;
    finished[that.data.currentTab] = false;
    that.setData({
      comingSoonList: [],
      comingSoonOffset: 0,
      finished: finished,
    })
    that.loadComingSoonList();
  }
  },
  //页面加载函数
  onLoad:function(){
    const that = this;
    //监听网络变化
    wx.onNetworkStatusChange(function(res){
    that.setData({
      isConnected:res.isConnected
    })
     if(res.isConnected==false){
       util.showOffline(that);
     }
    })
    util.getSwiperImageUrls(that,'F');//获取轮播图
    wx.getSystemInfo({//获取用户窗口高度
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
    if (that.data.currentTab == 0) {//加载首页数据
        that.loadNewTVList();
    }
  },
  //滚动到底部触发的函数
  lower(e) {
    const that = this;
    //判断当前Tag是哪个
     if(that.data.isConnected==true){
       if (that.data.currentTab == 0) {
         util.footLoadData(that, that.loadNewTVList);
       }
       else if (that.data.currentTab == 1) {
         util.footLoadData(that, that.loadWhatsNewsList);
       }
       else {
         util.footLoadData(that, that.loadComingSoonList);
       }
     }
     else{
       util.showOffline(that);
     }
  },
  //获取新番列表
  loadNewTVList: function () {
    const that = this;
    wx.request({
      url: 'http://www.smhy.pw/wxproject.php', //仅为示例，并非真实的接口地址
      data: {//url参数
        requirement: "get_tv_info",
        begin: this.data.tvOffset,
        offset: 10,
        // is_theater:'F'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 
      },
      success: function (res) {
        // console.log(res.data);
          if (res.data.data.length == 0) {
            let finished = that.data.finished;
            finished[that.data.currentTab] = true;
            that.setData({
              finished: finished,
              loading: false,//加载完成
            })
          }
          else {
            let newTVList = that.data.newTVList;
            newTVList = newTVList.concat(res.data.data);//将当前的数据数组与新获的数据拼接
            that.setData({
              newTVList: newTVList,
              tvOffset: that.data.tvOffset + 10,
              loading: false,//加载完成
            });
          }
      }
    })
  },
  //获取今日更新
  loadWhatsNewsList:function(){
    const that = this;
    wx.request({
      url: 'http://www.smhy.pw/wxproject.php', //仅为示例，并非真实的接口地址
      data: {//url参数
        requirement: "get_today_update",
        begin: this.data.newsOffset,
        offset: 10,
        // is_theater: 'F'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', 
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.data.length == 0) {
          let finished = that.data.finished;
          finished[that.data.currentTab] = true;
          that.setData({
            finished: finished,
            loading: false,//加载完成
          })
        }
        else {
          let whatsNewsList = that.data.whatsNewsList;
          whatsNewsList = whatsNewsList.concat(res.data.data);//将当前的数据数组与新获的数据拼接
          that.setData({
            whatsNewsList: whatsNewsList,
            newsOffset: that.data.newsOffset + 10,
            loading: false,//加载完成
          });
        }
      }
    })
  },
  //获取即将上映
  loadComingSoonList:function(){
    const that = this;
    wx.request({
      url: 'http://www.smhy.pw/wxproject.php', //仅为示例，并非真实的接口地址
      data: {//url参数
        requirement: "get_comming_soon",
        begin: this.data.comingSoonOffset,
        offset: 10,
        is_theater: 'F'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.data.length == 0) {
          let finished = that.data.finished;
          finished[that.data.currentTab] = true;
          that.setData({
            finished: finished,
            loading: false,//加载完成
          })
        }
        else {
          let comingSoonList = that.data.comingSoonList;
          comingSoonList = comingSoonList.concat(res.data.data);//将当前的数据数组与新获的数据拼接
          that.setData({
            comingSoonList: comingSoonList,
            comingSoonOffset: that.data.comingSoonOffset + 10,
            loading: false,//加载完成
          });
        }
      }
    })
  },
 
})
