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
                  v-model="sreachInfo.employee_id"
                  filterable
                  remote
                  clearable
                  :remote-method="remoteLeaseMethod"
                  :loading="remoteLoading"
                  style="width: 200px"
                  >
                  <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
                </Select>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="带看场地">
              <Select v-model="sreachInfo.kitchen_id" clearable style="width: 200px">
                <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="未成交因素">
              <Select v-model="sreachInfo.consider" style="width: 200px">
                <Option v-for="(item,index) in considers_list" :value="item" :key="index">{{ item }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="20">
          <i-col :md="6" :lg="6">
            <FormItem label="意向面积">
              <Input v-model="sreachInfo.start_area" placeholder="开始" style="width: 95px;display: inline-block;"/>
              <Input v-model="sreachInfo.end_area" placeholder="结束" style="width: 95px;display: inline-block;margin-left: 10px;"/>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="意向品类">
              <Select v-model="sreachInfo.category" clearable style="width: 200px">
                  <Option v-for="(item,index) in category_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="意向程度">
              <Select v-model="sreachInfo.level" clearable style="width: 200px">
                  <Option v-for="(item,index) in head_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="带看次数">
              <Input v-model="sreachInfo.start_count" placeholder="开始" style="width: 95px;display: inline-block;"/>
              <Input v-model="sreachInfo.end_count" placeholder="结束" style="width: 95px;display: inline-block;margin-left: 10px;"/>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="20">
          <i-col :md="6" :lg="6">
            <FormItem label="客户来源">
              <Select v-model="sreachInfo.source" clearable style="width: 200px">
                  <Option v-for="(item,index) in sources_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="6">
            <FormItem label="所属团队">
              <Select v-model="sreachInfo.group_name" clearable style="width: 200px">
                  <Option v-for="(item,index) in group_list" :value="item" :key="index">{{ item }}</Option>
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
            <chart-bar style="height: 300px;" :value="bar_data" text="带看时间"></chart-bar>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.area" text="意向面积"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.category" text="意向品类"></chart-pie>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.total_count" text="带看次数"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.consider" text="未成交因素"></chart-pie>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.kitchen_name" text="带看场地"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.employee_name" text="招商经理"></chart-pie>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.level" text="意愿程度"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.source" text="客户来源"></chart-pie>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 15px;">
        <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
          <Card>
            <chart-pie style="height: 300px;" :value="pie_data.group_name" text="团队信息"></chart-pie>
          </Card>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
//权限
// Clue/queryList,Index/getEmployeeList,Index/getKitchenList
import Tables from '_c/tables'
import { getQueryClueList } from '@/api/canvass'
import { getLeasingList , getKitchenList } from '@/api/data'
import { ChartPie , ChartBar } from '_c/charts'
// 权限
// 
export default {
  name: 'canvassStoreViewAnalysis',
  components: {
    Tables,
    ChartPie,
    ChartBar
  },
  data () {
    return {
      // 搜索条件
      sreachInfo:{
        source:'',
        employee_id:'',
        kitchen_id:'',
        start_area:'',
        end_area:'',
        consider:'',
        category:'',
        level:'',
        start_count:'',
        end_count:'',
        start_time:'',
        end_time:'',
        group_name:'',
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
      // 未成交因素 
      considers_list:["已成交","费用高","区域门店保护","客户开店计划尚未成熟","项目施工开业较晚","商圈流量较低","没有堂食","商圈竞争激烈","资质证件未办齐","其他因素务必备注说明"],
      category_list:["快餐","米粉","面馆","粥店","麻辣烫麻辣拌","麻辣香锅","汉堡炸鸡","黄焖鸡","炒饭","烤肉拌饭","凉皮","锅贴","饮品","甜点蛋糕","其他"],
      // 渠道来源 
      sources_list:["58渠道","微信群","电话渠道","转介绍-中介","转介绍-BD","转介绍-已签约客户","转介绍-非签约客户","已合作门店开分店","转介绍-招商同行","转介绍-品牌渠道","访客","官网","其他来源务必备注说明"],
      // 意向程度
      head_list:["已签约","高意向","中意向","低意向"],
      // 队伍
      group_list:['望京组','十里堡组','通州组','四道口组','新人组'],
      // 饼状图数据
      pie_data:{
        area:[],
        category:[],
        consider:[],
        employee_name:[],
        level:[],
        source:[],
        total_count:[],
        kitchen_name:[],
        group_name:[],
      },
      bar_data:{}
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
        source:this.sreachInfo.source,
        employee_id:this.sreachInfo.employee_id,
        kitchen_id:this.sreachInfo.kitchen_id,
        start_area:this.sreachInfo.start_area,
        end_area:this.sreachInfo.end_area,
        consider:this.sreachInfo.consider,
        category:this.sreachInfo.category,
        level:this.sreachInfo.level,
        start_count:this.sreachInfo.start_count,
        end_count:this.sreachInfo.end_count,
        start_time:this.sreachInfo.start_time,
        end_time:this.sreachInfo.end_time,
        group_name:this.sreachInfo.group_name,
      }
      this.pie_data = {
        area:[],
        category:[],
        clue_date:[],
        consider:[],
        employee_name:[],
        level:[],
        source:[],
        total_count:[],
        kitchen_name:[],
        group_name:[],
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
      if(!!info.start_count && !!info.end_count){
        if( info.start_count <=0 ){
          this.$Notice.warning({
            title: "带看需大于0！"
          })
          return
        }
      }
      if( (!!info.start_count && !info.start_count) ||  (!info.start_count && !!info.start_count)){
        this.$Notice.warning({
          title: "带看信息不全！"
        })
        return
      }
      this.getData( info )
    },
    // 获取数据
    getData( info ){
      getQueryClueList( info ).then(res => {
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
            case 'source':
              if( !info[k] ){arr.push(k)}
              break;
            case 'employee_id':
              if( !info[k] ){arr.push('employee_name')}
              break;
            case 'kitchen_id':
              if( !info[k] ){arr.push('kitchen_name')}
              break;
            case 'end_area':
              if( !info[k] ){arr.push('area')}
              break;
            case 'consider':
              if( !info[k] ){arr.push(k)}
              break;
            case 'category':
              if( !info[k] ){arr.push(k)}
              break;
            case 'level':
              if( !info[k] ){arr.push(k)}
              break;
            case 'end_count':
              if( !info[k] ){arr.push('total_count')}
              break;
            case 'group_name':
              if( !info[k] ){arr.push(k)}
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
      console.log(this.pie_data)
    },
    // 获取饼图数据
    getBarData( data ){
        let that = this;
        let arr = []
        that.base_info.forEach( function( i ) {
          arr.push(i.clue_date)
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
