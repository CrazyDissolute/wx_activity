const app = getApp()

Page({
  data: {
    list: [{
        id: 'form',
        name: '公司活动',
        open: false,
        status: true,
        option: [{
            title: '创建活动',
            path: '/JBL/activity/new/new'
          },
          {
            title: '活动列表',
            path: '/JBL/activity/list/list'
          },
          {
            title: '光荣榜单',
            path: '/JBL/activity/glory/glory'
          },
          {
              title: '我的参加',
              path: '/JBL/activity/myActivity/myActivity'
          }
          // {
          //   title: '关注活动',
          //   path: '/JBL/activity/follow/follow'
          // }
        ]
      },
    //   {
    //     id: 'widget',
    //     name: '公告',
    //     open: false,
    //     status: false,
    //     option: []
    //   },
    //   {
    //     id: 'special',
    //     name: '审批',
    //     open: false,
    //     status: false,
    //     option: []
    //   },
    //   {
    //     id: 'shop',
    //     name: '内购商城',
    //     open: false,
    //     status: false,
    //     option: []
    //   },
      {
        id: 'set',
        name: '设置',
        open: false,
        status: true,
        option: [
          {
            title: '权限设置',
            path: '',
            button: true,
            event: 'power'
          }
        ]
      }
    ],
    options: {}
  },
  onLoad(options) {
    //console.log(options)
    //console.log(app.globalData)

    if (options.share_query) {
      this.setData({
        options
      })
    }
    this.checkUser(this.data.options)

  },
  power: function() {
    wx.openSetting({
      success(res) {
        //console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // wx.navigateBack({
          //   delta: 2
          // })
        } else {
          app.globalData.userInfo = null
          app.globalData.userID = null
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('userID')
          wx.redirectTo({
            url: '/entry/entry'
          })
        }
      }
    })
  },
  checkUser: function(options) {
    //console.log(options)
    if (!app.globalData.userID) {
      if (options.share_query) {
        let url = `?share_query=${options.share_query}`
        wx.redirectTo({
          url: `../entry/entry${url}`
        })
      } else {
        wx.redirectTo({
          url: `../entry/entry`
        })
      }
      return
    }

    if (options.share_query) {
      let url = decodeURIComponent(options.share_query)
      wx.navigateTo({
        url: url,
      })
    }
  },
  kindToggle: function(e) {
    var id = e.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
});