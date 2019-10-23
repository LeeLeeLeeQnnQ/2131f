<template>
  <div>
    <tables
      v-model="end_shops_list"
      :columns="end_shops_columns"
      @data-view="showShopCard"
      @data-edit="editShopCard"
      @on-sort-change="endShopsSortTables"/>
    <Page
      :current="end_shops_page.current_page*1"
      :total="end_shops_page.total"
      :page-size="end_shops_page.list_rows"
      style="margin-top:10px;"
      @on-change="getEndShopsNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAllShopList } from '@/api/data'
export default {
  name: 'CSLEndShopsTables',
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
      //租赁中
      end_shops_columns: [
        {title: 'ID', key: 'id', width: 80},
        {title: '厨房', key: 'kitchen_name'},
        {title: '商铺ID', key: 'store_id'},
        {title: '商铺', key: 'store_no',sortable: 'custom'},
        {title: '商铺名', key: 'store_name'},
        {title: '申请退租时间', key: 'apply_date',sortable: 'custom'},
        {title: '最后操作人', key: 'employee_name'},
        {title: '招商人', key: 'manage_lease', width: 100,sortable: 'custom'},
        {title: '店长', key: 'manage_name'},
        {title: '剩余金额', key: 'surplus_fee'},
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
        }
      ],
      end_shops_list: [],
      end_shops_page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 排序字段
      end_sort_data:{
        order:'',
        key:'',
      },
    }
  },
  methods: {

    // 获取退租中
    getEndShops( data ){
      let info = Object.assign({}, this.sreachInfo , this.end_sort_data , data)
      info.lease_type = 3;
      getAllShopList( info ).then(res => {
        const dbody = res.data
        this.end_shops_list = dbody.data.list || [];
        this.end_shops_page = dbody.data.page;
      })
    },
    getEndShopsNewPage(page){
      // 获取新页-全部店铺
      this.getEndShops( { page : page } );
    },
    // 表格排序
    endShopsSortTables(sort_data){
      if(sort_data.order == 'normal'){
        this.end_sort_data.order = null;
        this.end_sort_data.key = null;
      }else{
        this.end_sort_data.order = sort_data.order;
        this.end_sort_data.key = sort_data.key;
      }
      this.getEndShops({page : this.end_shops_page.current_page});
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
    // init
    initData(){
      this.getEndShops( {} )
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
