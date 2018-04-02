//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    list: []
  },
  onLoad: function (options) {

    this.get_list()
  },

  get_list(urlStr) {
    var that = this;
    
    wx.request({
      url: 'https://minapp.readfollow.com/sharerank',
      // url: 'https://localhost:1323/show', 
      data: {
        openid: app.globalData.openID,
      },
      header: {
        'content-type': 'application/json'
      },
      fail: function () {
        
      },
      success: function (res) {
        var data = res.data;
        that.setData({
          list: data
        })
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: []
    })
    this.get_list()
    wx.stopPullDownRefresh()
  },
  onReady: function () {
  },

})
