//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading: false,
    error: false,
    title: "",
    url: "",
    list: [],
    logs: [],
    read_log: [],
    this_read: [], // 正在阅读
    subcribe_status:false,
  },

  onReady: function () {
    var that = this
    wx.getStorage({
      key: '__read_info_' + that.data.url,
      success: function (res) {
        var this_read = JSON.parse(res.data) || []
        // console.log(this_read)
        that.setData({
          this_read: this_read
        })
      }
    })
  },

  onLoad: function (params) {
    this.userSign()
    var that = this;
    var urlStr = params.url
    // 显示加载动画
    // that.setData({ url: urlStr, loading: true })

    that.setData({ url: urlStr })
    wx.showLoading({
      title: '加载中',
    })
    var logs = []
    // 把历史记录读取出来
    wx.getStorage({
      key: 'url_logs',
      success: function (res) {
        logs = JSON.parse(res.data) || []
        that.setData({
          logs: logs
        })
      }
    })
    this.checkSubcribe()
    wx.request({
      url: 'https://minapp.readfollow.com/getlist',
      // url: 'https://localhost:1323/list', 
      data: { 
        url: urlStr ,
        openid: app.globalData.openID,
      },
      header: {
        'content-type': 'application/json'
      },
      fail: function () {
        // 出错了怎么办？
        that.setData({
          error: true,
          loading: false,
        });
      },
      success: function (res) {

        that.setData({
          title: res.data.title,
          list: res.data.Links,
          loading: false
        });
        wx.setStorage({
          key: "__cache_list_" + urlStr,
          data: JSON.stringify(res.data.Links)
        })
        wx.setStorage({
          key: "__read_menu_url", // 当前正在阅读的链接
          data: urlStr
        })


        // 写入到浏览记录缓存
        var rep = false; // 是否已存在
        if ( logs.length ) {
        // 检查有没缓存重复数据
          for (var i = 0; i < logs.length; i++) {
            if (logs[i].url == urlStr) rep = true
          }
        }
        // 没有重复才写入缓存
        if (!rep) {
          logs.push({ url: urlStr, title: res.data.title })
          wx.setStorage({
            key: "url_logs",
            data: JSON.stringify(logs)
          })
        }

        wx.hideLoading()
      }
    })
  },


})
