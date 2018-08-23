// JBL/activity/join/join.js

const app = getApp()
const {
  globalData: {
    apiRequest,
    APIs,
    Promise,
    APIPictures
  }
} = app

const util = require('../../../common/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    unionid: '',
    openId: '',
    token: '',
    activity: {},
    oldFiles: [],
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
    }],
    join_count: 0,
    isJoin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options)
    const {
      id
    } = options
    //const id = 2

    this.setData({
      unionid: app.globalData.userID.unionId,
      openId: app.globalData.userID.openId,
      token: app.globalData.userID.token,
      id
    })
    wx.showLoading({
      title: '加载中..',
    })
    Promise.all([this.getActivity()]).then(results => {
      //console.log(results)

      if (results[0].data.actInfo) {
        results[0].data.actInfo.act_time = util.formatTime(new Date(results[0].data.actInfo.act_time))
        results[0].data.oldFiles.map(item => {
          item.photo_url = APIPictures + item.photo_url
          return item
        })
        this.setData({
          activity: results[0].data.actInfo,
          join_count: results[0].data.join_count,
          isJoin: results[0].data.isJoin == 0 ? true : false,
          oldFiles: results[0].data.oldFiles
        })
        if (results[0].data.actInfo.latitude && results[0].data.actInfo.longitude) {
          this.setData({
            ['markers[0]']: {
              latitude: results[0].data.actInfo.latitude,
              longitude: results[0].data.actInfo.longitude
            }
          })
        }
      }

      // if (results[1].data.joinId) {
      //     this.setData({
      //         isJoin: false
      //     })
      // }

      wx.hideLoading()
    })

  },

  getActivity() {
    return new Promise((resolve, resject) => {
      apiRequest({
        url: APIs.getActivity + '/' + this.data.id,
        header: {
          Authorization: 'Bearer ' + this.data.token
        },
        successFn: (res) => {
          resolve(res)
        }
      })
    })
  },

  checkJoin() {
    return new Promise((resolve, resject) => {
      apiRequest({
        url: APIs.checkJoin,
        method: 'POST',
        data: {
          activity_id: this.data.id
        },
        header: {
          Authorization: 'Bearer ' + this.data.token
        },
        successFn: (res) => {
          resolve(res)
        }
      })
    })
  },

  myJoin(e) {
    wx.showLoading({
      title: '报名中..',
      mask: true
    })
    apiRequest({
      url: APIs.joinActivity,
      data: {
        activity_id: this.data.id,
        form_id: e.detail.formId,
        open_id: this.data.openId
      },
      method: 'POST',
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        //console.log(res)
        if (res.data.joinId) {
          wx.redirectTo({
            url: '../share/share?id=' + this.data.id + '&from=join',
          })
        }else{
          wx.showToast({
            duration: 1500,
            title: res.data.message
          })
        }
      },
      completeFn: (res) => {
        wx.hideLoading()
      }
    })
  },

  viewShow() {
    wx.navigateTo({
      url: '../show/show?id=' + this.data.id
    })
  },

  viewShare(){
    wx.navigateTo({
      url: '../share/share?id=' + this.data.id + '&from=join'
    })
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.index,
      urls: this.data.oldFiles.map(item => item.photo_url)
    })
  },

  edit(){
    wx.navigateTo({
      url: '../edit/edit?id=' + this.data.id
    })
  }
})