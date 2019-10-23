<template>
  <div>
    <Card shadow>
      <Form>
        <Row :gutter="20">
          <i-col :md="6" :lg="6">
            <FormItem label="时间选择">
              <DatePicker type="daterange" @on-change="selectDate" placeholder="选择时间段" style="min-width: 200px"></DatePicker>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="招商经理" prop="manage_lease_id">
                 <Select
                  v-model="sreachInfo.manage_lease_id"
                  filterable
                  remote
                  :remote-method="remoteLeaseMethod"
                  :loading="remoteLoading"
                  clearable
                  style="width: 200px"
                  >
                  <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
                </Select>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="签约厨房">
              <Select v-model="sreachInfo.kitchen_id" clearable style="width: 200px">
                <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="20">
          <i-col :md="6" :lg="6">
            <FormItem label="档口面积">
              <Input v-model="sreachInfo.start_area" placeholder="开始" style="width: 95px;display: inline-block;"/>
              <Input v-model="sreachInfo.end_area" placeholder="结束" style="width: 95px;display: inline-block;margin-left: 10px;"/>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="客户来源">
              <Select v-model="sreachInfo.customer_source" clearable style="width: 200px">
                  <Option v-for="(item,index) in sources_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem>
              <Button type="primary" @click="sreachBaseInfo">确定</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Card v-show="base_info.length > 0" shadow style="margin-top: 10px;">
      <h2>数据条数: {{ base_info.length}}</h2>
    </Card>
    <Card shadow style="margin-top: 10px;min-height: 220px;">
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-bar style="height: 300px;" :value="bar_data" text="签约时间"></chart-bar>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.store_area" text="档口面积"></chart-pie>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.kitchen_name" text="签约厨房"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.manage_lease" text="招商经理"></chart-pie>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.customer_source" text="客户来源"></chart-pie>
          </Card>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
//权限
// Index/getEmployeeList,Index/getKitchenList,StoreLease/queryList
import Tables from '_c/tables'
import { getLeasingList , getKitchenList , getSignShopQueryList } from '@/api/data'
import { ChartPie , ChartBar } from '_c/charts'
// 权限
// 
export default {
  name: 'canvassStoreSignAnalysis',
  components: {
    Tables,
    ChartPie,
    ChartBar
  },
  data () {
    return {
      // 搜索条件
      sreachInfo:{
        manage_lease_id:'',
        kitchen_id:'',
        start_area:'',
        end_area:'',
        start_time:'',
        end_time:'',
        customer_source:'',
      },
      // 过滤数据
      filter_arr:[],
      // 基础数据
      base_info:[],
      // 厨房
      kitchenList:[],
      // 产品经理列表
      leasingList:[],
      remoteLoading:false,
      // 饼状图数据
      pie_data:{
        store_area:[],
        manage_lease:[],
        kitchen_name:[],
        customer_source:[],
      },
      bar_data:{},
      // 数据来源
      sources_list:["58渠道","微信群","电话渠道","转介绍-中介","转介绍-BD","转介绍-已签约客户","转介绍-非签约客户","已合作门店开分店","转介绍-招商同行","转介绍-品牌渠道","访客","官网","其他来源务必备注说明"],
    }
  },
  methods: {
    remoteLeaseMethod (query) {
        if (query !== '') {
          this.remoteLoading = true;
          getLeasingList({keyword:query}).then(res => {
            const dbody = res.data
            this.remoteLoading = false;
            if (dbody.code != 0) {
              this.$Notice.warning({
                title: dbody.msg
              })
              return
            }
            this.leasingList = dbody.data || [];
          }).catch(err =>{
            this.remoteLoading = false;
          })
        } else {
          this.leasingList = [];
        }
    },
    // 初始化数据
    initData( ){
      this.getKitchenList();
    },
    // 
    sreachBaseInfo(){
      if(!this.sreachInfo.start_time || !this.sreachInfo.end_time){
        this.$Notice.warning({
          title: "时间必须选取！"
        })
        return
      }
      let info = {
        manage_lease_id:this.sreachInfo.manage_lease_id,
        kitchen_id:this.sreachInfo.kitchen_id,
        start_area:this.sreachInfo.start_area,
        end_area:this.sreachInfo.end_area,
        start_time:this.sreachInfo.start_time,
        end_time:this.sreachInfo.end_time,
        customer_source:this.sreachInfo.customer_source,
      }
      this.pie_data = {
        store_area:[],
        manage_lease:[],
        kitchen_name:[],
        customer_source:[],
      }
      if(!!info.start_area && !!info.end_area){
        if( info.start_area <=0 ){
          this.$Notice.warning({
            title: "面积需大于0！"
          })
          return
        }
      }
      if( (!!info.start_area && !info.end_area) ||  (!info.start_area && !!info.end_area)){
        this.$Notice.warning({
          title: "面积信息不全！"
        })
        return
      }
      this.getData( info )
    },
    // 获取数据
    getData( info ){
      getSignShopQueryList( info ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        if(!dbody.data){
          this.$Notice.warning({
            title: "无数据符合条件！"
          })
          return
        }
        this.filter_arr = [];
        let arr = [];
        // 初始化函数
        for(let k in info){
          switch ( k ) {
            case 'manage_lease_id':
              if( !info[k] ){arr.push('manage_lease')}
              break;
            case 'kitchen_id':
              if( !info[k] ){arr.push('kitchen_name')}
              break;
            case 'end_area':
            // 固定整个面积属性
              arr.push('store_area')
            // console.log(!info[k])
            // console.log(info[k])
            //   if( !info[k] ){arr.push('area')}
              break;
            case 'customer_source':
            // 固定整个面积属性
              arr.push('customer_source')
              break;
          }
        };
        this.filter_arr = arr;
        this.base_info = dbody.data || [];
        this.getPieData( this.base_info );
        this.getBarData( this.base_info );
      })
    },
    // 获取饼图数据
    getPieData( data ){
      let that = this;
      this.filter_arr.forEach( function( ele ) {
        that.pie_data[ele] = [];
        let arr = []
        that.base_info.forEach( function( i ) {
          arr.push(i[ele])
        });
        const map = arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map())
        let r = [];
        map.forEach(function( v , n ) {
          let obj = { value : v , name : n };
          r.push(obj);
        })
        that.pie_data[ele] = r;
      });
    },
    // 获取柱状图
    getBarData( data ){
        let that = this;
        let arr = []
        that.base_info.forEach( function( i ) {
          arr.push(i.sign_date)
        });
        const map = arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map())
        let r = [];
        map.forEach(function( v , n ) {
          let obj = { value : v , name : n };
          r.push(obj);
        })
        r.sort(function(a,b){
            return Date.parse(a.name) - Date.parse(b.name);//时间正序
        });
        let res = {}
        r.forEach( function( item) {
          res[item.name] = item.value
        });
        this.bar_data  = res
    },
    // 选择时间
    selectDate(date){
      this.sreachInfo.start_time = date[0]
      this.sreachInfo.end_time = date[1]
    },

    // 获取厨房
    getKitchenList(){
      getKitchenList().then(res => {
        const dbody = res.data
        this.kitchenList = dbody.data || [];
      })
    },
  },
  computed: {
    isHasBaseInfo() {
      if(this.base_info.length > 0){
        return true
      }else{
        return false
      }
    }
  },
  created () {
    this.initData();
  },
}
</script>

<style>

</style>
