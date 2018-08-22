// JBL/activity/new/new.js

const app = getApp()
const {
  globalData: {
    apiRequest,
    APIs
  }
} = app

const util = require('../../../common/util.js')

Page({

  data: {
    title: '',
    join_total: 0,
    date: util.formatTime(new Date(), 'date'),
    time: '17:00',
    typeArr: ['学习分享会', '羽毛球', '篮球', '游泳', '瑜伽', '其它'],
    act_type: 0,
    content: '',
    address: '',
    address_name: '',
    latitude: '',
    longitude: '',
    unionid: '',
    openId: '',
    token: '',
  },

  onLoad: function(options) {
    this.setData({
      unionid: app.globalData.userID.unionId,
      openId: app.globalData.userID.openId,
      token: app.globalData.userID.token
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindTypeChange(e) {
    this.setData({
      act_type: e.detail.value
    })
  },
  viewMap() {
    let _this = this;
    wx.chooseLocation({
      success: (res) => {
        //console.log(res)
        _this.setData({
          address: res.address,
          address_name: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  formSubmit(e) {
    //console.log(e)
    
    if (e.detail.value.title == "") {
      wx.showToast({
        icon: 'none',
        title: '请填写活动标题',
      })
      return
    }

    let sendData = { ...this.data }
    sendData.act_time = sendData.date + ' ' + sendData.time
    sendData.act_type = parseInt(sendData.act_type) + 1
    sendData.formId = e.detail.formId
    delete sendData.date
    delete sendData.time
    delete sendData.unionid
    delete sendData.token
    delete sendData.typeArr

    sendData.title = sendData.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
    sendData.content = sendData.content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
    sendData.address = sendData.address.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")

    //console.log(sendData)
    //return

    wx.showLoading({
      title: '创建中..',
      mask: true
    })
    //console.log(sendData)
    //return
    apiRequest({
      url: APIs.newActivity,
      data: sendData,
      method: 'POST',
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        wx.hideLoading()
        //console.log(res)
        if (res.data.id) {
          wx.redirectTo({
            url: '../share/share?id=' + res.data.id[0] + '&from=new'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '活动创建失败',
          })
        }
      },
      fail: (res) => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '活动创建失败',
        })
      },
      completeFn: (res) => {
        //wx.hideLoading()
      }
    })

  },
  inputFN(e) {
    this.setData({
      [e.target.id]: e.detail.value
    })
  }



})