<template>
  <div>
    <tables
      v-model="pre_build_shops_list"
      :columns="pre_build_shops_columns"
      @data-edit="editShopCard"
      @on-sort-change="preBuildShopsSortTables"/>
    <Page
      :current="pre_build_shops_page.current_page*1"
      :total="pre_build_shops_page.total"
      :page-size="pre_build_shops_page.list_rows"
      style="margin-top:10px;"
      @on-change="getPreBuildShopsNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPrebuildList  } from '@/api/data'
export default {
  name: 'CSLPreBuildShopsTables',
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
      pre_build_shops_columns: [
        {title: '预建档ID', key: 'id', width: 100},
        {title: '厨房', key: 'kitchen_name'},
        {title: '商铺', key: 'store_no',sortable: 'custom'},
        {title: '商铺名', key: 'store_name'},
        {title: '提交人', key: 'employee_name'},
        {title: '创建时间', key: 'create_time',width:150},
        {title: '招商人', key: 'manage_lease', width: 100,sortable: 'custom'},
        {title: '店长', key: 'manage_name'},
        { title: '店铺状态',
          render: (h, params) => {
            return h('span', { style: {color: '#85ba32'}}, '建档中') 
          }
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
      pre_build_shops_list: [],
      pre_build_shops_page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 排序字段
      pre_build_sort_data:{
        order:'',
        key:'',
      },

    }
  },
  methods: {
    // 获取全部店铺列表函数
    getPreBuildShops(  data ){
      let info = Object.assign({}, this.sreachInfo , this.pre_build_sort_data , data)
      getPrebuildList( info ).then(res => {
        const dbody = res.data
        this.pre_build_shops_list = dbody.data.list || [];
        this.pre_build_shops_page = dbody.data.page;
      })
    },
    getPreBuildShopsNewPage(page){
      // 获取新页-全部店铺
      this.getPreBuildShops(  { page : page } );
    },
    // 表格排序
    preBuildShopsSortTables(sort_data){
      if(sort_data.order == 'normal'){
        this.pre_build_sort_data.order = null;
        this.pre_build_sort_data.key = null;
      }else{
        this.pre_build_sort_data.order = sort_data.order;
        this.pre_build_sort_data.key = sort_data.key;
      }
      this.getPreBuildShops({page : this.pre_build_shops_page.current_page});
    },

    //表格编辑
    editShopCard(params){
      let id = params.row.id
      let kitchen_id = params.row.kitchen_id
      const route = {
        name: 'canvassShopPreBuildEdit',
        query: {
          id,
          kitchen_id
        }
      }
      this.$router.push(route)
    },
    // init
    initData(){
      this.getPreBuildShops( {} )
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
