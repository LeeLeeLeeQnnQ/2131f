<template>
  <div>
    <SreachBox :option="sreach_option" :getSreachInfo="sreachSubmit"></SreachBox>
    <Card shadow style="margin-top: 8px;">
      <tables ref="tables" v-model="memberTableData" :columns="memberColumns" />
    </Card>
  </div>
</template>

<script>
//权限
// Kitchen/index,Kitchen/getStoreDevice
import  SreachBox  from '_c/sreach-box'
import { getKitchenQueryList } from '@/api/setting'
import { getKitchenStoreEmployeeList  } from '@/api/data'
import Tables from '_c/tables'
export default {
  name: 'analysisKitchenMember',
  components: {
    Tables,
    SreachBox
  },
  data () {
    return {
      // 搜索设置
      sreach_option:{
        picker_kitchen:true,
        kitchen_multiple:true,
      },
      // 搜索条件
      sreach:{
        kitchen_id:[],
      },
      //设备表格头部
      memberColumns:[
        {
          title: '厨房名称',
          key: 'kitchen_name'
        },
        {
          title: '档口数量',
          key: 'store_total',
        },
        {
          title: '店铺人员数量',
          key: 'employee_total'
        },
      ],
      //设备数据
      memberTableData:[],
      // 基础数据
      baseInfo:{
        store_no_num:'0',
        member:'0',
      },
      page: {
        curmoney_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
    }
  },
  methods: {
    initData(data){
      this.memberTableData = [];
      let sreach = this.sreach;
      let obj = Object.assign({},data,sreach)
      obj.kitchen_id = obj.kitchen_id.join(',')
      this.getKitchenStoreEmployeeList(obj)
    },
    getKitchenStoreEmployeeList(info){
      getKitchenStoreEmployeeList(info).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 初始化函数
        let t_data = dbody.data || []
        this.memberTableData = t_data;
      })
    },
    // 搜索
    sreachSubmit(sreachInfo){
      this.sreach = sreachInfo
      this.initData({})
    },
  },
  computed: {
    
  },
  created () {
  
  },
}
</script>

<style>

</style>
