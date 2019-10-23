import axios from '@/libs/api.request'

/*
  获取厨房列表 
  没有权限控制 获取全部厨房列表
*/
/*
  no-data
*/
/*
  kitchen-list -- list
  kitchen-data-kitchen-detail - list
  kitchen-data-store-list - list
  finance-kitchen-expend-list - list
  kitchen-data-store-list - list
  finance-store-list -- list
  canvass-data-store-list -- list
  create_member -- list
  edit_Member -- list
*/
export const getKitchenList = () => {
  return axios.request({
    url: '/api/Kitchen/index',
    method: 'get'
  })
}


/*
  获取厨房列表 
  没有权限控制 获取全部厨房列表
*/
/*
  no-data
*/
/*
  kitchen-list -- list
  kitchen-data-kitchen-detail - list
  kitchen-data-store-list - list
  finance-kitchen-expend-list - list
  kitchen-data-store-list - list
  finance-store-list -- list
  canvass-data-store-list -- list
  create_member -- list
  edit_Member -- list
*/


// getKitchenQueryList
export const getKitchenQueryList = (data) => {
  return axios.request({
    url: '/api/Kitchen/queryList',
    data,
    method: 'post'
  })
}







export const getKitchenShow = (data) => {
  return axios.request({
    url: '/api/Kitchen/show',
    data,
    method: 'post'
  })
}
/*
  添加一个厨房
*/
/*
  data
  this.editItem.kitchen_name = params.row.kitchen_name
  this.editItem.manage_name = params.row.manage_name
  this.editItem.manage_phone = params.row.manage_phone
  this.editItem.position = params.row.position
  this.editItem.kitchen_rent = params.row.kitchen_rent
  this.editItem.garbage_fee = params.row.garbage_fee
  this.editItem.flue_fee = params.row.flue_fee
  this.editItem.kill_fee = params.row.kill_fee
  this.editItem.network_fee = params.row.network_fee
  this.editItem.water_fee = params.row.water_fee
  this.editItem.energy_fee = params.row.energy_fee
  this.editItem.storage_fee = params.row.storage_fee
  this.editItem.health_fee = params.row.health_fee
*/
/*
  kitchen-list -- 增加厨房
*/
export const addKitchen = ( data ) => {
  return axios.request({
    url: '/api/Kitchen/add',
    data,
    method: 'post'
  })
}
/*
  编辑一个厨房
*/
/*
  data
  this.editItem.id = params.row.id
  this.editItem.kitchen_name = params.row.kitchen_name
  this.editItem.manage_name = params.row.manage_name
  this.editItem.manage_phone = params.row.manage_phone
  this.editItem.position = params.row.position
  this.editItem.kitchen_rent = params.row.kitchen_rent
  this.editItem.garbage_fee = params.row.garbage_fee
  this.editItem.flue_fee = params.row.flue_fee
  this.editItem.kill_fee = params.row.kill_fee
  this.editItem.network_fee = params.row.network_fee
  this.editItem.water_fee = params.row.water_fee
  this.editItem.energy_fee = params.row.energy_fee
  this.editItem.storage_fee = params.row.storage_fee
  this.editItem.health_fee = params.row.health_fee
*/
/*
  kitchen-data-kitchen-detail -- 编辑厨房基本资料
*/
export const editKitchen = (data) => {
  return axios.request({
    url: '/api/Kitchen/edit',
    data,
    method: 'post'
  })
}
/*
  编辑一个厨房
*/
/*
  id : 1
*/
/*
  kitchen-list -- 删除厨房
*/
export const deleKitchen = (data) => {
  return axios.request({
    url: '/api/Kitchen/delete',
    data,
    method: 'post'
  })
}
/*
  获取厨房下的档口列表
*/
/*
  kitchen_id : 1
*/
/*
  kitchen-data-kitchen-detail -- 档口列表 标签
*/
export const getKitchenStoreList = ( data ) => {
  return axios.request({
    url: '/api/KitchenStore/index',
    params: data,
    method: 'get'
  })
}

