import axios from '@/libs/api.request'


/*
  获取全部日检列表
*/
/*
  null
*/
/*
  l-shop-inspect-list -- 厨房列表
*/
export const getTotalInspectList = ( info ) => {
  return axios.request({
    url: '/api/Work/index',
    params: info,
    method: 'get'
  })
}

/*
  获取日检题目
*/
/*
  null
*/
/*
  kitchen-report -- 日检题目
  standard-report -- 日检题目
*/
export const getWorkOptionList = ( type ) => {
  return axios.request({
    url: '/api/Work/getWorkOptionList',
    params: type,
    method: 'get'
  })
}

/*
  获取日检详情
*/
/*
  id
*/
/*
  kitchen-report -- 日检详情
  standard-report -- 日检题目
*/
export const getWorkOptionDetail = (info) => {
  return axios.request({
    url: '/api/Work/show',
    params: info,
    method: 'get'
  })
}

/*
  获取权限下的列表
*/
/*
  id
*/
/*
  s-shop-inspect-list -- 日检题目
*/
export const getInspectList = ( info ) => {
  return axios.request({
    url: '/api/Work/employee',
    params: info,
    method: 'get'
  })
}









