<template>
  <div>
    <tables
      ref="eliminate_shops_tables"
      v-model="eliminate_shops_list"
      :columns="eliminate_shops_columns"
      @data-view="showShopCard"
      @data-edit="editShopCard2"
      @on-sort-change="eliminateShopsSortTables"/>
    <Page
      :current="eliminate_shops_page.current_page*1"
      :total="eliminate_shops_page.total"
      :page-size="eliminate_shops_page.list_rows"
      style="margin-top:10px;"
      @on-change="getEliminateShopsNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAllShopList } from '@/api/data'
export default {
  name: 'KSLEliminateShopsTables',
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
      // 已归档 eliminate
      eliminate_shops_columns: [
        {title: 'ID', key: 'id', width: 80},
        {title: '厨房', key: 'kitchen_name'},
        {title: '商铺ID', key: 'store_id'},
        {title: '商铺', key: 'store_no',sortable: 'custom'},
        {title: '商铺名', key: 'store_name'},
        {title: '归档时间',
          render: (h, params) => {
            let archive_time = params.row.archive_time*1000
            return h('span', this.getdate(archive_time))
          },sortable: 'custom'
        },
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
        },
        {
          title: '编辑',
          key: 'handle',
          button: [
            // 不带气泡 一层嵌套
            (h, params, vm) => {
              return h('Button', {style: {margin: '0'},
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
      eliminate_shops_list: [],
      eliminate_shops_page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 排序字段
      eliminate_sort_data:{
        order:'',
        key:'',
      },
    }
  },
  methods: {
    // 时间转换
    getdate(t) {
        var now = new Date(t),
            y = now.getFullYear(),
            m = ("0" + (now.getMonth() + 1)).slice(-2),
            d = ("0" + now.getDate()).slice(-2);
        return y + "-" + m + "-" + d + " " + now.toTimeString().substr(0, 8);
    },
    // 获取归档
    getEliminateShops( data ){
      let info = Object.assign({}, this.sreachInfo , this.eliminate_sort_data , data)
      info.lease_type = 4;
      getAllShopList( info ).then(res => {
        const dbody = res.data
        this.eliminate_shops_list = dbody.data.list || [];
        this.eliminate_shops_page = dbody.data.page;
      })
    },
    getEliminateShopsNewPage(page){
      // 获取新页-全部店铺
      this.getEliminateShops( { page : page }  );
    },
    // 表格排序
    eliminateShopsSortTables(sort_data){
      if(sort_data.order == 'normal'){
        this.eliminate_sort_data.order = null;
        this.eliminate_sort_data.key = null;
      }else{
        this.eliminate_sort_data.order = sort_data.order;
        this.eliminate_sort_data.key = sort_data.key;
      }
      this.getEliminateShops({});
    },

    // 表格查看栏
    showShopCard( params ){
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
    // 退租中编辑
    editShopCard2(params){
      let id = params.row.store_id
      let kitchen_id = params.row.kitchen_id
      const route = {
        name: 'kitchenShopEditB',
        query: {
          id,
          kitchen_id
        }
      }
      this.$router.push(route)
    },
    // init
    initData(){
      this.getEliminateShops({page : this.eliminate_shops_page.current_page});
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
