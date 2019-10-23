import axios from '@/libs/api.request'


// 作废接口
// ===================================================
// export const getOrderList = (obj) => {
//   return axios.request({
//     url: '/api/WorkOrder/index',
//     params: obj,
//     method: 'get'
//   })
// }
// // 奖惩
// export const setLimitOrder = (data) => {
//   data.work_type = '1'
//   return axios.request({
//     url: '/api/WorkOrder/add',
//     data,
//     method: 'post'
//   })
// }
// // 接驳
// export const setConnectOrder = (data) => {
//   data.work_type = '3'
//   return axios.request({
//     url: '/api/WorkOrder/add',
//     data,
//     method: 'post'
//   })
// }
// // 租金
// export const setRentOrder = (data) => {
//   data.work_type = '6'
//   return axios.request({
//     url: '/api/WorkOrder/add',
//     data,
//     method: 'post'
//   })
// }
// // 缴费
// export const setIncomeOrder = (data) => {
//   data.work_type = '4'
//   return axios.request({
//     url: '/api/WorkOrder/add',
//     data,
//     method: 'post'
//   })
// }
// // 维修
// export const setRepairOrder = (data) => {
//   data.work_type = '2'
//   return axios.request({
//     url: '/api/WorkOrder/add',
//     data,
//     method: 'post'
//   })
// }
// // 厨房费用
// export const setExpensesOrder = (data) => {
//   data.work_type = '5'
//   return axios.request({
//     url: '/api/WorkOrder/add',
//     data,
//     method: 'post'
//   })
// }

// // 获取工单详情
// export const getOrderDetail = (data) => {
//   return axios.request({
//     url: '/api/WorkOrder/show',
//     data,
//     method: 'post'
//   })
// }

// // 获取回复内容
// export const passOrder = (data) => {
//   data.approval = '1'
//   return axios.request({
//     url: '/api/WorkOrder/approval',
//     data,
//     method: 'post'
//   })
// }

// // 驳回回复内容
// export const rejectOrder = (data) => {
//   data.approval = '2'
//   return axios.request({
//     url: '/api/WorkOrder/approval',
//     data,
//     method: 'post'
//   })
// }
// ===================================================