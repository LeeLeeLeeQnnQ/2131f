import axios from '@/libs/api.request'

// 获取本月商户账单
/*
  kitchen_id : 1 | month : 2019-01
*/
/*
  kitchen-kitchen-bill --- 店内运营 --> 商户账单
  finance-kitchen-bill -- 商户账单
*/
export const getStoreBillList = ( data ) => {
  return axios.request({
    url: '/api/StoreBill/queryList',
    params: data,
    method: 'get'
  })
}


// 获取本月商户账单 分页
/*
  store_id
*/
/*
  
*/
export const getStoreBillListPage = ( data ) => {
  return axios.request({
    url: '/api/StoreBill/index',
    params: data,
    method: 'get'
  })
}


// 查询商户每月能源费用
/*
  month : this.select_time , kitchen_id:this.select_kitchen_id , store_id: store_id
*/
/*
  kitchen-kitchen-bill --- 能源费用
  finance-kitchen-bill --- 能源费用
*/
export const getStoreChargeItem = ( data ) => {
  return axios.request({
    url: '/api/StoreCharge/queryList',
    params: data,
    method: 'get'
  })
}

// 编辑商户每月能源费用
/*
  id
  month : this.select_time , kitchen_id:this.select_kitchen_id , store_id: store_id
*/
/*
  kitchen-kitchen-bill --- 店内运营 --> 商户账单 --> 编辑 （ 经营费用 租金 ）
  finance-kitchen-bill --- 财务 --> 商户账单 --> 编辑 （ 经营费用 租金 ）
*/
export const editStoreBillItem = ( data ) => {
  return axios.request({
    url: '/api/StoreBill/edit',
    data,
    method: 'post'
  })
}

// 增加一条每月能源费用
/*
  base_number: (...)
  day_number: (...)
  energy_end: (...)
  energy_fee: (...)
  energy_image: (...)
  energy_multiple: (...)
  energy_share_fee: (...)
  energy_start: (...)
  fine_fee: (...)
  flue_fee: (...)
  garbage_fee: (...)
  health_fee: (...)
  kill_fee: (...)
  kitchen_id: (...)
  kitchen_name: (...)
  manage_fee: (...)
  month: (...)
  network_fee: (...)
  one_fee: (...)
  other_fee: (...)
  overdue_fee: (...)
  project_fee: (...)
  remark: (...)
  status: (...)
  storage_fee: (...)
  store_id: (...)
  store_name: (...)
  store_no: (...)
  taxes_fee: (...)
  total: "4508.95"
  total_fee: (...)
  water_end: (...)
  water_fee: (...)
  water_image: (...)
  water_multiple: (...)
  water_share_fee: (...)
  water_start: (...)
*/
/*
  kitchen-kitchen-bill --- 店内运营 --> 商户账单 --> 编辑 （ 经营费用 租金 ）
*/
export const addStoreCharge = ( data ) => {
  return axios.request({
    url: '/api/StoreCharge/add',
    data,
    method: 'post'
  })
}

/*
  商户退租
*/
/*
  apply_date: "2019-04-10"
  end_letter: "https://ocs-attachment.oss-cn-qingdao.aliyuncs.com/4c621/d3934/5c9da084e7488.png"
  exit_date: "2019-04-02"
  kitchen_id: 1
  kitchen_name: "四道口厨房（一店）"
  rent_type: (...)
  title: (...)
  settle_date: "2019-04-09"
  store_id: 28

  rent: Array(1)
    0:
    category_id: (...)
    money: (...)
    quantity: (...)
    remark: (...)
*/
/*
  calendar -- 获取商户列表
  eliminate-store --  获取商户列表
  kitchen_shop_edit2 --  获取商户列表
  kitchen_shop_handle2 --  获取商户列表
*/
export const quitKitchen = ( data ) => {
  data.lease_type = '2'
  return axios.request({
    url: '/api/StoreLease/edit',
    data,
    method: 'post'
  })
}

// 获取抄表列表
/*
  { month : this.select_time , kitchen_id:this.select_kitchen_id }
  page 
*/
/*
  kitchen-record --- 抄表列表
*/
export const queryMeterList = ( data ) => {
  return axios.request({
    url: '/api/Meter/queryList',
    params: data,
    method: 'get'
  })
}

// 编辑抄表信息
/*
  creator_id: (...)
  creator_name: (...)
  end_value: (...)
  id: (...)
  images: (...)
  initRowIndex: (...)
  kitchen_id: (...)
  kitchen_name: (...)
  meter_date: (...)
  meter_name: (...)
  meter_type: (...)
  month: (...)
  multiple: (...)
  remark: (...)
  start_value: (...)
  status: (...)
  store_no: (...)
*/
/*
  kitchen-record --- 编辑抄表信息
*/
export const editMeter = ( data ) => {
  return axios.request({
    url: '/api/Meter/edit',
    data,
    method: 'post'
  })
}


// 刷新表信息
/*
  creator_id: (...)
  creator_name: (...)
  end_value: (...)
  id: (...)
  images: (...)
  initRowIndex: (...)
  kitchen_id: (...)
  kitchen_name: (...)
  meter_date: (...)
  meter_name: (...)
  meter_type: (...)
  month: (...)
  multiple: (...)
  remark: (...)
  start_value: (...)
  status: (...)
  store_no: (...)
*/
/*
  kitchen-record --- 编辑抄表信息
*/
export const refreshMeter = ( data ) => {
  return axios.request({
    url: '/api/Meter/changeMeter',
    data,
    method: 'post'
  })
}

/*
  获取商户罚款列表
*/
/*
  kitchen_id
*/
/*
  f-kitchenRent-list --  商户罚款列表
*/
export const getStoreFineList = ( data ) => {
  return axios.request({
    url: '/api/StoreFine/index',
    data,
    method: 'get'
  })
}

