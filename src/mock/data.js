import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
const Random = Mock.Random

// 权限页面
export const getMemberList = req => {
  let data = []
  doCustomTimes(6, () => {
    data.push(Mock.mock({
      sid: '@increment(1)',
      name: '@name',
      sex: '@string("男女", 1)',
      kitchen: '@city',
      type: '@county',
      phone: '@string("number", 11, 11)',
      permission: '@string("012345", 1)',
      marker: ''
    }))
  })
  return data
}
// 财务工资列表
export const getWages = req => {
  let data = []
  doCustomTimes(6, () => {
    data.push(Mock.mock({
      sid: '@increment(1)',
      name: '@name',
      sex: '@string("男女", 1)',
      wage: '@string("number", 4, 4)',
      job: '@city',
      phone: '@string("number", 11, 11)',
      marker: ''
    }))
  })
  return data
}
// 财务起租列表
export const getRentInList = req => {
  let data = []
  doCustomTimes(6, () => {
    data.push(Mock.mock({
      sid: '@increment(1)',
      kitchen: '四道口',
      num: '@string("number", 2)',
      store: '@city',
      supname: '@name',
      leasing: '@name',
      manager: '@name',
      marker: ''
    }))
  })
  return data
}

// 财务退租列表
export const getRentOutList = req => {
  let data = []
  doCustomTimes(6, () => {
    data.push(Mock.mock({
      sid: '@increment(1)',
      kitchen: '四道口',
      num: '@string("number", 2)',
      store: '@city',
      supname: '@name',
      leasing: '@name',
      manager: '@name',
      marker: ''
    }))
  })
  return data
}

export const getTableData = req => {
  let tableData = []
  doCustomTimes(6, () => {
    tableData.push(Mock.mock({
      id: '@increment(1)',
      name: '@name',
      phone: '@string("number", 11, 11)',
      sex: '@boolean',
      type: '@string("number", 1, 3)',
      wage: '@string("number", 4, 4)',
      stand: '@string("number", 2, 4)',
      marker: '@string(50)',
      endTime: '@date'
    }))
  })
  return tableData
}

export const getFinanceWorkList = req => {
  let financeWorkList = []
  doCustomTimes(6, () => {
    financeWorkList.push(Mock.mock({
      sid: '@increment(1)',
      name: '@name',
      type: '@city()',
      kitchen: '@name',
      store: '@string()',
      supname: '@name',
      status: '@boolean',
      phone: '@string("number", 11, 11)',
      marker: '@string(50)'
    }))
  })
  return financeWorkList
}

export const getDragList = req => {
  let dragList = []
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }))
  })
  return dragList
}

export const uploadImg = req => {
  let uploadImg = {
    name: Random.csentence(10, 13),
    url: Random.image(),
    status: 'finished'
  }
  return uploadImg
}
