<template>
  <div>
    <SreachBox :option="sreach_option" :getSreachInfo="sreachSubmit"></SreachBox>
    <Modal title="设备清单" v-model="showStoreEquipmentTable">
      <Table ref="tables" :data="storeEquipmentTableData" :columns="storeEquipmentColumns"/>
        <div slot="footer" class="tableFooter">
          <h3>
              <span>电器设备功率合计：  {{tableKWTotal}}</span>
              <span style="margin-left: 1em;">燃气设备气量合计：  {{tableGASTotal}}</span>
            </h3>
        </div>
      </Table>
    </Modal>
    <Tabs style="margin-top: 12px;" type="card">
        <TabPane v-for="item in equipmentTableData" :label="item.kitchen_name">
          <Card shadow style="margin-top: 8px;">
            <tables
              v-model="item.list"
              @view-equipment="initEquipmentinfo"
              :columns="equipmentColumns"/>
          </Card>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
//权限
// Kitchen/index,Kitchen/getStoreEmployee
import  SreachBox  from '_c/sreach-box'
import { getKitchenQueryList } from '@/api/setting'
import { getKitchenStoreDeviceList  } from '@/api/data'
import { showStoreDevice } from '@/api/kitchen'
import Tables from '_c/tables'
export default {
  name: 'analysisKitchenEquipment',
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
      equipmentColumns:[
        {
          title: '档口名称',
          key: 'store_no'
        },
        {
          title: '商户名称',
          key: 'store_name'
        },
        {
          title: '店铺设备总数量',
          key: 'handle',
          button: [
            (h, params, vm) => {
              let device_total = params.row.device_total
              return h('a', {
                style:{
                  margin:"0"
                },
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('view-equipment', params)
                  }
                }},
              device_total)
            }, 
          ]
        },
        {
          title: '电压V',
          key: 'voltage'
        },
        {
          title: '功率KW',
          key: 'kw'
        },
        {
          title: '燃气量 m³',
          key: 'gas'
        },
      ],
      //设备数据
      equipmentTableData:[],
      // 
      showStoreEquipmentTable:false,
      storeEquipmentTableData:[],
      storeEquipmentColumns:[
        {
          title: '设备名称',
          key: 'title'
        },
        {
          title: '设备数量',
          key: 'quantity',
        },
        {
          title: '电压V/每个设备',
          key: 'voltage'
        },
        {
          title: '功率KW/每个设备',
          key: 'kw'
        },
        {
          title: '燃气量 m³',
          key: 'gas'
        },
        {
          title: '备注',
          key: 'remark'
        },
      ],
    }
  },
  methods: {
    // 初始化数据
    initData( data ){
      this.equipmentTableData = [];
      let sreach = this.sreach;
      let obj = Object.assign({},data,sreach)
      obj.kitchen_id = obj.kitchen_id.join(',')
      this.getKitchenStoreDeviceList(obj)
    },
    getKitchenStoreDeviceList(info){
      getKitchenStoreDeviceList(info).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 初始化函数
        let t_data = dbody.data || []
        this.getKitchenData(t_data);
      })
    },
    // 设备清单
    initEquipmentinfo( params ){
      this.showStoreEquipmentTable = false;
      this.storeEquipmentTableData = [];
      let store_id = params.row.store_id;
      if(!store_id){
        return
      }
      showStoreDevice( store_id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: "设备清单获取失败！"
          })
          return
        }
        let data = dbody.data || [];
        this.storeEquipmentTableData = data.device;
        this.showStoreEquipmentTable = true;
      })
    },
    getKitchenData(data){
      let obj = {};
      let key_list = [];
      data.forEach((item,index)=>{
        if(key_list.includes(item.kitchen_id)){
          obj[item.kitchen_id].list.push(item)
        }else{
          key_list.push(item.kitchen_id);
          obj[item.kitchen_id] = {};
          obj[item.kitchen_id].kitchen_name = item.kitchen_name;
          obj[item.kitchen_id].kitchen_id = item.kitchen_id;
          obj[item.kitchen_id].list = [];
          obj[item.kitchen_id].list.push(item)
        }
      })
      let arr = [];
      for (let key in obj) {
        let total = {};
        total.store_no = "厨房总计";
        total.device_total = 0;
        total.voltage = 0;
        total.kw = 0;
        total.gas = 0;
        obj[key].list.forEach((i_t)=>{
          total.device_total = i_t.device_total*1 + total.device_total*1
          total.voltage = (i_t.voltage*1 + total.voltage*1).toFixed(2)
          total.kw = (i_t.kw*1 + total.kw*1).toFixed(2)
          total.gas = (i_t.gas*1 + total.gas*1).toFixed(2)
        })
        obj[key].list.push(total)
        arr.push(obj[key])
      }
      if(arr.length  == 0){
        this.$Notice.warning({
          title: '无匹配数据！'
        })
        return
      }
      if(arr.length  != this.sreach.kitchen_id.length){
        this.$Notice.warning({
          title: '部分厨房无设备数据！'
        })
      }
      this.equipmentTableData = arr;
    },
    // 搜索
    sreachSubmit(sreachInfo){
      this.sreach = sreachInfo
      this.initData({})
    },
  },
  computed: {
    tableKWTotal:function() {
      if (this.storeEquipmentTableData.length <= 0) {
        return '0.00'
      }
      let kw = 0
      this.storeEquipmentTableData.forEach(function (i, j) {
        if(!!i.kw && i.kw*1 > 0){kw += i.kw*1*i.quantity*1 }
      })
      return (kw*1).toFixed(2);
    },
    tableGASTotal:function() {
      if (this.storeEquipmentTableData.length <= 0) {
        return '0.00'
      }
      let gas = 0
      this.storeEquipmentTableData.forEach(function (i, j) {
        if(!!i.gas && i.gas*1 > 0){gas += i.gas*1*i.quantity*1 }
      })
      return (gas*1).toFixed(2);
    }
  },
  created () {
      
  },
}
</script>

<style>

</style>
