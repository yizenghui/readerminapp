//index.js
//获取应用实例
const app = getApp()

Page({

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log(this)
    return {
      title: '跟读小程序',
      path: 'pages/list/index?url='+this.data.url,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  data: {
    loading: false,
    error: false,
    title: "",
    url: "",
    list: [],
    logs:[],
    read_log:[],
  },


  // onReady: function () {
  //   console.log(2)
  //   var that = this
  //   // 把历史记录读取出来
  //   wx.getStorage({
  //     key: 'url_logs',
  //     success: function (res) {
  //       var logs = JSON.parse(res.data) || []
  //       that.setData({
  //         logs: logs
  //       })
  //     }
  //   })

  //   wx.getStorage({
  //     key: '__read_log' + that.data.url,
  //     success: function (res) {
  //       var read_log = JSON.parse(res.data) || []
  //       console.log(read_log)
  //       that.setData({
  //         read_log: read_log
  //       })
  //     }
  //   })
  // },

  onLoad: function (params) {
    var that = this;
    var urlStr = params.url
    // 显示加载动画
    that.setData({ url: urlStr, loading: true })
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
          loading:false
        });
        // 以下逻辑有问题，获取的 logs 是 []
        // var rep = false; // 是否已存在
        // var logs = that.data.logs
        // if (logs.lenght) {
        // // 检查有没缓存重复数据
        //   for (var i = 0; i < logs.lenght; i++) {
        //     console.log(logs[i].url, urlStr)
        //     if (logs[i].url == urlStr) rep = true
        //   }
        // }
        // // 没有重复才写入缓存
        // if (!rep) {
        //   logs.push({ url: urlStr, title: res.data.title })
        //   wx.setStorage({
        //     key: "url_logs",
        //     data: JSON.stringify(logs)
        //   })
        // }
      }
    })
  },

  tapReverseList: function (event) {
    this.setData({ list: this.data.list.reverse()})
  },

  // methods:{

  //   log: function (url, title) {
  //     var that = this;
  //     var rep = false; // 是否已存在
  //     var logs = that.data.logs
  //     if (logs.lenght) {
  //       // 检查有没缓存重复数据
  //       for (var i = 0; i < logs.lenght; i++) {
  //         if (logs.lenght[i].url == url) rep = true
  //       }
  //     }
  //     // 没有重复才缓存
  //     if (!rep) {
  //       logs = append({ url: url, title: title })
  //       wx.setStorage({
  //         key: "url_logs",
  //         data: JSON.stringify(logs)
  //       })
  //     }
  //   }
  // }
})
