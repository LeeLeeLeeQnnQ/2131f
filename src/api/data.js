import axios from '@/libs/api.request'

/*
  获取全部商户列表
*/
/*
  kitchen_id 
  --------
  lease_type = 1 起租中
  lease_type = 2 租赁中
  lease_type = 3 退租中
  lease_type = 4 归档
  null 全部
*/
/*
  kitchen-data-store-list -- 全部商户
  finance-store-list -- 全部商户
  canvass-data-store-list -- 全部商户
*/
export const getAllShopList = ( info ) => {
  return axios.request({
    url: '/api/StoreLease/index',
    params: info,
    method: 'get'
  })
}




/// api/kitchen/getStoreNo 厨房档口列表
export const getKitchenListStoreNo = ( id ) => {
  const obj = { kitchen_id : id }
  return axios.request({
    url: '/api/Kitchen/getStoreNo',
    params: obj,
    method: 'get'
  })
}


/*
  招商签约分析查询
*/
/*
  start_time:'',
  end_time:'',
  id:'',
*/
/*
  sign_analysis
*/
export const getSignShopList = ( info ) => {
  return axios.request({
    url: '/api/StoreLease/index',
    params: info,
    method: 'get'
  })
}



/*
  厨房入场进度获取
*/
/*
  kitchen_id:'',
*/
/*
  
*/
export const queryStoreProgress = ( info ) => {
  return axios.request({
    url: '/api/StoreLease/queryStoreProgress',
    params: info,
    method: 'get'
  })
}

/*
  招商签约分析不分页查询
*/
/*
  start_time:'',
  end_time:'',
  id:'',
*/
/*
  sign_analysis
*/
export const getSignShopQueryList = ( info ) => {
  return axios.request({
    url: '/api/StoreLease/queryList',
    params: info,
    method: 'get'
  })
}


/*
  获取权限下的厨房列表
*/
/*
  null
*/
/*
  kitchen-kitchen-bill -- 厨房列表
  calendar - 厨房列表
  eliminate-store -- 厨房列表
  l-shop-inspect-list -- 厨房列表
  kitchen-record -- 厨房列表
  f-kitchenRent-list - 厨房列表
  build-kichen - 厨房列表
  expenses-order - 厨房列表
  edit-expenses-order  - 厨房列表
  wages_list  - 厨房列表
  finance-kitchen-bill - 厨房列表
  canvass-store-view - 厨房列表
  finance-store-edit - 厨房列表
  finance-store-edit2
  finance-store-handle
  view_analysis_body
*/
export const getKitchenList = () => {
  return axios.request({
    url: '/api/Index/getKitchenList',
    method: 'get'
  })
}

/*
  建档是否存在客户ID
*/
/*
  start_time:'',
  end_time:'',
  id:'',
*/
/*
  sign_analysis
*/
export const isExistCustome = ( info ) => {
  return axios.request({
    url: 'api/Clue/existCustomer',
    params: info,
    method: 'get'
  })
}


/*
  获取考个入住率
*/
/*
  
*/
/*
  
*/
export const getKitchenResideQueryList = ( info ) => {
  return axios.request({
    url: 'api/KitchenReside/queryList',
    params: info,
    method: 'get'
  })
}

/*
  获取考个设备列表
*/
/*
  
*/
/*
  
*/
export const getKitchenStoreDeviceList = ( info ) => {
  return axios.request({
    url: 'api/Kitchen/getStoreDevice',
    params: info,
    method: 'get'
  })
}



/*
  获取人员
*/
/*
  
*/
/*
  
*/
export const getKitchenStoreEmployeeList = ( info ) => {
  return axios.request({
    url: 'api/Kitchen/getStoreEmployee',
    params: info,
    method: 'get'
  })
}

/*
  获取权限下的厨房列表
*/
/*
  null
*/
/*
  kitchen-kitchen-bill -- 厨房列表
*/
// export const queryStoreByEnergyPayList = ( obj ) => {
//   return axios.request({
//     url: '/api/StoreLease/queryStoreByEnergyPay',
//     params: obj,
//     method: 'get'
//   })
// }

