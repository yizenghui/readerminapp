
const app = getApp()

Page({
  onReady: function (e) {
    this.fetch('http://book.zongheng.com/chapter/730066/40426648.html')
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    // this.play()
  },
  data: {
    title: '',
    contents: [],
    loading: false,
    playIndex: 30
  },

  play() {

    this.backgroundAudioManager.title = '此时此刻'
    this.backgroundAudioManager.epname = '此时此刻'
    this.backgroundAudioManager.singer = '跟读小程序'
    this.backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'

    var playIndex = this.data.playIndex
    var contents = this.data.contents
    var txt = contents[playIndex].text
    console.log(txt)
    var that = this
    that.backgroundAudioManager.src = that.buildUrl(txt)
    that.backgroundAudioManager.onEnded(
      () => {
        playIndex++
        if (playIndex < contents.length) {
          that.backgroundAudioManager.title = '此时此刻' + playIndex
          that.backgroundAudioManager.epname = '此时此刻' + playIndex
          var txt = contents[playIndex].text
          // that.backgroundAudioManager.src = 'https://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=24.f28935c504bb05da2099b371406a878c.2592000.1521978785.282335-10531269&tex=' + encodeURI(txt) + '&vol=9&per=0&spd=5&pit=5'
          console.log(txt)

          that.backgroundAudioManager.src = that.buildUrl(txt)
        }
      })

    that.backgroundAudioManager.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  // 获取音频地址
  buildUrl(txt) {
    return 'https://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=24.f28935c504bb05da2099b371406a878c.2592000.1521978785.282335-10531269&tex=' + encodeURI(txt) + '&vol=9&per=0&spd=5&pit=5'
  },
  // 获取数据
  fetch(urlStr) {
    var that = this;
    this.setData({
      url: urlStr,
      loading: true
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://minapp.readfollow.com/getbookcontent',
      // url: 'https://localhost:1323/show', 
      data: {
        url: urlStr,
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
        wx.hideLoading()
      },
      success: function (res) {
        var data = res.data;
        if (data.content != undefined) {
          that.setData({
            title: data.title,
            contents: data.content,
            loading: false
          })
          setTimeout(function () {
            that.play()
          }, 1000)
        } else {
          that.setData({
            error: true,
            loading: false,
          });
        }
        wx.hideLoading()
      }
    })
  },
})