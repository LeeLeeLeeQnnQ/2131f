<template>
	<div>
		<tables v-model="kitchen_expend_list" :columns="expend_list_columns"/>
    <Page :total="expend_page.total" :page-size="expend_page.list_rows" style="margin-top:10px;" @on-change="getExpendNewPage"/>
	</div>
</template>

<script>
import Tables from '_c/tables'
import { getKitchenExpendList } from '@/api/finance'

export default {
  name: 'KDSLKitchenExpendList',
  components: {
    Tables
  },
  props: {
    kitchen_id:{
      default () {
        return ''
      }
    },
  },
  data () {
    return {
      kitchen_expend_list:[],
      expend_list_columns: [
        {title: '所属厨房', key: 'kitchen_name'},
        {title: '标题', key: 'title'},
        {title: '报账日期', key: 'expend_date'},
        {title: '登记时间', key: 'create_time'},
        {title: '金额总计', key: 'money'},
        {title: '备注', key: 'remark'},
      ],
      expend_page: {
        curmoney_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
    }
  },
  methods: {
  	// 获取新页面
    getExpendNewPage (page) {
      let obj = {
        kitchen_id: this.kitchen_id,
        page:page
      }
      this.getKitchenExpendList( obj );
    },
    // 获取支出列表
    getKitchenExpendList( obj ){
      getKitchenExpendList( obj ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.kitchen_expend_list = dbody.data.list || [];
        this.expend_page = dbody.data.page;
      })
    },
    // init
    initData(){
      if(!this.kitchen_id){
        return
      }
      this.getKitchenExpendList({ kitchen_id : this.kitchen_id });
    },
  },
  created(){
    
  },
  mounted () {
    this.initData();
  },
  beforeDestroy () {
    
  },
  watch: {
    kitchen_id (newV, oldV) {
      this.initData();
    },
  }
}
</script>