/*
  获取厨房信息
*/
/*
  null
*/
/*
  kitchen-kitchen-bill -- 厨房信息
*/
// export const getKitchenInfo = (data) => {
//   return axios.request({
//     url: '/api/Kitchen/index',
//     data,
//     method: 'post'
//   })
// }


/*
  获取厨房厨房管理人员
  绑定权限ID 7
*/
/*
  null
*/
/*
  calendar -- 店内人员列表
  wages_list -- 店内人员列表
*/
export const getKitchenEmployeeList = (kichen_id) => {
  //同意分组厨房管理人员
  const data = { group_id: '7', kichen_id: kichen_id }
  return axios.request({
    url: '/api/Index/getEmployeeList',
    data,
    method: 'post'
  })
}

/*
  获取厨房下的商户信息
*/
/*
  kitchen_id
*/
/*
  calendar -- 获取商户列表
  f-kitchenRent-list --  获取商户列表
  expenses-order --  获取商户列表
  edit-expenses-order  --  获取商户列表
*/
export const getStoreList = (id) => {
  let data = { kitchen_id: id }
  data.lease_type = 6 ;
  return axios.request({
    url: '/api/StoreLease/queryList',
    data,
    method: 'post'
  })
}

/*
  获取厨房下的商户信息
*/
/*
  kitchen_id
*/
/*
  eliminate-store --  获取商户列表
*/
export const getNormalStoreList = (id) => {
  let data = { kitchen_id: id }
  data.lease_type = 2 ;
  return axios.request({
    url: '/api/StoreLease/queryList',
    data,
    method: 'post'
  })
}

/*
  获取表格下拉选项
*/
/*
  work_type 5 -- 支出表格
  work_type 7 -- 起租表格
  work_type 8 -- 退租表格
  work_type 9 -- 区域下拉
*/
/*
  build-kichen --  起租表格
  eliminate-store --  退租表格
  expenses-order -- 支出表格
  edit-expenses-order -- 支出表格
  finance-store-edit -- 起租表格
  finance-store-edit2 -- 起租表格
  finance-store-handle -- 起租表格
  kitchen_shop_edit2 --  退租表格
  kitchen_shop_handle2 --  退租表格
  finance_shop_handle2 --  退租表格
  spread_list -- 9  退租表格
*/
export const getWorkCategoryList = ( id ) => {
  const obj = { work_type : id };
  return axios.request({
    url: '/api/Index/getWorkCategory',
    params: obj,
    method: 'post'
  })
}


/*
  获取退租计算信息
*/
/*
  store_id
*/
/*
  finance-store-edit2 --  财务编辑2
*/
export const getRefundData = ( obj ) => {
  return axios.request({
    url: '/api/StoreLease/refund',
    params: obj,
    method: 'post'
  })
}
/*
  获取厨房下的档口列表
*/
/*
  kitchen_id
*/
/*
  build-kichen --  获取档口列表
  finance-store-edit --  获取档口列表
  finance-store-edit2
*/
export const getStoreNoList = ( obj ) => {
  return axios.request({
    url: '/api/Index/getStoreNo',
    params: obj,
    method: 'get'
  })
}


// api/StoreLease/changeStoreNo
export const changeStoreNo = ( data ) => {
  return axios.request({
    url: '/api/StoreLease/changeStoreNo',
    data,
    method: 'post'
  })
}




/*
  获取招商经理列表
  固定权限租8
*/
/*
  group_id
*/
/*
  build-kichen --  获取招商经理
  canvass-store-view --  获取招商经理
  finance-store-edit --  获取招商经理
  finance-store-edit2
*/
// export const getLeasingList = () => {
//   const data = { group_id: '8' }
//   return axios.request({
//     url: '/api/Index/getEmployeeList',
//     data,
//     method: 'post'
//   })
// }

export const getLeasingList = (data) => {
  return axios.request({
    url: '/api/Index/getSalesList',
    data,
    method: 'post'
  })
}



