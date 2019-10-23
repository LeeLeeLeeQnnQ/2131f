<template>
  <div>
    <Modal v-model="storeRefundModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>确认商户异常退款么？</span>
      </p>
      <div slot="footer">
          <Button type="error" size="large" long @click="quitKitchen">确认</Button>
      </div>
    </Modal>
    <tables 
      v-model="start_shops_list" 
      :columns="start_shops_columns" 
      @data-view="showShopCard" 
      @data-edit="editStartCard" 
      @data-handle="handleStartCard"
      @data-refund="showStoreRefundModal"
      @on-sort-change="startShopsSortTables"/>
    <Page
      :current="start_shops_page.current_page*1"
      :total="start_shops_page.total"
      :page-size="start_shops_page.list_rows"
      style="margin-top:10px;"
      @on-change="getStartShopsNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAllShopList } from '@/api/data'
export default {
  name: 'FSLStartShopsTables',
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
      // 异常退款！
      storeRefundModal:false,
      rufund_id:'',
      //起租中
      start_shops_columns: [
        {title: 'ID', key: 'id', width: 80},
        {title: '厨房', key: 'kitchen_name'},
        {title: '商铺ID', key: 'store_id'},
        {title: '商铺', key: 'store_no',sortable: 'custom'},
        {title: '商铺名', key: 'store_name'},
        {title: '建档时间', key: 'create_time',sortable: 'custom'},
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
        { title: '首期未缴',
          render: (h, params) => {
            let unpaid_fee = params.row.unpaid_fee*1
            return h('span', unpaid_fee)
          }
        },
        {title: '操作状态',
          render: (h, params) => {
            let confirm_time = params.row.confirm_time*1
            if( confirm_time > 0 ){
              return h('span', { style: {color: '#ff9900'}}, '财务已确认')
            }else{
              return h('span', { style: {color: '#19be6b'}}, '已建档')
            }
          }
        },
        {
          title: '查看',
          key: 'handle',
          width: 80,
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
          width: 80,
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
          width: 100,
          button: [
            // 不带气泡 一层嵌套
            (h, params, vm) => {
              let confirm_time = params.row.confirm_time*1
              if( confirm_time > 0 ){
                return ''
              }
              return h('Button', {
                style: {margin: '0'},
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-handle', params)
                  }
                }},
              '允许起租')
            },
          ]
        },
        {
          title: '异常退款',
          key: 'handle',
          width: 100,
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '商户异常退款！',
                  placement: "left-start"
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-refund', params)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {marginLeft: '0'}
                }, '异常退款')
              ])
            }
          ]
        },
      ],
      start_shops_list: [],
      start_shops_page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 排序字段
      start_sort_data:{
        order:'',
        key:'',
      },
    }
  },
  methods: {    
    // 获取起租中
    getStartShops( data ){
      let info = Object.assign({}, this.sreachInfo , this.start_sort_data , data)
      info.lease_type = 1;
      getAllShopList( info ).then(res => {
        const dbody = res.data
        this.start_shops_list = dbody.data.list || [];
        this.start_shops_page = dbody.data.page;
      })
    },
    getStartShopsNewPage(page){
      // 获取新页-全部店铺
      this.getStartShops( { page : page } );
    },
    // 表格排序
    startShopsSortTables(sort_data){
      if(sort_data.order == 'normal'){
        this.start_sort_data.order = null;
        this.start_sort_data.key = null;
      }else{
        this.start_sort_data.order = sort_data.order;
        this.start_sort_data.key = sort_data.key;
      }
      this.getStartShops({page : this.start_shops_page.current_page});
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
    // 起租 租赁中编辑
    editStartCard(params){
      let id = params.row.store_id
      const route = {
        name: 'financeShopEdit',
        query: {
          id
        }
      }
      this.$router.push(route)
    },
    // 财务润恤起租
    handleStartCard(params){
      let id = params.row.store_id
      const route = {
        name: 'financeShopHandle',
        query: {
          id
        }
      }
      this.$router.push(route)
    },
    // 异常退款弹窗
    showStoreRefundModal(params){
      this.rufund_id = '';
      this.rufund_id = params.row.store_id
      this.storeRefundModal = true;
    },
    // 异常退款
    quitKitchen(){
      this.storeRefundModal = false;
      let obj = {};
      obj.id = this.rufund_id;
      obj.kitchen_id = this.sreach_kitchen_id;
      const route = {
        name: 'financeErrorQuit',
        query: obj
      }
      this.$router.push(route)
    },
    // init
    initData(){
      this.getStartShops( {} )
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
