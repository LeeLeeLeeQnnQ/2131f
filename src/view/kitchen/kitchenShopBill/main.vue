<template>
  <div>
    <!-- 经营费用展示 -->
    <KSBInfoModal :info ="viewItem"   />
    <!-- 编辑房租 -->
    <KSBEditRentBill :info ="storeRentBill"  :initTable = "initData"/>
    <!-- 编辑经营费用 -->
    <KSBEditRunBill :info ="paymentItem"  :initTable = "initData"/>
    <!-- 头部搜索 按钮 -->
    <Card shadow style="margin-top: 5px">
      <h3 slot="extra" >
          公摊总天数：{{count_days}}
      </h3>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="20">
          <Select v-model="select_kitchen_id" style="width: 200px;margin-right:10px;" @on-change="selectKitchen">
            <Option v-for="item in kitchen" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
          </Select>
          <DatePicker type="month" :value="select_time" placeholder="选择月份" format="yyyy-MM" @on-change="selectDate" style="width: 200px"></DatePicker>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20" style="margin-top: 5px;">
        <i-col :xs="4" :md="4" :lg="4">
          <Input v-model="keyword" @on-change="changeKeyword" style="width: 200px" placeholder="请输入店铺名称/档口号"/>
        </i-col>
      </Row>
    </Card>
    <!-- 表格主题 -->
    <Card shadow>
      <tables
        :stripe="true"
        :columns="bill_columns"
        v-model="bill_list"
        @data-view="viewEnergyBill"
        @data-edit-rent="showEditStoreRentBill"
        @data-edit-run="showEditStoreRunBill"></tables>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import KSBInfoModal from './components/KSBInfoModal'