/*
  增加一条罚款
*/
/*
  amount: "150"
  fine_type: 2
  images: "https://ocs-attachment.oss-cn-qingdao.aliyuncs.com/4c621/d3934/5c9da084e7488.png"
  kitchen_id: 1
  store_id: 28
*/
/*
  f-kitchenRent-list --  增加一条罚款
*/
export const addStoreFine = ( data ) => {
  return axios.request({
    url: '/api/StoreFine/add',
    data,
    method: 'post'
  })
}

/*
  获取一条罚款
*/
/*
  id
*/
/*
  f-kitchenRent-list --  获取一条罚款
*/
export const showStoreFine = ( id ) => {
  const data = { id : id }
  return axios.request({
    url: 'api/StoreFine/show',
    data,
    method: 'post'
  })
}

/*
  删除一条罚款
*/
/*
  id
*/
/*
  f-kitchenRent-list --  删除一条罚款
*/
export const deleteStoreFine = ( id ) => {
  const data = { id : id }
  return axios.request({
    url: '/api/StoreFine/delete',
    data,
    method: 'post'
  })
}

/*
  获取人员列表
*/
/*
  id
*/
/*
  kitchen_shop_detail --  获取人员列表
  kitchen_shop_edit
  kitchen_shop_edit2
*/
export const getStoreEmployeeList = ( store_id ) => {
  const data = { store_id : store_id }
  return axios.request({
    url: '/api/StoreEmployee/index',
    params: data,
    method: 'get'
  })
}

/*
  设备清单
*/
/*
  store_id
*/
/*
  kitchen_shop_detail --  设备清单
  kitchen_shop_edit
  kitchen_shop_edit2
*/
export const showStoreDevice = ( id ) => {
  const data = { store_id : id }
  return axios.request({
    url: '/api/StoreDevice/show',
    data,
    method: 'post'
  })
}

/*
  添加店铺人员
*/
/*
  store_id
*/
/*
  kitchen_shop_edit --  添加店铺人员
  kitchen_shop_edit2 --  添加店铺人员
*/
export const addStoreEmployee = ( data ) => {
  return axios.request({
    url: '/api/StoreEmployee/add',
    data,
    method: 'post'
  })
}

/*
  编辑店铺人员
*/
/*
  。。。
*/
/*
  kitchen_shop_edit --  编辑店铺人员
  kitchen_shop_edit2 --  编辑店铺人员
*/
export const editStoreEmployee = ( data ) => {
  return axios.request({
    url: '/api/StoreEmployee/edit',
    data,
    method: 'post'
  })
}

/*
  删除店铺人员
*/
/*
  。。。
*/
/*
  kitchen_shop_edit --  删除店铺人员
  kitchen_shop_edit2 --  删除店铺人员
*/
export const deleteStoreEmployee = ( id ) => {
  const data = { id : id }
  return axios.request({
    url: '/api/StoreEmployee/delete',
    data,
    method: 'post'
  })
}

/*
  编辑设备清单
*/
/*
  。。。
*/
/*
  kitchen_shop_edit --  编辑设备清单
  kitchen_shop_edit2 --  编辑设备清单
*/
export const editStoreDevice = ( data ) => {
  return axios.request({
    url: '/api/StoreDevice/edit',
    data,
    method: 'post'
  })
}

/*
  厨房发起结算
*/
/*
  。。。
*/
/*
  kitchen_shop_handle2 --  厨房发起结算
*/
export const settleShop = ( id ) => {
  const data = { store_id : id }
  return axios.request({
    url: '/api/StoreLease/settle',
    data,
    method: 'post'
  })
}






// 作废接口
// =================================================
/// api/kitchen/show
// export const getKitchenDetail = (id) => {
//   return axios.request({
//     url: '/api/Kitchen/show?id=' + id,
//     method: 'get'
//   })
// }

// /// api/kitchen/getStoreNo 厨房档口列表
// export const getKitchenStoreNo = (id) => {
//   const obj = { kitchen_id : id }
//   return axios.request({
//     url: '/api/Kitchen/getStoreNo',
//     params: obj,
//     method: 'get'
//   })
// }

// // 获取厨房营收数据 /api/kitchen/getKitchenAccount
// export const getKitchenAccountData = (data) => {
//   return axios.request({
//     url: '/api/Kitchen/getKitchenAccount',
//     params: data,
//     method: 'get'
//   })
// }

// // 获取厨房每月费用地址 /api/Kitchen/getKitchenCharge
// export const getKitchenChargeList = ( data ) => {
//   return axios.request({
//     url: '/api/Kitchen/getKitchenCharge',
//     params: data,
//     method: 'get'
//   })
// }

// // 更新厨房每月缴费详情地址 /api/Kitchen/editKitchenCharge
// export const editKitchenCharge = ( data ) => {
//   return axios.request({
//     url: '/api/Kitchen/editKitchenCharge',
//     data,
//     method: 'post'
//   })
// }

// //获取列表 /api/StoreCharge/index
// export const getStoreChargeList = ( data ) => {
//   return axios.request({
//     url: '/api/StoreCharge/index',
//     params: data,
//     method: 'get'
//   })
// }

// // /api/StoreCharge/delete  删除一个缴费单
// export const deleteStoreCharge = ( data ) => {
//   return axios.request({
//     url: '/api/StoreCharge/delete',
//     data,
//     method: 'post'
//   })
// }

// // /api/StoreCharge/work
// export const changeStoreWork = ( data ) => {
//   return axios.request({
//     url: '/api/StoreCharge/work',
//     data,
//     method: 'post'
//   })
// }
// =================================================


