/*
  获取厨房下的档口列表
*/
/*
  kitchen_id : 1
*/
/*
  kitchen-data-kitchen-detail -- 档口列表 标签
*/
export const getKitchenStoreQueryList = ( data ) => {
  return axios.request({
    url: '/api/KitchenStore/querylist',
    params: data,
    method: 'get'
  })
}
/*
  添加厨房下的档口
*/
/*
  area: (...)
  entrance_fee: (...)
  entrance_sell: (...)
  kitchen_id: 3
  rent_fee: (...)
  rent_sell: (...)
  store_no: (...)
*/
/*
  kitchen-data-kitchen-detail -- 添加厨房下的档口
*/
export const addKitchenStore = ( data ) => {
  return axios.request({
    url: '/api/KitchenStore/add',
    data,
    method: 'post'
  })
}
/*
  编辑厨房下的档口
*/
/*
  id:store_id
  area: (...)
  entrance_fee: (...)
  entrance_sell: (...)
  kitchen_id: 3
  rent_fee: (...)
  rent_sell: (...)
  store_no: (...)
*/
/*
  kitchen-data-kitchen-detail -- 编辑厨房下的档口
*/
export const editKitchenStore = ( data ) => {
  return axios.request({
    url: '/api/KitchenStore/edit',
    data,
    method: 'post'
  })
}
/*
  删除厨房下的档口
*/
/*
  id:store_id
*/
/*
  kitchen-data-kitchen-detail -- 删除厨房下的档口
*/
export const deleKitchenStore = (data) => {
  return axios.request({
    url: '/api/KitchenStore/delete',
    data,
    method: 'post'
  })
}
/*
  获取厨房下的公摊表列表
*/
/*
  kitchen_id:kitchen_id
*/
/*
  kitchen-data-kitchen-detail -- 能源表列表
*/
export const getKitchenMeterList = ( data ) => {
  return axios.request({
    url: '/api/KitchenMeter/queryList',
    data,
    method: 'post'
  })
}
/*
  增加厨房下的能源表
*/
/*
  kitchen_id
  meter_name
  meter_type
  multiple
*/
/*
  kitchen-data-kitchen-detail -- 添加能源表
*/
export const addKitchenMeter = ( data ) => {
  return axios.request({
    url: '/api/KitchenMeter/add',
    data,
    method: 'post'
  })
}
/*
  删除厨房下的能源表
*/
/*
  id
*/
/*
  kitchen-data-kitchen-detail -- 删除能源表
*/
export const deleteKitchenMeter = ( data ) => {
  return axios.request({
    url: '/api/KitchenMeter/delete',
    data,
    method: 'post'
  })
}


/*
  下拉配置列表
*/
/*
  id
*/
/*
  getWorkCategoryList -- 下拉配置列表
*/
export const getWorkCategoryList = ( page ) => {
  return axios.request({
    url: '/api/WorkCategory/index',
    params: page,
    method: 'get'
  })
}

/*
  增加一条下拉配置
*/
/*
  work_type : this.selectOrderId,
  title : this.eventTitle,
*/
/*
  category-list -- 增加一条下拉配置
*/
export const addWorkCategory = (obj) => {
  const data = obj
  return axios.request({
    url: '/api/WorkCategory/add',
    data,
    method: 'post'
  })
}

/*
  编辑一条下拉配置
*/
/*
  id:id
  work_type : this.selectOrderId,
  title : this.eventTitle,
*/
/*
  category-list -- 编辑一条下拉配置
*/
export const editWorkCategory = (obj) => {
  const data = obj
  return axios.request({
    url: '/api/WorkCategory/edit',
    data,
    method: 'post'
  })
}

/*
  删除一条下拉配置
*/
/*
  id:id
*/
/*
  category-list -- 删除一条下拉配置
*/
export const deleWorkCategory = (obj) => {
  const data = obj
  return axios.request({
    url: '/api/WorkCategory/delete',
    data,
    method: 'post'
  })
}































