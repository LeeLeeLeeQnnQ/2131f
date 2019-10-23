<template>
  <div>
    <tables
      v-model="all_shops_list"
      :columns="all_shops_columns"
      @data-view="showShopCard"
      @on-sort-change="allShopsSortTables"/>
    <Page
      :current="all_shops_page.current_page*1"
      :total="all_shops_page.total"
      :page-size="all_shops_page.list_rows"
      style="margin-top:10px;"
      @on-change="getAllShopsNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAllShopList } from '@/api/data'
export default {
  name: 'KDSLAllShopsTables',
  components: {
    Tables
  },
  props: {
    sreachInfo:{
      type: Object,
      default () {
        return { }
      }
    },
  },
  data () {
    return {
      // 全部商户
      all_shops_columns: [
        {title: 'ID', key: 'id', width: 80},
        {title: '厨房', key: 'kitchen_name'},
        {title: '商铺', key: 'store_no',sortable: 'custom'},
        {title: '商铺名', key: 'store_name'},
        {title: '提交人', key: 'employee_name'},
        {title: '招商人', key: 'manage_lease', width: 100,sortable: 'custom'},
        {title: '店长', key: 'manage_name'},
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
            }else if (lease_type == 4) {
              return h('span', '已归档')
            }
          }
        },
        {
          title: '查看',
          key: 'handle',
          button: [
            // 不带气泡 一层嵌套
            (h, params, vm) => {
              return h('Button', {style: {margin: '0'},
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-view', params)
                  }
                }},
              '资料')
            },
          ]
        }
      ],
      all_shops_list: [],
      all_shops_page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 排序字段
      all_sort_data:{
        order:'',
        key:'',
      },
    }
  },
  methods: {

    // 获取全部店铺列表函数
    getAllShops(  data ){
      let info = Object.assign({}, this.sreachInfo , this.all_sort_data , data)
      getAllShopList( info ).then(res => {
        const dbody = res.data
        this.all_shops_list = dbody.data.list || [];
        this.all_shops_page = dbody.data.page;
      })
    },
    getAllShopsNewPage(page){
      // 获取新页-全部店铺
      this.getAllShops( {page : page} );
    },
    // 表格排序
    allShopsSortTables(sort_data){
      if(sort_data.order == 'normal'){
        this.all_sort_data.order = null;
        this.all_sort_data.key = null;
      }else{
        this.all_sort_data.order = sort_data.order;
        this.all_sort_data.key = sort_data.key;
      }
      this.getAllShops({page : this.all_shops_page.current_page});
    },

    // 表格查看栏
    showShopCard(params){
      let id = params.row.store_id
      let kitchen_id = params.row.kitchen_id
      const route = {
        name: 'shopDetail',
        query: {
          id,
          kitchen_id
        }
      }
      this.$router.push(route)
    },
    // init
    initData(){
      this.getAllShops( {} )
    },
  },
  mounted () {
    
  },
  beforeDestroy () {
    
  },
  watch: {
    sreachInfo (newV, oldV) {
      this.initData();
    },
  }
}
</script>
