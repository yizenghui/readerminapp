// pages/feedback/index.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    problem:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  bindKeyInput: function (e) {
    this.setData({
      problem: e.detail.value
    })
  },
  // 订阅提交
  formPost: function (e) {
    var that = this
    var formId = e.detail.formId
    var problem = that.data.problem
    wx.showModal({
      title: '成功反馈',
      content: '已经提交,处理结果将以模板消息回复！',
      showCancel: false
    })

    wx.request({
      url: 'https://minapp.readfollow.com/feedback',
      method: 'POST', 
      data: {
        openid: app.globalData.openID,
        problem: problem,
        formid: formId,
      },
      header: {
        'content-type': 'application/json'
      },
      fail: function () {

      },
      success: function (res) {
        that.setData({
          subcribe_status: res.data.Status
        })
        console.log(res)
      }
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
  },
  Post: function (e) {
    var that = this
    var formId = e.detail.formId
    var urlStr = that.data.url
    wx.showModal({
      title: '成功订阅',
      content: '7天内通知一次更新情况',
      showCancel: false
    })

    wx.request({
      url: 'https://minapp.readfollow.com/subscribe',
      // url: 'https://localhost:1323/list', 
      method:"POST",
      data: {
        openid: app.globalData.openID,
        url: urlStr,
        formid: formId,
      },
      header: {
        'content-type': 'application/json'
      },
      fail: function () {

      },
      success: function (res) {
        that.setData({
          subcribe_status: res.data.Status
        })
        console.log(res)
      }
    })
  },
})