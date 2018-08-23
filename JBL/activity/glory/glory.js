let app = getApp();
const {
  globalData: {
    apiRequest,
    APIs,
    Promise
  }
} = app

Page({
  data: {
    typeArr: ['综合', '学习', '羽毛球', '篮球', '游泳', '瑜伽', '其它'],
    typedata: ['all', 'book', 'badminton', 'basketball', 'bodyboard', 'fishing', 'sprinter'],
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: {
      all: {
        page: 0,
        actData: {
          lastPage: 1,
          page: "1",
          perPage: 10,
          total: 1,
          data: []
        }
      },
      book:{
        page: 0,
        actData: {
          lastPage: 1,
          page: "1",
          perPage: 10,
          total: 1,
          data: []
        }
      },
      badminton: {
        page: 0,
        actData: {
          lastPage: 1,
          page: "1",
          perPage: 10,
          total: 1,
          data: []
        }
      },
      basketball: {
        page: 0,
        actData: {
          lastPage: 1,
          page: "1",
          perPage: 10,
          total: 1,
          data: []
        }
      },
      bodyboard: {
        page: 0,
        actData: {
          lastPage: 1,
          page: "1",
          perPage: 10,
          total: 1,
          data: []
        }
      },
      fishing: {
        page: 0,
        actData: {
          lastPage: 1,
          page: "1",
          perPage: 10,
          total: 1,
          data: []
        }
      },
      sprinter: {
        page: 0,
        actData: {
          lastPage: 1,
          page: "1",
          perPage: 10,
          total: 1,
          data: []
        }
      },
    }
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab >= 3 && this.data.currentTab < 5) {
      this.setData({
        scrollLeft: 200
      })
    } else if (this.data.currentTab >= 5){
      this.setData({
        scrollLeft: 400
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function() {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 80;
        //console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });

    wx.showLoading({
      title: '加载中..',
      mask: true
    })

    Promise.all([
      this.getGlory({ page: 1, type: 0 }), 
      this.getGlory({ page: 1, type: 1 }),
      this.getGlory({ page: 1, type: 2 }),
      this.getGlory({ page: 1, type: 3 }),
      this.getGlory({ page: 1, type: 4 }),
      this.getGlory({ page: 1, type: 5 }),
      this.getGlory({ page: 1, type: 6 })
    ]).then(results=>{
      //console.log(results)

      wx.hideLoading()

      if (results[0]){
        this.setData({
          ['expertList.all.page']: results[0].data.glory.page,
          ['expertList.all.actData']: results[0].data.glory
        })
      }
      if (results[1]) {
        this.setData({
          ['expertList.book.page']: results[1].data.glory.page,
          ['expertList.book.actData']: results[1].data.glory
        })
      }
      if (results[2]) {
        this.setData({
          ['expertList.badminton.page']: results[2].data.glory.page,
          ['expertList.badminton.actData']: results[2].data.glory
        })
      }
      if (results[3]) {
        this.setData({
          ['expertList.basketball.page']: results[3].data.glory.page,
          ['expertList.basketball.actData']: results[3].data.glory
        })
      }
      if (results[4]) {
        this.setData({
          ['expertList.bodyboard.page']: results[4].data.glory.page,
          ['expertList.bodyboard.actData']: results[4].data.glory
        })
      }
      if (results[5]) {
        this.setData({
          ['expertList.fishing.page']: results[5].data.glory.page,
          ['expertList.fishing.actData']: results[5].data.glory
        })
      }
      if (results[6]) {
        this.setData({
          ['expertList.sprinter.page']: results[6].data.glory.page,
          ['expertList.sprinter.actData']: results[6].data.glory
        })
      }
    })
  },

  getGlory({page=1, type=0}) {
    return new Promise((resolve, resject)=>{
      apiRequest({
        url: APIs.getGlory,
        data: {
          page,
          type
        },
        successFn: (res) => {
          //console.log(res)
          resolve(res)
        }
      })
    })
  },

  glorypull() {
    let type = this.data.currentTab
    let tab = ''
    switch (type){
      case 0:
        tab = 'all'
        break
      case 1:
        tab = 'book'
        break
      case 2:
        tab = 'badminton'
        break
      case 3:
        tab = 'basketball'
        break
      case 4:
        tab = 'bodyboard'
        break
      case 5:
        tab = 'fishing'
        break
      default:
        tab = 'sprinter'
    }
    let { page, actData: { lastPage }} = this.data.expertList[tab]
    let loadPage = parseInt(page) + 1
    console.log(loadPage, lastPage)
    if (loadPage <= lastPage){
      Promise.all([
        this.getGlory({ page: loadPage, type })
      ]).then(results => {
        console.log(results)
        if (results[0]) {
          console.log(1111)
          this.setData({
            ['expertList.'+tab+'.page']: results[0].data.glory.page,
            ['expertList.' + tab + '.actData.data']: (this.data.expertList[tab].actData.data).concat(results[0].data.glory.data)
          })
        }
      })
    }
  }
})