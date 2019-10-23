import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getMemberList, getWages, getRentInList, getRentOutList, getTableData, getDragList, uploadImg, getFinanceWorkList } from './data'
import { getMessageInit, getContentByMsgId, hasRead, removeReaded, restoreTrash, messageCount } from './user'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

// 登录相关和获取用户信息
Mock.mock(/\/login/, login)
Mock.mock(/\/get_info/, getUserInfo)
Mock.mock(/\/logout/, logout)
// 权限接口
Mock.mock(/\/get_member_list/, getMemberList)
// 财务接口
Mock.mock(/\/get_wages/, getWages)
Mock.mock(/\/get_rent_in_list/, getRentInList)
Mock.mock(/\/get_rent_out_list/, getRentOutList)

Mock.mock(/\/get_finance_work_list/, getFinanceWorkList)
Mock.mock(/\/get_table_data/, getTableData)
Mock.mock(/\/get_drag_list/, getDragList)
Mock.mock(/\/save_error_logger/, 'success')
Mock.mock(/\/image\/upload/, uploadImg)
Mock.mock(/\/message\/init/, getMessageInit)
Mock.mock(/\/message\/content/, getContentByMsgId)
Mock.mock(/\/message\/has_read/, hasRead)
Mock.mock(/\/message\/remove_readed/, removeReaded)
Mock.mock(/\/message\/restore/, restoreTrash)
Mock.mock(/\/message\/count/, messageCount)

export default Mock
