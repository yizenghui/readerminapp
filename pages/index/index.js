//index.js
//获取应用实例

Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '跟读小程序',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },


  onReady: function () {
    var that = this
    // wx.setStorage({
    //   key: "url_logs",
    //   data: JSON.stringify(that.data.logs)
    // })
    wx.getStorage({
      key: 'url_logs',
      success: function (res) {
        var logs = JSON.parse(res.data)||[]
        that.setData({
          logs: logs
        })
      }
    })
  },

  data: {
    // cateindex:1,
    // category: [ '小说', '新闻', ],
    url: "http://longfu8.com/",
    logs: []
  },
  // bindPickerChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     cateindex: e.detail.value
  //   })
  // },
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
  // 清空所有数据
  tapClearAllCache: function (e) {
    // 清除页面数据
    this.setData({
      logs: []
    })
    // 清空本地缓存
    wx.clearStorage()
  },
  tapClearInput: function (e) {
    this.setData({
      url: ""
    })
  }, 
  tapGoto: function (e) {
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
})
