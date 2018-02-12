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
    inputShowed: false,
    inputVal: '',
    showGuide: false,
    list:[

      {
        title: "斗罗大陆",
        url: "http://www.88dushu.com/xiaoshuo/0/511/"
      },
      {
        title: "圣墟",
        url: "http://www.biqiuge.com/book/4772/"
      },
      {
        title: "斗破苍穹",
        url: "https://www.37zw.net/1/1257/"
      },
      {
        title: "凤囚凰",
        url: "https://www.ybdu.com/xiaoshuo/8/8584/"
      },
      {
        title: "点道为止",
        url: "http://book.zongheng.com/showchapter/730066.html"
      }
      
    ],
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

  showInput: function showInput() {
    this.setData({
      inputShowed: true
    })
  },
  hideInput: function hideInput() {
    this.url = '';
    this.inputShowed = false;

    this.setData({
      url:"",
      inputShowed: false
    })
  },
  clearInput: function clearInput() {
    this.setData({
      url: ""
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      url: e.detail.value
    })
  },

  onReady: function () {
    var that = this
    wx.getStorage({
      key: 'create_guide',
      success: function (res) {
        that.setData({
          showGuide: false
        })
      },
      fail:function (res) {
        that.setData({
          showGuide: true
        })
      }
    })
  },
 
  tapGoto: function (e) {
    // 此处已有 openid
    // console.log(app.globalData.openID)
    var inputUrl = this.data.url
    if (inputUrl == "") {
      wx.showModal({
        title: '提示',
        content: '请输入目录地址',
        showCancel: false
      })
    } else if(!this.checkIsURL(inputUrl)){
      wx.showModal({
        title: '提示',
        content: '请输入有效的链接地址',
        showCancel: false
      })
    }else {
      wx.navigateTo({
        url: '../list/index?url=' + inputUrl
      })
    }
  },
  // 扫码(扫在PC网页上游览的二维码)
  scanCode() {
    var that = this
    wx.scanCode({
      success: (res) => {
        if (res.scanType == "QR_CODE" && that.checkIsURL(res.result)){
          wx.navigateTo({
            url: '../list/index?url=' + res.result
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '无法获取有效链接地址！' + res.result,
            showCancel: false
          })
        }
      }
    })
  }, 

  checkIsURL(url){
    return /^http(s){0,1}:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"\"])*$/.test(url)
  },

  guide() {
    this.setData({
      showGuide: !this.data.showGuide
    })
    wx.setStorage({
      key: "create_guide",
      data: 1
    })
  },

})
