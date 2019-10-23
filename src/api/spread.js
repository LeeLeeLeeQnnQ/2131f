import axios from '@/libs/api.request'


// 获取列表
/*
  获取列表
*/
/*
  id : 1
*/
/*
  
*/
export const getSpreadStoreList = (data) => {
  return axios.request({
    url: '/api/Shop/index',
    params: data,
    method: 'get'
  })
}


// 获取列表
/*
  获取列表
*/
/*
  id : 1
*/
/*
  
*/
export const getSpreadStoreQueryList = (data) => {
  return axios.request({
    url: '/api/Shop/queryList',
    params: data,
    method: 'get'
  })
}


// 获取列表
/*
  获取列表
*/
/*
  id : 1
*/
/*
  
*/
export const setStoreSort = (data) => {
  return axios.request({
    url: '/api/Shop/sort',
    data,
    method: 'post'
  })
}

// 增加一个推广商户
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
export const addSpreadStore = (data) => {
  return axios.request({
    url: '/api/Shop/add',
    data,
    method: 'post'
  })
}


// 编辑一个推广商户
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
export const editSpreadStore = (data) => {
  return axios.request({
    url: '/api/Shop/edit',
    data,
    method: 'post'
  })
}

// 更改一个推广商户状态
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
export const changeStateSpreadStore = (data) => {
  return axios.request({
    url: '/api/Shop/state',
    data,
    method: 'post'
  })
}

// 充值
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
export const depositSpreadStore = (data) => {
  return axios.request({
    url: '/api/Shop/deposit',
    data,
    method: 'post'
  })
}


// 提现
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
export const paymentSpreadStore = (data) => {
  return axios.request({
    url: '/api/Shop/payment',
    data,
    method: 'post'
  })
}



// 获取充值列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
export const getShopPayList = (data) => {
  return axios.request({
    url: '/api/ShopPay/index',
    params: data,
    method: 'get'
  })
}


// 获取区域列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
export const getAreaList = (data) => {
  return axios.request({
    url: '/api/Area/getAreaList',
    data,
    method: 'post'
  })
}


// 获取红包申请列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// UserOrder
export const getSpreadUserOrderList = (data) => {
  return axios.request({
    url: '/api/UserOrder/index',
    params: data,
    method: 'get'
  })
}


// 获取用户信息列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// UserOrder
export const getSpreadUserList = (data) => {
  return axios.request({
    url: '/api/User/index',
    params: data,
    method: 'get'
  })
}


// 获取用户信息列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// UserOrder
export const getInviteUserList = (data) => {
  return axios.request({
    url: '/api/UserInvite/index',
    params: data,
    method: 'get'
  })
}


// 编辑红包申请列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// UserOrder
export const changeStateSpreadUserOrdert = (data) => {
  return axios.request({
    url: '/api/UserOrder/state',
    data,
    method: 'post'
  })
}


// Banner列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// Banner列表
export const getBannerList = (data) => {
  return axios.request({
    url: '/api/Banner/index',
    data,
    method: 'post'
  })
}



// AddNewBanner列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// Banner列表
export const addNewBanner = (data) => {
  return axios.request({
    url: '/api/Banner/add',
    data,
    method: 'post'
  })
}


// editBanner列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// Banner列表
export const editBanner = (data) => {
  return axios.request({
    url: '/api/Banner/edit',
    data,
    method: 'post'
  })
}


// changeBannerStatus
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// Banner列表
export const changeBannerStatus = (data) => {
  return axios.request({
    url: '/api/Banner/status',
    data,
    method: 'post'
  })
}



// 商户账号列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const getShopUserList = (data) => {
  return axios.request({
    url: '/api/ShopUser/index',
    params: data,
    method: 'get'
  })
}


// 商户账号列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const getStoreList = (data) => {
  return axios.request({
    url: '/api/Store/index',
    params: data,
    method: 'get'
  })
}


// 商户账号列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const addStoreItem = (data) => {
  return axios.request({
    url: '/api/Store/add',
    data,
    method: 'post'
  })
}

// 商户账号列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const editStoreItem = (data) => {
  return axios.request({
    url: '/api/Store/edit',
    data,
    method: 'post'
  })
}



// 商户下拉
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const getShopsList = (data) => {
  return axios.request({
    url: '/api/Shop/getShops',
    params: data,
    method: 'get'
  })
}


// 增加新
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const addNewShopUser = (data) => {
  return axios.request({
    url: '/api/ShopUser/add',
    data,
    method: 'post'
  })
}


// 修改
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const editShopUser = (data) => {
  return axios.request({
    url: '/api/ShopUser/edit',
    data,
    method: 'post'
  })
}


// 删除
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const deleteShopUser = (data) => {
  return axios.request({
    url: '/api/ShopUser/delete',
    data,
    method: 'post'
  })
}


// Banner列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// Banner列表
export const getZoneList = (data) => {
  return axios.request({
    url: '/api/Area/getAreaList',
    data,
    method: 'get'
  })
}


export const searchByOrdersn = (data) => {
  return axios.request({
    url: '/api/Order/search',
    data,
    method: 'post'
  })
}



// 获取饿了么列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const getStoreEleList = (data) => {
  return axios.request({
    url: 'api/StoreEle/index',
    params: data,
    method: 'get'
  })
}


export const editStoreEle = (data) => {
  return axios.request({
    url: 'api/StoreEle/edit',
    data,
    method: 'post'
  })
}


// 获取饿了么列表
/*
  推广商户
*/
/*
  id : 1
*/
/*
  
*/
// ShopUser列表
export const getStoreMeituanList = (data) => {
  return axios.request({
    url: 'api/StoreMeituan/index',
    params: data,
    method: 'get'
  })
}

export const editStoreMeituan = (data) => {
  return axios.request({
    url: 'api/StoreMeituan/edit',
    data,
    method: 'post'
  })
}
