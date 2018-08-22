// JBL/activity/share/share.js

const app = getApp()
const {
  globalData: {
    apiRequest,
    APIs,
    APIPictures
  }
} = app

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {},
    unionid: '',
    token: '',
    APIPictures,
    id: 0,
    actTxt: '活动创建成功'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options)

    if (options.from=='join'){
      this.setData({
        actTxt: '我参加了一个活动'
      })
    }
    let _this = this

    //console.log(options)
    this.setData({
      unionid: app.globalData.userID.unionId,
      token: app.globalData.userID.token
    })

    let { id } = options
    //let id = 28
    this.setData({
      id: Number(id)
    })
    wx.showLoading({
      title: '加载中..',
    })
    apiRequest({
      url: APIs.getActivity + '/' + this.data.id,
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        //console.log(res.data)
        res.data.actInfo.ad_code = APIPictures + res.data.actInfo.ad_code
        _this.setData({
          page: res.data.actInfo
        })
      },
      completeFn: (res)=>{
        wx.hideLoading()
      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let txt = '我发起了一个活动来参加吧！'
    if (this.data.actTxt =='我参加了一个活动'){
      txt = '我参加了一个活动一起来吧！'
    }
    let url = encodeURIComponent(`/JBL/activity/join/join?id=${this.data.id}`)
    return {
      title: txt,
      path: `/JBL/index?share_query=${url}`
    }
  },

  goToshow() {
    wx.navigateTo({
      url: '../show/show?id=' + this.data.id
    })
  }
})