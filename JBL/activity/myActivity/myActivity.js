// JBL/activity/myActivity/myActivity.js
const app = getApp()
const {
  globalData: {
    apiRequest,
  APIs
  }
} = app

const util = require('../../../common/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    page: 0,
    activityData: {
      lastPage: 1,
      page: "1",
      perPage: 10,
      total: 1,
      data: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: app.globalData.userID.token,
    })

    this.getActivityData()
  },

  onReachBottom: function () {
    this.getActivityData()
  },

  getActivityData() {
    let actPage = Number(this.data.page) + 1
    if (actPage > this.data.activityData.lastPage) {
      // wx.showToast({
      //   title: '没有更多活动',
      //   icon: 'none'
      // })
      return
    }

    if (actPage == 1) {
      wx.showLoading({
        title: '加载中..',
        mask: true
      })
    }

    apiRequest({
      url: APIs.myActivity,
      data: {
        page: actPage
      },
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        //console.log(res)
        if (res.data.activityData) {
          const {
            lastPage,
            page,
            perPage,
            total
          } = res.data.activityData
          res.data.activityData.data.map((item) => {
            item.act_time = util.formatTime(new Date(item.act_time))
            let img = ''
            switch (item.act_type) {
              case 1:
                img = 'book.png'
                break
              case 2:
                img = 'badminton.png'
                break
              case 3:
                img = 'basketball.png'
                break
              case 4:
                img = 'bodyboard.png'
                break
              case 5:
                img = 'fishing.png'
                break
              default:
                img = 'sprinter.png'
            }
            item.img = img
            return item
          })
          this.setData({
            page,
            activityData: {
              lastPage,
              page,
              perPage,
              total,
              data: [].concat(this.data.activityData.data, res.data.activityData.data)
            }
          })
        }
      },
      completeFn: (res) => {
        if (actPage == 1) {
          wx.hideLoading()
        }
      }
    })
  },

  goToshow(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../join/join?id=' + id,
    })
  },

})