import KSBEditRentBill from './components/KSBEditRentBill'
import KSBEditRunBill from './components/KSBEditRunBill'
// 权限
// Kitchen/index,StoreBill/queryList,StoreCharge/queryList,StoreBill/edit,StoreCharge/add
import { getKitchenList } from '@/api/data'
import { getStoreBillList, getStoreChargeItem, editStoreBillItem, addStoreCharge } from '@/api/kitchen'
export default {
  name: 'kitchenShopBill',
  components: {
    Tables,
    KSBInfoModal,
    KSBEditRentBill,
    KSBEditRunBill
  },
  data () {
    return {
      // 基本数据
      showInfo: {},
      // 查看能源账单
      viewItem: {},
      // 编辑商户账单
      storeRentBill: {},
      // 编辑经营费用
      paymentItem: {},
      // 厨房下拉
      kitchen: [],
      // 选中厨房信息
      select_kitchen: [],
      // 搜索
      select_time: '',
      select_kitchen_id: '',
      keyword: '',
      // 表格
      bill_columns: [
        {title: '厨房', key: 'kitchen_name'},
        {title: '月份', key: 'month'},
        {title: '商户', key: 'store_name'},
        {title: '档口号', key: 'store_no'},
        {title: '公摊天数', key: 'day_number'},
        { title: '经营费用',
          render: (h, params) => {
            let operate_fee = params.row.operate_fee
            let operate_overdue_fee = params.row.operate_overdue_fee
            let operate_exempt_fee = params.row.operate_exempt_fee
            let fee = (operate_fee * 1 + operate_overdue_fee * 1 - operate_exempt_fee * 1).toFixed(2)
            return h('span', fee)
          }
        },
        { title: '房租',
          render: (h, params) => {
            let rent_fee = params.row.rent_fee
            let rent_overdue_fee = params.row.rent_overdue_fee
            let rent_exempt_fee = params.row.rent_exempt_fee
            let fee = (rent_fee * 1 + rent_overdue_fee * 1 - rent_exempt_fee * 1).toFixed(2)
            return h('span', fee)
          }
        },
        {title: '往期未缴',
          render: (h, params) => {
            let is_new = params.row.new * 1
            let store_account = ''
            if (is_new == 1) {
              store_account = params.row.store_account
            } else {
              store_account = '----'
            }
            return h('span', store_account)
          }
        },
        { title: '总未缴款',
          render: (h, params) => {
            let is_deposit = params.row.is_deposit
            let unpaid_fee = params.row.unpaid_fee
            if (is_deposit * 1 == 1) {
              return h('span', { style: {color: '#67ba23'}}, '押金已抵扣')
            }
            if (unpaid_fee * 1 > 1000) {
              return h('span', { style: {color: '#ff9900'}}, unpaid_fee)
            } else if (unpaid_fee * 1 > 0) {
              return h('span', { style: {color: '#2d8cf0'}}, unpaid_fee)
            } else {
              return h('span', { style: {color: '#19be6b'}}, unpaid_fee)
            }
          }
        },
        {
          title: '查看',
          key: 'handle',
          button: [
            (h, params, vm) => {
              let is_deposit = params.row.is_deposit
              if (is_deposit * 1 == 1) {
                return
              }
              return h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-view', params)
                  }
                }},
              '经营费用')
            }
          ]
        },
        {
          title: '编辑',
          key: 'handle',
          width: 90,
          button: [
            (h, params, vm) => {
              let is_deposit = params.row.is_deposit
              if (is_deposit * 1 == 1) {
                return
              }
              return h('Poptip', {
                style: {
                  margin: '5px 0 '
                },
                props: {
                  confirm: true,
                  title: '编辑经营费用！'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-edit-run', params)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {marginLeft: '0px'}
                }, '经营费用')
              ])
            },
            (h, params, vm) => {
              let is_deposit = params.row.is_deposit
              if (is_deposit * 1 == 1) {
                return
              }
              return h('Poptip', {
                style: {
                  margin: '5px 0 '
                },
                props: {
                  confirm: true,
                  title: '编辑租金！'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-edit-rent', params)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {marginLeft: '0px'}
                }, '租金')
              ])
            }
          ]
        }
      ],
      bill_list: [],
      // 总公摊天出
      count_days: 0
    }
  },
  methods: {
    // 通用
    getPayItemTotal (info) {
      let total = 0
      total = info.garbage_fee * 1 + total
      total = info.water_fee * 1 + total
      total = info.energy_fee * 1 + total
      total = info.water_share_fee * 1 + total
      total = info.energy_share_fee * 1 + total
      total = info.flue_fee * 1 + total
      total = info.kill_fee * 1 + total
      total = info.network_fee * 1 + total
      total = info.storage_fee * 1 + total
      total = info.health_fee * 1 + total
      total = info.fine_fee * 1 + total
      total = info.one_fee * 1 + total
      total = info.other_fee * 1 + total
      total = info.operating_fee * 1 + total
      total = info.project_fee * 1 + total
      total = info.taxes_fee * 1 + total
      total = info.operate_overdue_fee * 1 + total
      total = total - info.operate_exempt_fee * 1
      return total.toFixed(2)
    },
    // 查看能源账单
    viewEnergyBill (params) {
      let viewItem = {}
      viewItem = Object.assign({}, params.row)
      viewItem.water_value = viewItem.water_start - viewItem.water_end
      viewItem.energy_value = viewItem.water_value - viewItem.energy_end
      viewItem.total = this.getPayItemTotal(viewItem)
      this.viewItem = viewItem
    },
    // 显示弹窗
    showEditStoreRentBill (params) {
      let storeRentBill = {}
      storeRentBill.id = params.row.id
      storeRentBill.rent_fee = params.row.rent_fee
      storeRentBill.rent_overdue_fee = params.row.rent_overdue_fee
      storeRentBill.rent_exempt_fee = params.row.rent_exempt_fee
      storeRentBill.month = params.row.month
      storeRentBill.store_name = params.row.store_name
      storeRentBill.sreach = { month: this.select_time, kitchen_id: this.select_kitchen_id, keyword: this.keyword }
      this.storeRentBill = storeRentBill
    },
    // 显示弹窗
    showEditStoreRunBill (params) {
      let paymentItem = Object.assign({}, params.row)
      paymentItem.total = this.getPayItemTotal(paymentItem)
      paymentItem.showInfo = this.showInfo
      paymentItem.sreach = { month: this.select_time, kitchen_id: this.select_kitchen_id, keyword: this.keyword }
      this.paymentItem = paymentItem
    },
    // 搜索
    // 选择厨房
    selectKitchen () {
      let select_kitchen = this.kitchen.filter((item, index, arr) => {
        if (item.id == this.select_kitchen_id) {
          return item
        }
      })
      this.select_kitchen = select_kitchen[0]
      this.initData({ month: this.select_time, kitchen_id: this.select_kitchen_id, keyword: this.keyword})
    },
    // 选择时间
    selectDate (date) {
      this.select_time = date
      this.initData({ month: this.select_time, kitchen_id: this.select_kitchen_id, keyword: this.keyword })
    },
    changeKeyword () {
      this.initData({ month: this.select_time, kitchen_id: this.select_kitchen_id, keyword: this.keyword })
    },
    // 获取账单列表
    getStoreBillList (data) {
      getStoreBillList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.bill_list = dbody.data.list || []
        this.count_days = dbody.data.days || 0
      })
    },
    // 初始化基础
    initBaseData (info) {
      this.showInfo = {}
      // 垃圾及隔油池
      this.showInfo.garbage_fee = info.garbage_fee
      // 烟道清洗
      this.showInfo.flue_fee = info.flue_fee
      // 消杀
      this.showInfo.kill_fee = info.kill_fee
      // 网络使用费
      this.showInfo.network_fee = info.network_fee
      // 水费基数
      this.showInfo.water_fee = info.water_fee
      // 电费基数
      this.showInfo.energy_fee = info.energy_fee
      // 库房费
      this.showInfo.storage_fee = info.storage_fee
      // 卫生费
      this.showInfo.health_fee = info.health_fee
      // 活跃档口数量
      this.showInfo.store_count = info.store_count
    },
    // 初始化
    initData (info) {
      // 基本属性
      this.initBaseData(this.select_kitchen)
      // 获取账单列表
      this.getStoreBillList(info)
    }
  },
  created () {
    // 获取当前时间
    let mYear = new Date().getFullYear()
    let mMonth = (new Date().getMonth() + 1) + ''
    mMonth = mMonth < 10 ? '0' + mMonth : mMonth
    this.select_time = mYear + '-' + mMonth
    // 获取厨房列表
    getKitchenList().then(res => {
      const dbody = res.data
      this.kitchen = dbody.data || []
      this.select_kitchen = this.kitchen[this.kitchen.length * 1 - 1]
      this.select_kitchen_id = this.select_kitchen.id
      this.initData({ month: this.select_time, kitchen_id: this.select_kitchen_id })
    })
  },
  computed: {
  }
}
</script>

<style lang="less">
  .cellTit{
    margin-bottom: 12px;
    span{
      color:#fff;
      background-color:#3399ff;
      border-radius:5px;
      padding:5px 8px;
      margin-right: 10px;
    }
  }

</style>
