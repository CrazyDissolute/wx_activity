// JBL/activity/show/show.js

const app = getApp()
const {
  globalData: {
    apiRequest,
    APIs,
    APIPictures
  }
} = app

const {
  APIHttps
} = require('../../../common/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    unionid: '',
    token: '',
    join_count: 0,
    status: 0,
    activityInfo: {},
    files: [],
    oldFiles: [],
    upUrl: '',
    upProgress: 0,
    errorArr: [],
    page: 0,
    joinData: {
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
  onLoad: function(options) {
    //console.log(options)

    const {
      id
    } = options
    //const id = 3
    this.setData({
      id,
      unionid: app.globalData.userID.unionId,
      token: app.globalData.userID.token,
    })

    this.getJoin()
  },

  onReachBottom: function() {
    this.getJoin()
  },

  getJoin() {
    //console.log(this.data.id)

    let actPage = Number(this.data.page) + 1
    if (actPage > this.data.joinData.lastPage) {
      return
    }
    if (actPage == 1) {
      wx.showLoading({
        title: '加载中..',
      })
    }
    apiRequest({
      url: APIs.getJoin + '/' + this.data.id,
      data: {
        page: actPage
      },
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        //console.log(res)
        if (res.data.joinData) {
          const {
            lastPage,
            page,
            perPage,
            total,
            oldFiles
          } = res.data.joinData
          const oldFiles_url = res.data.oldFiles.map(item => {
            item.photo_url = APIPictures + item.photo_url
            return item.photo_url
          })
          this.setData({
            page,
            join_count: res.data.join_count,
            status: res.data.activityInfo.ad_status,
            activityInfo: res.data.activityInfo,
            oldFiles: oldFiles_url,
            joinData: {
              lastPage,
              page,
              perPage,
              total,
              data: [].concat(this.data.joinData.data, res.data.joinData.data)
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

  confirmStart() {
    wx.showModal({
      title: '确认开始',
      content: '现在开始活动？',
      success: (res) => {
        if (res.confirm) {
          this.changeActStatus(1)
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  confirmEnd() {
    wx.showModal({
      title: '确认结束',
      content: '立即结束活动？',
      success: (res) => {
        if (res.confirm) {
          this.changeActStatus(2)
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  changeActStatus(status) {
    apiRequest({
      url: APIs.changeActStatus,
      data: {
        id: this.data.id,
        ad_status: status
      },
      method: 'POST',
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        //console.log(res)
        if (res.data.ad_status) {
          this.setData({
            status: res.data.ad_status
          })
        }
      }
    })
  },

  chooseImage: function(e) {
    var that = this;
    let count = 9
    if (this.data.files.length + this.data.oldFiles.length >= 9) {
      return
    }
    count = count - (this.data.files.length + this.data.oldFiles.length)
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: count,
      success: function(res) {
        //console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {
    //console.log(e.currentTarget.dataset.index)
    wx.previewImage({
      current: e.currentTarget.dataset.index, // 当前显示图片的http链接
      urls: [].concat(this.data.files, this.data.oldFiles)
    })
  },
  myUpdate: function() {
    for (let file in this.data.files) {
      let actFile = wx.uploadFile({
        url: APIHttps + APIs.uploadFile,
        filePath: this.data.files[file],
        name: 'thumb_img',
        formData: {
          'activity_id': this.data.id
        },
        header: {
          "Content-Type": "multipart/form-data",
          // 'Content-Type': 'application/octet-stream',
          "Authorization": 'Bearer ' + this.data.token
        },
        success: (res) => {
          //console.log(res)
          if (this.isJSON_test(res.data)) {
            let resData = JSON.parse(res.data)
            if (resData.picName) {
              this.setData({
                oldFiles: this.data.oldFiles.concat(APIPictures + resData.picName)
              });
            }
          } else {
            this.setData({
              errorArr: this.data.errorArr.concat(parseInt(file))
            })
          }

          if (this.data.files.length - 1 == file) {
            if (this.data.errorArr.length > 0) {
              let actFiles = [...this.data.files].reverse()
              for (let d in this.data.errorArr) {
                actFiles.splice(this.data.errorArr[d], 1)
              }
              this.setData({
                files: actFiles
              });
            }

            wx.showToast({
              title: `上传完成！`
            })
            this.setData({
              //oldFiles: (this.data.oldFiles.concat(this.data.files)).reverse(),
              files: [],
              errorArr: []
            });

          }

        },
        fail: (res) => {
          console.log(res)
        }
      })
      actFile.onProgressUpdate((res) => {
        //console.log(res)

        this.setData({
          upUrl: this.data.files[file] || '',
          upProgress: res.progress
        })
      })
    }

  },

  isJSON_test(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  },

  signActivity(e) {
    //console.log(e)
    const {
      id,
      index
    } = e.currentTarget.dataset
    const is_join = this.data.joinData.data[index].is_join
    wx.showLoading({
      title: '更新签到',
    })
    apiRequest({
      url: APIs.signActivity,
      data: {
        id,
        activity_id: this.data.id,
        is_join: (is_join == 0 || is_join == false) ? 1 : 0
      },
      method: 'POST',
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        //console.log(res)
        if (res.data.check) {
          this.setData({
            [`joinData.data[${index}].is_join`]: res.data.is_join
          })

          if (res.data.is_join == 1) {
            this.setData({
              join_count: ++this.data.join_count
            })
          } else {
            this.setData({
              join_count: --this.data.join_count
            })
          }
        }
        if (res.data.error) {
          this.setData({
            [`joinData.data[${index}].is_join`]: is_join
          })
          wx.showToast({
            title: '签到失败',
          })
        }
      },
      fail: (res) => {

      },
      completeFn: (res) => {
        wx.hideLoading()
      }
    })

  },

  delImg(e) {
    //console.log(e)
    const {
      index
    } = e.currentTarget.dataset
    const actFiles = this.data.files
    actFiles.splice(index, 1)
    this.setData({
      files: actFiles
    })
  },

  delOldImg(e) {
    //console.log(e)
    const {
      index,
      url
    } = e.currentTarget.dataset

    apiRequest({
      url: APIs.destroyPhoto,
      data: {
        activity_id: this.data.id,
        photo_url: url.replace(APIPictures, '')
      },
      method: 'POST',
      header: {
        Authorization: 'Bearer ' + this.data.token
      },
      successFn: (res) => {
        console.log(res)
        if (res.data.joinId) {
          const actFiles = this.data.oldFiles
          actFiles.splice(index, 1)
          this.setData({
            oldFiles: actFiles
          })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }

      }
    })

  }

})