import axios from '@/libs/api.request'

/*
  获取厨房支出列表
*/
/*
  kitchen_id
*/
/*
  kitchen-data-kitchen-detail -- 支出列表
  expenses-order  -- 支出列表
  edit-expenses-order  -- 支出列表
  finance-kitchen-expend-list  -- 支出列表
*/
export const getKitchenExpendList = ( obj ) => {
  return axios.request({
    url: '/api/KitchenExpend/index',
    params: obj,
    method: 'get'
  })
}


/*
  获取厨房支出列表
*/
/*
  kitchen_id
*/
/*
  kitchen-data-kitchen-detail -- 支出列表
  expenses-order  -- 支出列表
  edit-expenses-order  -- 支出列表
  finance-kitchen-expend-list  -- 支出列表
*/
export const getKitchenExpendQuery = ( obj ) => {
  return axios.request({
    url: '/api/KitchenExpend/queryList',
    params: obj,
    method: 'get'
  })
}


/*
  获取厨房支出收入
*/
/*
  kitchen_id
*/
/*
  
*/
export const getKitchenIncomeQuery = ( obj ) => {
  return axios.request({
    url: '/api/KitchenIncome/queryList',
    params: obj,
    method: 'get'
  })
}



// kitchen/getKitchenAccounts
export const getKitchenAccounts = ( obj ) => {
  return axios.request({
    url: '/api/Kitchen/getKitchenAccounts',
    params: obj,
    method: 'get'
  })
}



/*
  新建一家店铺
*/
/*
  kitchen_id: (...)
  kitchen_name: "四道口厨房（二店）"
  manage_id: (...)
  manage_lease: (...)
  manage_lease_id: (...)
  manage_name: (...)
  pay: "https://ocs-attachment.oss-cn-qingdao.aliyuncs.com/4c621/d3934/5c9da084e7488.png"
  shopkeeper: (...)
  shopkeeper_phone: (...)
  store_name: (...)
  store_no: (...)

  rent: Array(1)
  0:
  category_id: (...)
  money: (...)
  quantity: (...)
  remark: (...)
  rent_type: (...)
  title: (...)
*/
/*
  build-kichen -- 添加商铺
*/
export const setKitchen = (data) => {
  data.opinion_type = '1'
  return axios.request({
    url: '/api/StoreLease/add',
    data,
    method: 'post'
  })
}

/*
  增加一条厨房支出
*/
/*
  expend_date: "2019-04-02"
  images: "https://ocs-attachment.oss-cn-qingdao.aliyuncs.com/4c621/d3934/5c9da084e7488.png"
  kitchen_id: 3
  money: 1
  remark: ""
  title: "12"
  work_id: "0"

  list: Array(1)
    0:
    category_id: (...)
    money: (...)
    quantity: (...)
    remark: (...)
    title: (...)
*/
/*
  expenses-order --  增加一条厨房支出
*/
export const addKitchenExpend = ( data ) => {
  return axios.request({
    url: '/api/KitchenExpend/add',
    data,
    method: 'post'
  })
}


/*
  获取厨房指出分类
*/
/*

*/
/*
  expenses-order --  增加一条厨房支出
*/
export const getExpendType = (  ) => {
  return axios.request({
    url: '/api/KitchenExpend/getExpendType',
    method: 'get'
  })
}


/*
  获取厨房收入分类
*/
/*

*/
/*
  expenses-order --  增加一条厨房支出
*/
export const getIncomeType = (  ) => {
  return axios.request({
    url: '/api/KitchenIncome/getIncomeType',
    method: 'get'
  })
}


/*
  获取一条支出详情
*/
/*
  id
*/
/*
  edit-expenses-order -- 获取一条支出详情
*/
export const showKitchenExpend = ( id ) => {
  const data = { id: id }
  return axios.request({
    url: '/api/KitchenExpend/show',
    data,
    method: 'post'
  })
}

/*
  编辑一条支出详情
*/
/*
  expend_date: "2019-04-04"
  id: 6
  images: "https://ocs-attachment.oss-cn-qingdao.aliyuncs.com/4c621/d3934/5c9da084e7488.png"
  kitchen_id: 1
  list: (2) [{…}, {…}, __ob__: Observer]
  money: 1000
  remark: ""
  title: "test"
  work_id: "0"
*/
/*
  edit-expenses-order -- 编辑一条支出详情
*/
export const editKitchenExpend = ( data ) => {
  return axios.request({
    url: '/api/KitchenExpend/edit',
    data,
    method: 'post'
  })
}

/*
  删除一条支出列表
*/
/*
  no-data
*/
/*
  finance-kitchen-expend-list - 删除一条支出列表
*/
export const deleteKitchenExpend = ( id ) => {
  const data = { id: id }
  return axios.request({
    url: '/api/KitchenExpend/delete',
    data,
    method: 'post'
  })
}


//财务允许起租
/*
  财务允许起租
*/
/*
  id 
*/
/*
  finance-store-handle - 财务允许起租
*/
export const confirmShopStart = ( id ) => {
  const data = { store_id : id }
  return axios.request({
    url: '/api/StoreLease/confirm',
    data,
    method: 'post'
  })
}

//
/*
  财务归档
*/
/*
  id 
*/
/*
  finance-store-handle2 - 财务归档
*/
export const setFileStore = (data) => {
  return axios.request({
    url: '/api/StoreLease/archive',
    data,
    method: 'post'
  })
}


//
/*
  厨房确认起租
*/
/*
  id 
*/
/*
  kitchen_shop_handle - 厨房确认起租
*/
export const startShopStart = ( id ) => {
  const data = { store_id : id }
  return axios.request({
    url: '/api/StoreLease/start',
    data,
    method: 'post'
  })
}

// 获取商户上缴欠款列表列表
/*
  bill_id :1
*/
/*
  finance-kitchen-bill  编辑 --> 缴费列表
  finance-kitchen-bill --- 缴费列表
*/
export const getStoreBillPayList = ( data ) => {
  return axios.request({
    url: '/api/StoreBill/queryPayList',
    data,
    method: 'post'
  })
}


// 分页获取商户上缴欠款列表列表
/*
  kitchen_id :1
  store_id :1
*/
/*
  kitchen_shop_detail  商铺详情 缴费列表
*/
export const getStoreBillPayPage = ( data ) => {
  return axios.request({
    url: '/api/StoreBill/queryPayPage',
    data,
    method: 'post'
  })
}

// 添加一条交款
/*
  let data = {};
  data.bill_id = this.storeBill.id;
  data.store_id = this.storeBill.store_id;
  data.money = this.storeBill.money;
  data.images = this.uploadLetter.join(",");
  data.remark = this.storeBill.remark;
*/
/*
  finance-kitchen-bill  添加 --> 添加一条缴费
*/
export const addStoreBillPay = ( data ) => {
  return axios.request({
    url: '/api/StoreBill/addStoreBillPay',
    data,
    method: 'post'
  })
}

// 添加一条交款
/*
  { id : 1}
*/
/*
  finance-kitchen-bill  缴费列表 --> 删除
*/
export const deleteStoreBillPay = ( data ) => {
  return axios.request({
    url: '/api/StoreBill/deleteStoreBillPay',
    data,
    method: 'post'
  })
}








// 作废接口
// =================================================
// 起租完成
// export const setStartStore = (id) => {
//   const data = { store_id: id }
//   return axios.request({
//     url: '/api/StoreLease/start',
//     data,
//     method: 'post'
//   })
// }
// =================================================

