Page({

  onReady:function(){
    console.log("onReady")
  },

  data: {
    loading: false,
    error: false,
    url:"",
    title:"",
    content: "",
  },
  onLoad: function (params) {

    var that = this;

    var urlStr = params.url
    this.setData({
      url: urlStr,
      loading:true
      })

    wx.request({
      url: 'https://readfollow.com/minapp/getcontent',
      // url: 'https://localhost:1323/show', 
      data: { url: urlStr},
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
        if (data.content!=undefined){
          that.setData({
            title: data.title,
            content: data.content,
            loading: false
          })
        }else{
          that.setData({
            error: true,
            loading: false,
          });
        }
      }
    })
  }

})
