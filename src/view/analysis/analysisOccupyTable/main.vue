<template>
  <div>
    <SreachBox :option="sreach_option" :getSreachInfo="sreachSubmit"></SreachBox>
    <Tabs style="margin-top: 12px;" type="card">
        <TabPane v-for="item in kitchen_s_data" :label="item.kitchen_name">
          <Card shadow style="margin-top: 8px;">
            <tables
              v-model="item.list"
              :columns="kitchen_data_columns"/>
          </Card>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
//权限
// Kitchen/index,KitchenReside/queryList
import Tables from '_c/tables'
import  SreachBox  from '_c/sreach-box'
import { getKitchenQueryList  } from '@/api/setting'
import { getKitchenResideQueryList  } from '@/api/data'
export default {
  name: 'analysisOccupyTable',
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
        picker_month:true,
        month_multiple:true,
      },
      // 搜索条件
      sreach:{
        kitchen_id:'',
        month:'',
      },
      // 数据
      kitchen_s_data:[],
      kitchen_data_columns:[
        {title: '档口号', key: 'store_no'},
        {title: '占用天数', key: 'days'},
        {title: '自然天数', key: 'days_total'},
        {
          title: '占用率',
          key: 'occupy',
          render: (h, params) => {
            let days = params.row.days*1;
            let days_total = params.row.days_total*1;
            let occupy = (Math.round(days*1/days_total*1 * 10000)/100).toFixed(2) + '%'
            return h('span', { style: {color: '#ff9900'}} , occupy)
          }
        },
      ],
    }
  },
  methods: {

    // 初始化数据
    initData( data ){
      this.kitchen_s_data = [];
      let sreach = this.sreach;
      let obj = Object.assign({},data,sreach)
      obj.kitchen_id = obj.kitchen_id.join(',')
      this.getKitchenResideQueryList(obj)
    },
    // 搜索
    sreachSubmit(sreachInfo){
      this.sreach = sreachInfo;
      this.initData({})
    },
    getKitchenResideQueryList(info){
      getKitchenResideQueryList(info).then(res => {
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
        total.days = 0;
        total.days_total = 0;
        obj[key].list.forEach((i_t)=>{
          total.days = i_t.days*1 + total.days*1
          total.days_total = i_t.days_total*1 + total.days_total*1
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
          title: '部分厨房无入住数据！'
        })
      }
      this.kitchen_s_data = arr;
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
