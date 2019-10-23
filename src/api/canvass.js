import axios from '@/libs/api.request'

/*
  获取带看列表
*/
/*
  { contact : this.userPhone.trim() , page : page }
*/
/*
  canvass-store-view --  获取带看列表
*/
export const getClueList = ( obj ) => {
  return axios.request({
    url: '/api/Clue/index',
    params: obj,
    method: 'get'
  })
}

/*
  获取带看列表 不分页
*/
/*
  { kitchen_id：1 ,  start_time : 2017-10-02 , end_time : 2018-10-05 }
*/
/*
  view_analysis_body --  获取带看列表
*/
export const getQueryClueList = ( obj ) => {
  return axios.request({
    url: '/api/Clue/queryList',
    params: obj,
    method: 'get'
  })
}



/*
  查询客户信息地址
*/
/*
  { contact : this.userPhone.trim()}
*/
/*
  canvass-store-view --  查询客户信息地址
*/
export const queryCustomer = ( data ) => {
  return axios.request({
    url: '/api/Clue/queryCustomer',
    data,
    method: 'post'
  })
}

/*
  增加一条带看
*/
/*
  area: (...)
  category: (...)
  clue_date: "2019-04-09"
  consider: (...)
  contact: "13326545665"
  customer_name: (...)
  employee_id: (...)
  employee_name: "招商人员"
  kitchen_id: (...)
  remark: (...)
  source: (...)
  total_count: 1
*/
/*
  canvass-store-view --  增加一条带看
*/
export const addNewClue = ( data ) => {
  return axios.request({
    url: '/api/Clue/add',
    data,
    method: 'post'
  })
}

/*
  编辑一条带看
*/
/*
  id:id
  area: (...)
  category: (...)
  clue_date: "2019-04-09"
  consider: (...)
  contact: "13326545665"
  customer_name: (...)
  employee_id: (...)
  employee_name: "招商人员"
  kitchen_id: (...)
  remark: (...)
  source: (...)
  total_count: 1
*/
/*
  canvass-store-view --  编辑一条带看
*/
export const editOldClue = ( data ) => {
  return axios.request({
    url: '/api/Clue/edit',
    data,
    method: 'post'
  })
}


/*
  删除一条带看
*/
/*
  id:id
*/
/*
  canvass-store-view --  编辑一条带看
*/
export const deleteClue = ( id ) => {
  let data = { id : id }
  return axios.request({
    url: '/api/Clue/delete',
    data,
    method: 'post'
  })
}



/*
  获取观望预约列表
*/
/*
  start_time  end_time
*/
/*
  web_book --  init
*/
export const getWebBookList = ( obj ) => {
  return axios.request({
    url: '/api/Reserve/index',
    params: obj,
    method: 'get'
  })
}


/*
  店铺预建档案
*/
/*
  *
*/
/*
  
*/
export const setPreBuild = ( data ) => {
  return axios.request({
    url: '/api/StoreReady/add',
    data,
    method: 'post'
  })
}

/*
  店铺预建档案
*/
/*
  *
*/
/*
  
*/
export const showPreBuildItem = ( data ) => {
  return axios.request({
    url: '/api/StoreReady/show',
    data,
    method: 'post'
  })
}


/*
  编辑预建档案
*/
/*
  *
*/
/*
  
*/
export const editPreBuildItem = ( data ) => {
  return axios.request({
    url: '/api/StoreReady/edit',
    data,
    method: 'post'
  })
}

 
/*
  修改
*/
/*
  *
*/
/*
  web_book 
*/
export const changWebBookStatus = ( data ) => {
  return axios.request({
    url: '/api/Reserve/edit',
    data,
    method: 'post'
  })
}


