const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const defaultfunc = () => {
  console.log("dededede")
}
const APP_ID_DEFAULT = 'wxcaf50973e176aa75';//输入小程序appid
const APP_SECRET_DEFAULT = '6b406d5f41bf6d0d74181eecda73a2f3';//输入小程序app_secret
const getOpenId = (that, APP_ID, APP_SECRET, func = defaultfunc) => {
  var OPEN_ID = ''//储存获取到openid
  var SESSION_KEY = ''//储存获取到session_key
  wx.login({
    success: function (res) {
      wx.request({
        //获取openid接口
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        data: {
          appid: APP_ID,
          secret: APP_SECRET,
          js_code: res.code,
          grant_type: 'authorization_code'
        },
        method: 'GET',
        success: function (res) {
          // console.log(res.data)
          OPEN_ID = res.data.openid;//获取到的openid
          SESSION_KEY = res.data.session_key;//获取到session_key
          that.setData({
            openid: OPEN_ID,
            session_key: SESSION_KEY,
          })
          func();
        }
      })
    }
  })
}

//判断当前网络状态
// const isConnectNetWork=(that)=>{
//   var networkType="";
//   wx.getNetworkType({
//     success: function (res) {
//       // networkType=res.networkType
//       // console.log("网络："+networkType);
//       if(res.networkType=="none"){
//         that.setData({
//           isConnected:false
//         })
//       }
//       else{
//         that.setData({
//           isConnected: true
//         })
//       }
//       console.log("1网络：" + that.data.isConnected);
//     }
//   })
// }

//断网时执行
const showOffline =(that)=>{
  wx.showToast({
    title: '无连接网络',
    icon: "none",
    duration: 2000,
    mask: true
  })
  that.setData({
    loading: false
  })
}

//底部加载数据 传递load**List函数
const footLoadData = (that, func) =>{
  if (that.data.finished[that.data.currentTab] == false) {//数据未加载全部
    that.setData({
      loading: true//加载
    })
    func();
  }
  else {//已经不能获取到更多数据
    that.setData({
      loading: false//加载
    })
  }
}

const getSwiperImageUrls = (that,is_theater) =>{
  wx.request({
    url: 'http://www.smhy.pw/wxproject.php', //仅为示例，并非真实的接口地址
    data: {//url参数
      requirement: "get_recommendation",
      is_theater:is_theater
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    success: function (res) {
      console.log(res.data);
      let imgUrls = res.data.data;
      that.setData({
        imgUrls: imgUrls,
      });
    }
  })
}
module.exports = {
  formatTime: formatTime,
  getOpenId: getOpenId,
  // isConnectNetWork: isConnectNetWork,
  showOffline:showOffline,
  footLoadData: footLoadData,
  getSwiperImageUrls:getSwiperImageUrls
}
