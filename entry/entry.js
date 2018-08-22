//index.js
//获取应用实例
const app = getApp()
const {
  globalData: {
    apiRequest,
    APIs,
    Promise
  }
} = getApp()

Page({
  data: {
    motto: '广州市杰钡利贸易有限公司',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    options: {}
  },

  onLoad: function(options) {
    //console.log(app.globalData)

    //console.log(getCurrentPages())
    if (getCurrentPages().length > 1) {
      wx.reLaunch({
        url: '/entry/entry'
      })
    }

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

    if (options.share_query) {
      this.setData({
        options
      })
    }
    this.checkUser()

  },
  onShow: function() {

  },
  checkUser: function() {
    if (app.globalData.userID) {
      this.inHoome()
    } else {
      app.globalData.userInfo = null
      this.setData({
        userInfo: null,
        hasUserInfo: false
      })
    }
  },
  inHoome() {
    let share_query = this.data.options.share_query
    if (share_query) {
      wx.reLaunch({
        url: '/JBL/index?share_query=' + share_query
      })
    } else {
      wx.reLaunch({
        url: '/JBL/index'
      })
    }
  },
  atuh: function(e) {
    if (e.detail.userInfo) {
      let _this = this
      wx.showLoading({
        title: '认证中..',
      })
      Promise.all([this.getUserInfo(e), this.getLogin()]).then(results => {
        //console.log(results)
        const {
          encryptedData,
          iv,
          code
        } = { ...results[0],
          ...results[1]
        }

        apiRequest({
          url: APIs.login,
          data: {
            encryptedData,
            iv,
            code
          },
          method: 'POST',
          successFn: (res) => {
            //console.log(res)

            if (res.data.unionId) {
              app.globalData.userID = {
                openId: res.data.openId,
                unionId: res.data.unionId,
                token: res.data.token
              }
              wx.setStorageSync('userID', {
                openId: res.data.openId,
                unionId: res.data.unionId,
                token: res.data.token
              })
              this.setData({
                userInfo: wx.getStorageSync('userInfo'),
                hasUserInfo: true
              })

              //console.log(app.globalData)
              this.inHoome()
            } else {
              wx.showToast({
                title: '认证失败，请重试！',
                icon: 'none',
              })
              app.globalData.userInfo = null
              _this.setData({
                userInfo: null,
                hasUserInfo: false
              })

            }
          },
          failFn: (res) => {
            wx.showToast({
              title: '认证失败，请重试！',
              icon: 'none',
            })
          },
          complete: (res) => {
            wx.hideLoading()
          }
        })

      });
    }
  },
  getLogin: function() {
    return new Promise((resolve, resject) => {
      wx.login({
        success: res => {
          resolve(res)
        }
      })
    })
  },
  getUserInfo: function(e) {
    return new Promise((resolve, resject) => {
      app.globalData.userInfo = e.detail.userInfo
      wx.setStorageSync('userInfo', e.detail.userInfo)
      // this.setData({
      //     userInfo: e.detail.userInfo,
      //     hasUserInfo: true
      // })
      resolve(e.detail)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})