const APIHttps = 'https://oa.jiebeili.cn/wedemo/v0/'
const APIPictures = 'https://oa.jiebeili.cn/wedemo/v0/pictures/'

const APIs = {
  "login": "login",                     //登录接口
  "newActivity": "newActivity",         //创建新活动
  "editActivity": "editActivity",       //编辑活动
  "getActivity": "getActivity",         //获取活动详细
  "listActivity": "listActivity",       //活动列表
  "joinActivity": "joinActivity",       //参加活动
  "checkJoin": "checkJoin",             //检查用户是否参加活动
  "getJoin": "getJoin",                 //获取活动报名单
  "getTheme": "getTheme",               //获取活动主题列
  "changeActStatus": "changeActStatus", //改变活动状态
  "uploadFile": "uploadFile",           //上传图片
  "signActivity": "signActivity",       //活动签到
  "getGlory": "getGlory",               //获取榜单
  "destroyPhoto": "destroyPhoto",       //删除活动照片
  "myActivity": "myActivity",           //我参加的活动
}

const apiRequest = ({
  url,
  data,
  header = {},
  method = 'GET',
  dataType = '',
  successFn = (res) => {},
  failFn = (res) => {},
  completeFn = (res) => {}
}) => {
  wx.request({
    url: APIHttps + url,
    data: data,
    header: header,
    method: method,
    dataType: dataType,
    success: successFn,
    fail: failFn,
    complete: completeFn
  })
}

module.exports = {
  APIs,
  apiRequest,
  APIHttps,
  APIPictures
}