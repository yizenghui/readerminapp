Page({

  // onReady:function(){
  //   console.log("onReady")
    
    
  // },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: this.data.title,
      path: 'pages/info/index?url=' + this.data.url,
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
    previous:"", //上一页链接
    next:"",  // 下一页链接
    menu:"",
    url:"",
    title:"",
    content: "",
    list:[],
  },
  onLoad: function (params) {
    var urlStr = params.url
    this.fetch(urlStr)
    this.buildLink()
  },

// 获取数据
  fetch(urlStr){
    var that = this;
    this.setData({
      url: urlStr,
      loading: true
    })
    
    wx.request({
      url: 'https://readfollow.com/minapp/getcontent',
      // url: 'https://localhost:1323/show', 
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
        var data = res.data;
        if (data.content != undefined) {
          that.setData({
            title: data.title,
            content: data.content,
            loading: false
          })
        } else {
          that.setData({
            error: true,
            loading: false,
          });
        }
      }
    })
  },
  // 生成链接
  buildLink(){
    var that = this
    // 把历史记录读取出来
    wx.getStorage({
      key: '__read_menu_url',
      success: function (res) {
        var url = res.data
        that.setData({
          menu: url
        })
        wx.getStorage({
          key: '__cache_list_' + url,
          success: function (res) {
            var list = JSON.parse(res.data) || []
            if (list.length) {
              var k, _temp;
              k = -1;
              var thisUrl = that.data.url
              for (var i = 0; i < list.length; i++) {
                _temp = list[i]
                if (_temp.url == thisUrl) {
                  k = i;
                  wx.setStorage({ // 记录当前阅读的章节
                    key: "__read_info_" + url, 
                    data: JSON.stringify(_temp)
                  })
                  break;
                }
              }
              if (k>-1) {
                var prev = "", next=""
                if (k > 0 && list[k - 1])  prev = list[k - 1].url
                if ( list[k + 1]) next = list[k + 1].url
                that.setData({
                  previous: prev,
                  next: next,
                })
              }
            }
            that.setData({
              list: list
            })
          }
        })
      }
    })
  },

  // 上一页
  tapPrevious(){
    if(this.data.previous){
      this.fetch(this.data.previous)
      this.buildLink()
    }

  },
  // 下一页
  tapNext() {
    if (this.data.next) {
      this.fetch(this.data.next)
      this.buildLink()
    }
  },



})
