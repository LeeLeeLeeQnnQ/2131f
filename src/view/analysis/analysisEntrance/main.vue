<template>
  <div>
    <SreachBox :option="sreach_option" :getSreachInfo="sreachSubmit"></SreachBox>
    <Card shadow style="margin-top: 8px;">
      <Table :data="storeProgressData" :columns="storeProgressColumns"></Table>
      <Page :current="page.current_page*1" :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
    </Card>
  </div>
</template>

<script>
//权限
// Kitchen/index,StoreLease/queryStoreProgress

import  SreachBox  from '_c/sreach-box'
import { queryStoreProgress } from '@/api/data'
import Tables from '_c/tables'
export default {
  name: 'analysisEntrance',
  components: {
    Tables,
    SreachBox
  },
  data () {
    return {
      // 搜索设置
      sreach_option:{
        picker_kitchen:true,
      },
      // 搜索条件
      sreach:{
        kitchen_id:[],
      },
      //设备表格头部
      storeProgressColumns:[
        {
          title: '厨房名称',
          key: 'kitchen_name'
        },
        {
          title: '商户名称',
          key: 'store_name'
        },
        {
          title: '档口',
          key: 'store_no',
          width: 80
        },
        {
          title: '建档(开业)日期',
          key: 'create_date'
        },
        { title: '进场周期(天)',
          render: (h, params) => {
            let entrance_days = params.row.entrance_days;
            return h('span', entrance_days)
          },
          renderHeader:  (h, params) => { 
            return this.renderHeader(h, params)
          }
        },
        { title: '接驳周期(天)',
          render: (h, params) => {
            let connect_days = params.row.connect_days;
            return h('span', connect_days)
          },
          renderHeader:  (h, params) => { 
            return this.renderHeader(h, params)
          }
        },
        { title: '上线周期(天)',
          render: (h, params) => {
            let online_days = params.row.online_days;
            return h('span', online_days)
          },
          renderHeader:  (h, params) => { 
            return this.renderHeader(h, params)
          }
        },
        { title: '起租周期(天)',
          render: (h, params) => {
            let start_days = params.row.start_days;
            return h('span', { style: {color: 'orange'}}, start_days)
          },
          renderHeader:  (h, params) => { 
            return this.renderHeader(h, params)
          }
        },
      ],
      //起租进度数据
      storeProgressData:[],
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
    }
  },
  methods: {
    renderHeader: (h, params) => {
      let title = params.column.title 
      return h('Tooltip', {
          props: {
              content: (() => {
                switch (title) {
                  case '进场周期(天)':
                    return '【入场时间】-【建档时间／开业时间】'
                    break
                  case '接驳周期(天)':
                    return '【接驳时间】-【入场时间】'
                    break
                  case '上线周期(天)':
                    return '【上线时间】-【建档时间／开业时间】'
                    break
                  case '起租周期(天)':
                    return '【起租时间】-【建档时间／开业时间】'
                    break
                }
              })(),
              trigger: 'hover',
              size: 'small',
              placement: 'top',
          },
          style: {position: 'absolute',height:'40px',top:'0',lineHeight:'40px',cursor:'pointer'},
      }, [
          h('span', {
              domProps: {
                  innerHTML: title + '<i class="ivu-icon alert-icon ivu-icon-md-alert"></i>'
              }
          })
      ])
    },
    init(data){
      this.column_data = [];
      let sreach = this.sreach;
      let obj = Object.assign({},data,sreach)
      this.queryStoreProgress(obj);
    },
    queryStoreProgress(info){
      queryStoreProgress(info).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.storeProgressData = dbody.data.list || [];
        this.page = dbody.data.page;
        if(!dbody.data.list){
          this.$Notice.warning({
            title: "暂无数据"
          })
          return
        }
      })
    },
    getNewPage(page){
      this.init({page:page});
    },
    //搜索
    sreachSubmit(sreachInfo){
      this.sreach = sreachInfo;
      this.init({page:"1"});
    },
  },
  computed: {
    
  },
  created () {
    
  },
}
</script>

<style>
  .alert-icon{
    font-size: 0.9rem;
    margin-left: 2px;
    color: gray;
  }
</style>
