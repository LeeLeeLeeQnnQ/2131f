<template>
  <div>
    <SreachBox :option="sreach_option" :getSreachInfo="sreachSubmit"></SreachBox>
    <Card shadow style="margin-top: 8px;" v-show="isTotal">
      <Row :gutter="20" style="margin-top: 15px;"  >
        <h3 style="margin:8px 0;text-align: center;">总数据</h3>
        <i-col :md="12" :lg="12" style="margin-bottom: 20px;">
          <Card>
            <chart-pie v-if="!!total_data.occupy" style="height: 300px;" :value="total_data.occupy" text="入住率"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="12" :lg="12" style="margin-bottom: 20px;">
          <Card>
            <chart-pie  v-if="!!total_data.store_status" style="height: 300px;" :value="total_data.store_status" text="档口状态"></chart-pie>
          </Card>
        </i-col>
      </Row>
    </Card>
    <Card shadow style="margin-top: 8px;" v-for="item in pie_data_list">
      <Row :gutter="20" style="margin-top: 15px;"  >
        <h3 style="margin:8px 0;text-align: center;">{{item.kitchen_name}}</h3>
        <i-col :md="12" :lg="12" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="item.occupy" text="入住率"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="12" :lg="12" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="item.store_status" text="档口状态"></chart-pie>
          </Card>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
//权限
// Kitchen/index,KitchenStore/querylist
import { getKitchenStoreQueryList } from '@/api/setting'
import  SreachBox  from '_c/sreach-box'
import { ChartPie  } from '_c/charts'
export default {
  name: 'analysisOccupyPie',
  components: {
    ChartPie,
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
        kitchen_id:'',
      },
      pie_data_list:[],
      total_data:{},
      isTotal:false,
    }
  },
  methods: {
    // 初始化数据
    initData( info ){
      this.isTotal = false;
      this.pie_data_list = [];
      getKitchenStoreQueryList( info ).then(res => {
        const dbody = res.data;
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        let rdata = dbody.data || [];
        this.getKitchenData(rdata)
      })
    },
    // 
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
        arr.push(obj[key])
      }
      if(arr.length  == 0){
        this.$Notice.warning({
          title: '无匹配数据！'
        })
        return
      }
      if(arr.length  > 1){
        let t_obj = {}; 
        t_obj.occupy = this.setOccupyInfo(data)
        t_obj.store_status = this.setStatusInfo(data)
        this.total_data = t_obj;
        this.isTotal = true;
      }
      if(arr.length  != this.sreach.kitchen_id.length){
        this.$Notice.warning({
          title: '部分厨房无支出数据！'
        })
      }
      let n_obj = [];
      arr.forEach((a_item)=>{
        let obj = {}; 
        obj.kitchen_id = a_item.kitchen_id;
        obj.kitchen_name = a_item.kitchen_name;
        obj.occupy = this.setOccupyInfo(a_item.list)
        obj.store_status = this.setStatusInfo(a_item.list)
        n_obj.push(obj);
      })
      this.pie_data_list = n_obj;
    },
    // 获取入住率
    setOccupyInfo( data ){
      let info = data || [];
      let pie = [];
      let count = {};
      info.forEach((ele,index) => {
          if(ele.store_status*1 == 1 || ele.store_status*1 == 2 || ele.store_status*1 == 3){
            count.aaa = !!count.aaa ? (count.aaa + 1) : 1;
          }else if (ele.store_status*1 == 4) {
            count.bbb = !!count.bbb ? (count.bbb + 1) : 1;
          }
      });
      for(let k in count){
        if(k == 'aaa'){
          pie.push({name:'占用', value : count[k]})
        }else if (k = 'bbb') {
          pie.push({name:'空闲', value : count[k]})
        }
      }
      return pie;
    },
    // 获取厨房状态数据
    setStatusInfo( data ){
      let info = data || [];
      let pie = [];
      let count = {};
      info.forEach((ele,index) => {
          if(ele.store_status*1 == 1){
            count.aaa = !!count.aaa ? (count.aaa + 1) : 1;
          }else if (ele.store_status*1 == 2) {
            count.bbb = !!count.bbb ? (count.bbb + 1) : 1;
          }else if (ele.store_status*1 == 3) {
            count.ccc = !!count.ccc ? (count.ccc + 1) : 1;
          }else if (ele.store_status*1 == 4) {
            count.ddd = !!count.ddd ? (count.ddd + 1) : 1;
          }
      });
      for(let k in count){
        if(k == 'aaa'){
          pie.push({name:'租赁中', value : count[k]})
        }else if (k == 'bbb') {
          pie.push({name:'转租中', value : count[k]})
        }else if (k == 'ccc') {
          pie.push({name:'起租中', value : count[k]})
        }else if (k == 'ddd') {
          pie.push({name:'空闲中', value : count[k]})
        }
      }
      return pie;
    },
    init( data ){
      let sreach = this.sreach;
      let obj = Object.assign({},data,sreach)
      obj.kitchen_id = obj.kitchen_id.join(',')
      this.initData(obj);
    },
    // 搜索
    sreachSubmit(sreachInfo){
      this.sreach = sreachInfo;
      this.init({});
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
