<template>
  <div>
    <Card shadow style="margin-top: 5px">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col>
          <DatePicker type="daterange" placeholder="选择时间段" style="min-width: 200px" @on-change="selectDate"></DatePicker>
        </i-col>
        <i-col>
          <Select
            v-model="sreach_info.manage_lease_id"
            filterable
            remote
            :remote-method="remoteLeaseMethod"
            :loading="remoteLoading"
            clearable
            @on-change="selectManageLeaseId"
            placeholder="选择招商经理"
            style="width: 200px"
            >
            <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
          </Select>
        </i-col>
        <i-col :md="6" :lg="6">
          <Select v-model="sreach_info.customer_source"  @on-change="selectSource" clearable style="width: 200px" placeholder="选择来源">
            <Option v-for="(item,index) in sources_list" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </i-col>
      </Row>
    </Card>
    <Card shadow style="margin-top: 5px">
      <tables
      ref="sign_analysis_tables"
      v-model="sign_analysis_list"
      :columns="sign_analysis_columns"
      @on-sort-change="signAnalysisSortTables"/>
    <Page
      :total="page.total"
      :page-size="page.list_rows"
      style="margin-top:10px;"
      @on-change="getSignAnalysisNewPage"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// Index/getEmployeeList,StoreLease/index
import { getLeasingList , getSignShopList } from '@/api/data'
export default {
  name: 'canvassStoreSign',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索对象
      sreach_info:{
        manage_lease_id:'',
        // 时间段
        start_time:'',
        end_time:'',
        customer_source:'',
      },
      // 招商列表
      leasingList:[],
      remoteLoading:false,
      // 表格
      sign_analysis_columns: [
        {title: '厨房', key: 'kitchen_name'},
        {title: '商铺', key: 'store_no', width: 80,sortable: 'custom'},
        {title: '商铺名', key: 'store_name'},
        {title: '签约时间', key: 'sign_date', width: 150,sortable: 'custom'},
        {title: '招商人', key: 'manage_lease', width: 100,sortable: 'custom'},
        {title: '客户来源', key: 'customer_source'},
        { title: '店铺状态',
          render: (h, params) => {
            let lease_type = params.row.lease_type*1
            if(lease_type == 1){
              return h('span', { style: {color: '#19be6b'}}, '起租中')
            }else if (lease_type == 2) {
              return h('span', { style: {color: '#2d8cf0'}}, '租赁中')
            }else if (lease_type == 3) {
              return h('span', { style: {color: '#ff9900'}}, '退租中')
            }else if (lease_type == 7) {
              return h('span', { style: {color: '#6600cc'}}, '退款中')
            }else if (lease_type == 4){
              return h('span', '已归档')
            } 
          }
        },
        {title: '面积', key: 'store_area'},
        {title: '押金', key: 'deposit_fee'},
        {title: '租金', key: 'month_rent'},
        {title: '入场费', key: 'entrance_fee'},
        {title: '增容费', key: 'zr_fee'},
      ],
      // 数据
      sign_analysis_list: [],
      // 页码
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 排序字段
      sign_analysis_sort_data:{
        order:'',
        key:'',
      },
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
    // 选择时间
    selectDate(date){
      this.sreach_info.start_time = date[0]
      this.sreach_info.end_time = date[1]
      let info = Object.assign({}, this.sreach_info);
      info.page = this.page.current_page;
      this.initData(info)
    },
    // 选择招商经理
    selectManageLeaseId(){
      let info = Object.assign({}, this.sreach_info);
      this.initData(info)
    },
    selectSource(){
      let info = Object.assign({}, this.sreach_info);
      this.initData(info)
    },
    // 获取新页面
    getSignAnalysisNewPage(page){
      let info = Object.assign({}, this.sreach_info);
      info.page = page;
      this.initData(info)
    },
    // 排序
    signAnalysisSortTables( sort_data ){
      if(sort_data.order == 'normal'){
        this.sign_analysis_sort_data.order = null;
        this.sign_analysis_sort_data.key = null;
      }else{
        this.sign_analysis_sort_data.order = sort_data.order;
        this.sign_analysis_sort_data.key = sort_data.key;
      }
      let info = Object.assign({}, this.sreach_info,this.sign_analysis_sort_data);
      this.initData(info);
    },
    // 获取列表数据
    initData(info){
      getSignShopList(info).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.sign_analysis_list = !!dbody.data ? dbody.data.list : [];
        this.page = !!dbody.data ? dbody.data.page : this.page;
      })
    },
    //初始化
    init(){
      this.initData();
    },
  },
  mounted () {
    this.init();
  }
}
</script>

<style>

</style>
