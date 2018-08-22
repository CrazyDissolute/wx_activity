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
    let {
      id
    } = options
    this.setData({
      id,
      token: app.globalData.userID.token
    })
    this.getActivity()
  },

  getActivity() {
    apiRequest({
      url: APIs.getActivity + '/' + this.data.id,
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        //console.log(res)
        let {
          title,
          join_total,
          act_type,
          content,
          address,
          address_name,
          latitude,
          longitude
        } = res.data.actInfo
        let date = util.formatTime(new Date(res.data.actInfo.act_time), 'date')
        let time = util.formatTime(new Date(res.data.actInfo.act_time), 'time')
        this.setData({
          title,
          join_total,
          date: date,
          time: time,
          act_type: Number.parseInt(act_type) - 1,
          content,
          address,
          address_name,
          latitude,
          longitude
        })
      }
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
  clearMap() {
    this.setData({
      address: '',
      address_name: '',
    })
  },
  inputFN(e) {
    this.setData({
      [e.target.id]: e.detail.value
    })
  },
  formSubmit() {
    //console.log(this.data)
    let {
      title,
      join_total,
      act_type,
      content,
      address,
      address_name,
      latitude,
      longitude,
      date,
      time
    } = this.data
    let act_time = date + ' ' + time
    act_type = Number.parseInt(act_type) + 1

    title = title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
    content = content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
    address = address.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")

    wx.showLoading({
      title: '提交中..',
    })
    apiRequest({
      url: APIs.editActivity + '/' + this.data.id,
      data: {
        title,
        join_total,
        act_type,
        content,
        address,
        address_name,
        latitude,
        longitude,
        act_time
      },
      method: 'POST',
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        wx.hideLoading()
        //console.log(res)
        if (res.data.aid) {
          wx.showToast({
            icon: 'success',
            title: '活动修改成功',
          })
          wx.navigateBack({
            delta:2
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '活动修改失败',
          })
        }
      },
      fail: (res) => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '活动修改失败',
        })
      }
    })

  }


})