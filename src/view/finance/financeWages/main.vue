<template>
  <div>
    <Card>
      <Select v-model="select_kitchen_id" style="width: 200px;margin-right:10px;" @on-change="selectKitchen">
        <Option v-for="item in kitchen" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
      </Select>
      <DatePicker :value="select_time" type="month" placeholder="选择月份" format="yyyy-MM" @on-change="selectMonth" style="width: 200px"></DatePicker>
    </Card>
    <Card style="margin-top:8px;padding-top: 2em;">
      <a href="#" slot="extra" @click.prevent="showAddModal=true">
          增加工资条
      </a>
      <tables ref="tables" v-model="wages_list" :columns="columns" @data-dele="handleDataDele" @data-edit="handleDataEdit"/>
      <Page :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
    </Card>
    <Modal v-model="showAddModal" title="增加工资条" @on-ok="saveAddModal">
        <Form :model="modalAddItem" :label-width="80">
          <FormItem label="所属厨房">
            <Select v-model="modalAddItem.kitchen_id" style="width: 80%">
              <Option v-for="item in kitchen" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="姓名">
            <Select v-model="modalAddItem.employee_id" style="width: 80%">
              <Option v-for="item in employee_list" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
            </Select>
          </FormItem>
          <FormItem label="工资数">
            <Input v-model="modalAddItem.money" placeholder="输入名称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="备注">
              <Input v-model="modalAddItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注" style="width: 300px"></Input>
          </FormItem>
        </Form>
    </Modal>
    <Modal v-model="showEditModal" title="编辑人员" @on-ok="saveEditModalInfo">
        <Form :model="modalEditItem" :label-width="80">
          <FormItem label="所属厨房">
            <Select v-model="modalEditItem.kitchen_id" style="width: 80%">
              <Option v-for="item in kitchen" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="姓名">
            <Select v-model="modalEditItem.employee_id" style="width: 80%">
              <Option v-for="item in employee_list" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
            </Select>
          </FormItem>
          <FormItem label="工资数">
            <Input v-model="modalEditItem.money" placeholder="输入名称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="备注">
              <Input v-model="modalEditItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注" style="width: 300px"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
