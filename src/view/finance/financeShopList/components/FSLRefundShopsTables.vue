<template>
  <div>
    <tables
      v-model="refund_shops_list"
      :columns="refund_shops_columns"
      @data-view="showShopCard"
      @data-edit="editStartCard2"
      @data-handle="handleStartCard2"
      @on-sort-change="refundShopsSortTables"/>
    <Page
      :current="refund_shops_page.current_page*1"
      :total="refund_shops_page.total"
      :page-size="refund_shops_page.list_rows"
      style="margin-top:10px;"
      @on-change="getRefundShopsNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAllShopList } from '@/api/data'
export default {
  name: 'FSLRefundShopsTables',
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
      //退款中
      refund_shops_columns: [
        {title: 'ID', key: 'id', width: 80},
        {title: '厨房', key: 'kitchen_name'},
        {title: '商铺ID', key: 'store_id'},
        {title: '商铺', key: 'store_no',sortable: 'custom'},
        {title: '商铺名', key: 'store_name'},
        {title: '租金结束时间', key: 'settle_date',sortable: 'custom'},
        {title: '最后操作人', key: 'employee_name'},
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
            }else if (lease_type == 4){
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
              return h('Button', {
                style: {margin: '0'},
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
        },
        {
          title: '编辑',
          key: 'handle',
          button: [
            // 不带气泡 一层嵌套
            (h, params, vm) => {
              return h('Button', {
                style: {margin: '0'},
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-edit', params)
                  }
                }},
              '编辑')
            },
          ]
        },
        {
          title: '操作',
          key: 'handle',
          button: [
            // 不带气泡 一层嵌套
            (h, params, vm) => {
              return h('Button', {style: {margin: '0'},
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-handle', params)
                  }
                }},
              '退款归档')
            },
          ]
        }
      ],
      refund_shops_list: [],
      refund_shops_page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 排序字段
      refund_sort_data:{
        order:'',
        key:'',
      },
    }
  },
  methods: {

    // 获取退款中
    getRefundShops( data ){
      let info = Object.assign({}, this.sreachInfo , this.refund_sort_data , data)
      info.lease_type = 7;
      getAllShopList( info ).then(res => {
        const dbody = res.data
        this.refund_shops_list = dbody.data.list || [];
        this.refund_shops_page = dbody.data.page;
      })
    },
    getRefundShopsNewPage(page){
      // 获取新页-全部店铺
      this.getRefundShops( { page : page } );
    },
    // 表格排序
    refundShopsSortTables(sort_data){
      if(sort_data.order == 'normal'){
        this.refund_sort_data.order = null;
        this.refund_sort_data.key = null;
      }else{
        this.refund_sort_data.order = sort_data.order;
        this.refund_sort_data.key = sort_data.key;
      }
      this.getRefundShops({page : this.refund_shops_page.current_page});
    },



    //表格编辑
    editShopCard(params){
      let id = params.row.store_id
      let kitchen_id = params.row.kitchen_id
      const route = {
        name: 'canvassShopEdit',
        query: {
          id,
          kitchen_id
        }
      }
      this.$router.push(route)
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
    // 退租 归档编辑
    editStartCard2(params){
      let id = params.row.store_id
      const route = {
        name: 'financeShopEditB',
        query: {
          id
        }
      }
      this.$router.push(route)
    },
    handleStartCard2(params){
      let id = params.row.store_id
      const route = {
        name: 'financeShopHandleB',
        query: {
          id
        }
      }
      this.$router.push(route)
    },
    // init
    initData(){
      this.getRefundShops( {} )
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
