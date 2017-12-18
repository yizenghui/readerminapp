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
  },

  tapReverseList: function (event) {
    this.setData({ list: this.data.list.reverse()})
  },


  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: this.data.title,
      path: 'pages/list/index?url=' + this.data.url,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败 
      }
    }
  },


  userSign:function(){
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        
        console.log(res.userInfo)
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
          console.log('jy',res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
    that.setData({ url: urlStr, loading: true })

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

    wx.request({
      url: 'https://readfollow.com/minapp/getlist',
      // url: 'https://localhost:1323/list', 
      data: { url: urlStr },
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
        if (logs.length ) {
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
      }
    })
  },
})
