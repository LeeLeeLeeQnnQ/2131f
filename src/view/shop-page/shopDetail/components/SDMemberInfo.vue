<template>
	<div>
		<Table ref="tables" :data="memberList" :columns="memberColumns"/></Table>
	</div>
</template>

<script>
import { getStoreEmployeeList } from '@/api/kitchen'
import Tables from '_c/tables'
export default {
  name: 'SDMemberInfo',
  components: {
    Tables
  },
  props: {
    data:{
      type: Object,
      default () {
        return { }
      }
    },
  },
  data () {
    return {
      memberColumns: [
        {title: '姓名', key: 'fullname'},
        { title: '性别',
          render: (h, params) => {
            let status = params.row.gender*1
            if (status == 1) { return h('span', '男') };
            if (status == 2) { return h('span', '女') };
          }
        },
        {title: '档口名称', key: 'store_name'},
        {title: '职位', key: 'post'},
        {title: '身份证', key: 'id_card'},
        {title: '健康证日期', key: 'card_date'},
        {title: '联系方式', key: 'contact'},
        {title: '备注', key: 'remark'},
      ],
      memberList: [],
    }
  },
  methods: {
  	initData(){
      if(!this.data.store_id){
        return
      }
      this.store_id = this.data.store_id
      this.initMemberinfo(this.store_id)
    },
    initMemberinfo( store_id ){
      getStoreEmployeeList(store_id).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: "人员列表获取失败！"
          })
          return
        }
        this.memberList = dbody.data.list || []
      })
    },
  },
  created () {
    this.initData();
  },
  beforeDestroy () {
    
  },
  watch: {
    data (newV, oldV) {
      this.initData();
    },
  }
}
</script>

<style lang="less" scoped>
  .ivu-tabs-content{
    overflow-x: hidden;
  }
  .tableFooter{
    margin-left: 20px;
  }
  .cellTit{
    margin-bottom: 12px;
    span{
      color:#fff;
      background-color:#3399ff;
      border-radius:5px;
      padding:5px 8px;
      margin-right: 10px;
    }
    .noData{
      background-color: #ff9900;
    }
  }
  .img-upload-list{
      display: inline-block;
      width: 60px;
      min-height: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 4px;
  }
  .img-upload-list img{
      width: 100%;
      height: 100%;
  }
  .img-upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .img-upload-list:hover .img-upload-list-cover{
      display: block;
  }
  .img-upload-list-cover i{
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
  }
</style>