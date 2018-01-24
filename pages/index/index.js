//index.js
//获取应用实例
const app = getApp()

Page({

  data: {

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // cateindex:1,
    // category: [ '小说', '新闻', ],
    url: "",
    logs: []
  },
  onLoad: function () {
    // wx.setScreenBrightness({
    //   value: 0,
    //   success:function(res){
    //     console.log(res)
    //   }
    // })
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
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     // console.log(res.target)
  //   }
  //   return {
  //     title: '跟读，品尝文学世界各种美味',
  //     path: 'pages/index/index',
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },

  tapDeleteLogItem(e) {
    const index = e.currentTarget.dataset.index;
    let logs = this.data.logs;
    var log = logs[index];
    if (log && log.url) {
      wx.removeStorage({
        key: '__read_info_' + log.url
       
      })
      wx.removeStorage({
        key: '__cache_list_' + log.url
      })
    }

    logs.splice(index, 1);              // 删除
    this.setData({
      logs: logs
    });

    wx.setStorage({
      key: "url_logs",
      data: JSON.stringify(logs)
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.get_logs()
    wx.stopPullDownRefresh()
  },
  get_logs:function(){
    var that = this
    // wx.setStorage({
    //   key: "url_logs",
    //   data: JSON.stringify(that.data.logs)
    // })
    wx.getStorage({
      key: 'url_logs',
      success: function (res) {
        var logs = JSON.parse(res.data) || []
        if (logs.length > 0) {
          for (var i = 0; i < logs.length; i++) {
            var crop_length = 0

            if (logs[i]["url"].substring(0, 7) == "http://") {
              crop_length = 7
            }
            if (logs[i]["url"].substring(0, 8) == "https://") {
              crop_length = 8
            }
            if (logs[i]["url"].length > 18 + crop_length) {
              logs[i]["source"] = logs[i]["url"].substring(crop_length, 18 + crop_length) + "..."
            } else {
              logs[i]["source"] = logs[i]["url"].substring(crop_length, 18 + crop_length)
            }
          }
        }
        that.setData({
          logs: logs.reverse()
        })
      }
    })
  },
  onReady: function () {
    this.get_logs()
  },

  // bindPickerChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     cateindex: e.detail.value
  //   })
  // },

  bindKeyInput: function (e) {
    this.setData({
      url: e.detail.value
    })
  },
  formSubmit: function (e) {
    var inputUrl = e.detail.value.url
    var that = this
    if (inputUrl == "") {
      wx.showModal({
        title: '提示',
        content: '请输入文章目录地址',
        showCancel:false
      })
    } else {
      wx.navigateTo({
        url: '../list/index?url=' + inputUrl
      })
    }
  },
  formSubscribe: function (e) {
    console.log('form发生了submit事件，携带数据为：', e)
  },

  // 清空所有数据
  tapClearAllCache: function (e) {
    var that = this

    wx.showModal({
      title: '提示',
      content: '清空所有缓存记录，确定吗？',
      success: function (res) {
        if (res.confirm) {
          // 清除页面数据
          that.setData({
            logs: []
          })
          // 清空本地缓存
          wx.clearStorage()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  tapClearInput: function (e) {
    this.setData({
      url: ""
    })
  }, 
  tapGoto: function (e) {
    // 此处已有 openid
    // console.log(app.globalData.openID)
    var inputUrl = this.data.url
    if (inputUrl == "") {
      wx.showModal({
        title: '提示',
        content: '请输入文章目录地址',
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '../list/index?url=' + inputUrl
      })
    }
  },



  tapContinue: function (e) {
    const index = e.currentTarget.dataset.index;
    let logs = this.data.logs;
    var log = logs[index];
    if (log && log.url) {
      wx.getStorage({
        key: '__read_info_' + log.url,
        success: function (res) {
          var info = JSON.parse(res.data) || []
          if (info.url) {
            wx.setStorage({
              key: "__read_menu_url",
              data: log.url
            })
            wx.navigateTo({
              url: '../info/index?url=' + info.url
            })
          }
        },
        fail: function (res) {
            wx.navigateTo({
              url: '../list/index?url=' + log.url
            })
        },
      })
    }

  },

  // 把链接保存到剪贴板
  rdcopy() {
    var that = this
    wx.getClipboardData({
      success: function (res) {
        that.setData({
          url: res.data
        })
      }
    })
  }
})