//权限
// /api/Index/getKitchenList,/api/Index/getEmployeeList,/api/EmployeeWage/index,/api/EmployeeWage/add,/api/EmployeeWage/edit,/api/EmployeeWage/delete
import { getKitchenList, getKitchenEmployeeList } from '@/api/data'
import { getEmployeeWageList, addEmployeeWage, editEmployeeWage, deleteEmployeeWage} from '@/api/staff'
export default {
  name: 'financeWages',
  components: {
    Tables
  },
  data () {
    return {
      select_kitchen_id:'',
      // 列表数据
      wages_list: [],
      // 也属 数据
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 表头
      columns: [
        {title: '姓名', key: 'fullname', width: 120},
        { title: '性别',
          render: (h, params) => {
            let status = params.row.gender
            if (status == 1) { return h('span', '男') };
            if (status == 2) { return h('span', '女') };
          },
          width: 80
        },
        {title: '所属厨房', key: 'kitchen_name'},
        {title: '权限组', key: 'group_name'},
        {title: '工资', key: 'money'},
        {title: '备注', key: 'remark'},
        {
          title: '操作',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-edit', params)
                  }
                }},
              '编辑')
            },
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-dele', params)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {marginLeft: '8px'}
                }, '删除')
              ])
            }
          ]
        }
      ],
      // 显示增加姓名弹窗
      showAddModal: false,
      // 获取默认厨房
      kitchen: [],
      // 员工EmployeeList
      employee_list: [],
      // modalAddItem增加员工工资
      modalAddItem: {
        kitchen_id: '',
        employee_id: '',
        money: '',
        remark: ''
      },
      // 当前月
      mYear: '',
      mMonth: '',
      // 编辑弹窗
      showEditModal: false,
      modalEditItem: {
        id: '',
        kitchen_id: '',
        employee_id: '',
        money: '',
        remark: ''
      }
    }
  },
  methods: {
    // 编辑
    handleDataEdit (params) {
      let data = params.row
      this.modalEditItem.id = data.id
      this.modalEditItem.kitchen_id = data.kitchen_id * 1
      this.modalEditItem.employee_id = data.employee_id
      this.modalEditItem.money = data.money
      this.modalEditItem.remark = data.remark
      this.showEditModal = true
    },
    // saveEditModalInfo
    saveEditModalInfo () {
      let obj = {
        kitchen_id: '',
        employee_id: '',
        money: '',
        remark: ''
      }
      if (this.formModalInfo(this.modalEditItem)) {
        this.modalEditItem.wage_month = this.select_time
        editEmployeeWage(this.modalEditItem).then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.modalEditItem = obj
          this.initData ( { kitchen_id:this.select_kitchen_id , month : this.select_time } )
        })
      }
    },
    removeById (arr, id) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          arr.splice(i, 1)
        }
      }
      return arr
    },
    // 删除
    handleDataDele (params) {
      let id = params.row.id
      deleteEmployeeWage(id).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: '删除成功！'
        })
        this.initData ( { kitchen_id:this.select_kitchen_id , month : this.select_time } )
      })
    },
    // 验证表格信息
    formModalInfo: function (obj) {
      if (!obj.kitchen_id) {
        this.$Notice.warning({
          title: '请选择厨房！'
        })
        return false
      }
      if (!obj.employee_id) {
        this.$Notice.warning({
          title: '请选择员工！'
        })
        return false
      }
      let priceReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!obj.money || obj.money * 1 <= 0 || !priceReg.test(obj.money)) {
        this.$Notice.warning({
          title: '请输入正确金额！'
        })
        return false
      };
      return true
    },
    // saveAddModal
    saveAddModal () {
      let obj = {
        kitchen_id: '',
        employee_id: '',
        money: '',
        remark: ''
      }
      if (this.formModalInfo(this.modalAddItem)) {
        this.modalAddItem.wage_month = this.select_time
        addEmployeeWage(this.modalAddItem).then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.modalAddItem = obj
          this.initData ( { kitchen_id:this.select_kitchen_id , month : this.select_time } )
        })
      }
    },
    // getNewPage
    getNewPage (page) {
      this.initData ( { kitchen_id:this.select_kitchen_id , month : this.select_time , page : page} )
    },
    // selectKitchen 选择厨房
    selectKitchen(  ) {
      this.initData ( { kitchen_id:this.select_kitchen_id , month : this.select_time } )
    },
    // 变化月份
    selectMonth ( date ) {
      this.select_time = date;
      this.initData ( { kitchen_id:this.select_kitchen_id , month : date } )
    },
    // 获取厨房人员列表
    getdeFaultEmployeeList (kitchen_id) {
      getKitchenEmployeeList( ).then(res => {
        const dbody = res.data || []
        let arr = dbody.data || []
        this.employee_list = arr;
      })
    },
    // 获取搜索条件
    initData ( data ) {
      getEmployeeWageList( data ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.wages_list = dbody.data.list || []
        this.page = dbody.data.page
      })
    }
  },
  created () {
    let mYear = new Date().getFullYear();
    let mMonth = (new Date().getMonth() + 1) + '';
    mMonth = mMonth > 10 ? mMonth : '0'+ mMonth ;
    this.select_time = mYear + '-' + mMonth ;
    // 获取默认厨房
    getKitchenList().then(res => {
      const dbody = res.data
      this.kitchen = dbody.data
      this.select_kitchen_id = this.kitchen[0].id;
      this.initData( { kitchen_id:this.select_kitchen_id , month : this.select_time } );
      this.getdeFaultEmployeeList( );
    })
  },
  computed: {
    
  }
}
</script>

<style>

</style>
