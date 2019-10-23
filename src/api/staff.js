import axios from '@/libs/api.request'

/*
  获取值班表列表
*/
/*
  kitchen_id
*/
/*
  calendar -- 值班表
*/
export const getCalendar = ( kitchen_id ) => {
  let data = { kitchen_id: kitchen_id }
  return axios.request({
    url: 'api/Work/getRule',
    data,
    method: 'post'
  })
}

/*
  编辑值班表
*/
/*
  {rule: Array(3)}
  rule: Array(3)
  0:
  employee_id: 48
  kitchen_id: 1
  store_id: (35) [16, 28, 104, 96, 89, 90, 87, 88, 92, 69, 86, 80, 83, 84, 77, 85, 78, 74, 58, 17, 18, 19, 20, 21, 22, 23, 26, 27, 29, 30, 31, 32, 33, 34, 35]
  work_type: 1
  1: {employee_id: 29, store_id: Array(17), work_type: 1, kitchen_id: 1}
  2: {employee_id: 28, store_id: Array(18), work_type: 1, kitchen_id: 1}
*/
/*
  calendar -- 编辑值班表
*/
export const setCalendar = (data) => {
  return axios.request({
    url: '/api/Work/rule',
    data,
    method: 'post'
  })
}

/*
  获取厨房工资列表
*/
/*
 { kitchen_id:this.select_kitchen_id , month : this.select_time } 
*/
/*
  wages_list -- 人员工资列表
*/
export const getEmployeeWageList = (obj) => {
  return axios.request({
    url: '/api/EmployeeWage/index',
    params: obj,
    method: 'get'
  })
}

/*
  增加一条人员工资
*/
/*
  wage_month
  kitchen_id: '',
  employee_id: '',
  money: '',
  remark: ''
*/
/*
  wages_list -- 增加一条人员工资
*/
export const addEmployeeWage = (data) => {
  return axios.request({
    url: '/api/EmployeeWage/add',
    data,
    method: 'post'
  })
}

/*
  编辑一条人员工资
*/
/*
  id
  wage_month
  kitchen_id: '',
  employee_id: '',
  money: '',
  remark: ''
*/
/*
  wages_list -- 编辑一条人员工资
*/
export const editEmployeeWage = (data) => {
  return axios.request({
    url: '/api/EmployeeWage/edit',
    data,
    method: 'post'
  })
}

/*
  删除一条人员工资
*/
/*
  id
*/
/*
  wages_list -- 删除一条人员工资
*/
export const deleteEmployeeWage = (id) => {
  let data = { id: id }
  return axios.request({
    url: '/api/EmployeeWage/delete',
    data,
    method: 'post'
  })
}






// 作废接口
// ==================================================
// 确认工资
// export const solidEmployeeWageList = ( month  ) => {
//   let obj = { month : month }
//   return axios.request({
//     url: '/api/EmployeeWage/confirm',
//     obj,
//     method: 'post'
//   })
// }
// ==================================================