export const showEmployee = (data) => {
  return axios.request({
    url: '/api/Employee/show',
    data,
    method: 'post'
  })
}

/*
  获取招商经理列表
  固定权限租7
*/
/*
  group_id
*/
/*
  build-kichen --  获取档口列表
  finance-store-edit 
  finance-store-edit2
*/
export const getManageList = () => {
  const data = { group_id: '7' }
  return axios.request({
    url: '/api/Index/getEmployeeList',
    data,
    method: 'post'
  })
}

/*
  获取店铺起租详情
*/
/*
  {id: id, lease_type: 0}
*/
/*
  canvass_shop_edit --  获取店铺起租详情
  finance-store-edit --  获取店铺起租详情
  finance-store-edit2
  finance-store-handle
  finance-store-handle2
  kitchen_shop_detail
  kitchen_shop_edit
  kitchen_shop_edit2
  kitchen_shop_handle
  kitchen_shop_handle2
*/
export const getShopDetail = (data) => {
  return axios.request({
    url: '/api/StoreLease/show',
    data,
    method: 'post'
  })
}

/*
  店铺起租信息
*/
/*
  this.leaseinfo
*/
/*
  canvass_shop_edit 
  finance-store-edit
  finance-store-edit2
  finance-store-handle
  kitchen_shop_edit
  kitchen_shop_edit2
  kitchen_shop_handle
  kitchen_shop_handle2
*/
export const setStartShopEdit = (data) => {
  data.lease_type = '1'
  return axios.request({
    url: '/api/StoreLease/edit',
    data,
    method: 'post'
  })
}

/*
  店铺退租信息
*/
/*
  this.leaseinfo
*/
/*
  finance-store-edit2
  finance-store-handle2
*/
export const setEndShopEdit = (data) => {
  data.lease_type = '2'
  return axios.request({
    url: '/api/StoreLease/edit',
    data,
    method: 'post'
  })
}

/*
  修改密码
*/
/*
  
*/
/*
  changePWD
*/
export const setNewPWD = (data) => {
  return axios.request({
    url: '/api/Employee/updatePassword',
    data,
    method: 'post'
  })
}


/*
  获取预减档 列表
*/
/*
  
*/
/*
  获取预减档 列表
*/
export const getPrebuildList = (info) => {
  return axios.request({
    url: '/api/StoreReady/index',
    params: info,
    method: 'post'
  })
}

/*
  获取预减档 列表
*/
/*
  
*/
/*
  获取预减档 列表
*/
export const getPrebuildQueryPage = (info) => {
  return axios.request({
    url: '/api/StoreReady/queryPage',
    params: info,
    method: 'post'
  })
}




/*
  id id 
*/
/*
  
*/
export const deletePrebuildItem = (data) => {
  return axios.request({
    url: 'api/StoreReady/delete',
    data,
    method: 'post'
  })
}


/*
  id id 
*/
/*
  
*/
export const getMapInfo = (data) => {
  return axios.request({
    url: 'api/Crawler/queryPolygon',
    data,
    method: 'post'
  })
}


// 订单列表
export const getCurrentOrderList = (data) => {
  return axios.request({
    url: 'api/Order/index',
    data,
    method: 'post'
  })
}


// 详情
export const getCurrentOrderDetail = (data) => {
  return axios.request({
    url: 'api/Order/detail',
    data,
    method: 'post'
  })
}


// 订单列表
export const getHistoryOrderList = (data) => {
  return axios.request({
    url: 'api/Order/history',
    data,
    method: 'post'
  })
}


// 详情
export const getHistoryOrderDetail = (data) => {
  return axios.request({
    url: 'api/Order/show',
    data,
    method: 'post'
  })
}


// getShopComment
export const getShopComment = (data) => {
  return axios.request({
    url: 'api/Comment/index',
    data,
    method: 'post'
  })
}



// getShopComment
export const getShopCommentDetail = (data) => {
  return axios.request({
    url: 'api/Comment/show',
    data,
    method: 'post'
  })
}














