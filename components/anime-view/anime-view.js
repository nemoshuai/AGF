// components/movie-list/movie-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    animeList:{
      type: Array,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindDetail:function(e){
      console.log("clicked");
      const id = e.currentTarget.dataset.id;//获取电影/条目的id
      wx.navigateTo({//跳转到详情页面
        // url: 'detail/detail?id=' + id
        url:'../detail/detail?id='+id
      })
    }
  }
})
