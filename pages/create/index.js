//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url: "",
    scene:"",
  },
  onLoad: function (options) {
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
  

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '跟读，品尝文学世界各种美味',
      path: 'pages/create/index',
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
    // that.checkRdAndGoto()
  },


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
  // 把粘贴版的内容转入输入目录地址
  rdcopy() {
    var that = this
    wx.getClipboardData({
      success: function (res) {
        that.setData({
          url: res.data
        })
      }
    })
  }, // 把粘贴版的内容转入输入目录地址


  // 扫码(扫在网页上游览的二维码)
  scanCode() {
    wx.scanCode({
      success: (res) => {
        if (res.scanType =="QR_CODE"){
          var isUrl = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"\"])*$/.test(res.result)
          wx.navigateTo({
            url: '../list/index?url=' + res.result
          })
        }
      }
    })
  }, 

  checkIsURL(url){
  },


  checkRdAndGoto() {
    var that = this
    wx.getClipboardData({
      success: function (res) {
        if(res.data){
          wx.showModal({
            title: '提示',
            content: '是否要读取粘贴版目录',
            success: function (res2) {
              if (res2.confirm===true){
                wx.navigateTo({
                  url: '../list/index?url=' + res.data
                })
              }
            }
          })
        }
      }
    })
  },


})
