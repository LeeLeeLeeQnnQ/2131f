<template>
  <div>
    <tables
      v-model="normal_shops_list"
      :columns="normal_shops_columns"
      @data-view="showShopCard"
      @data-edit="editShopCard"
      @data-change-store="changeShopStore"
      @on-sort-change="normalShopsSortTables"/>
    <Page
      :current="normal_shops_page.current_page*1"
      :total="normal_shops_page.total"
      :page-size="normal_shops_page.list_rows"
      style="margin-top:10px;"
      @on-change="getNormalShopsNewPage"/>
    <Modal title="更换档口" v-model="showChangeShopStoreModel"  @on-ok="saveChangeShopStoreInfo">
      <Form :model="changeInfo" :label-width="120">
        <FormItem label="">
          <h3>{{changeInfo.store_name}} ／ {{changeInfo.before}}</h3>
          <h3>月租金：{{changeInfo.month_rent}} 元</h3>
        </FormItem>
        <hr style="margin-bottom:15px;border:1px solid #eee;">
        <FormItem label="换档时间">
          <DatePicker :value="changeInfo.change_date" format="yyyy-MM" type="month" placeholder="换档时间" style="width: 300px" @on-change="setChangeDate"></DatePicker>
        </FormItem>
        <FormItem label="更换到的档口">
          <Select v-model="changeInfo.after" style="width: 300px">
              <Option v-for="item in shopList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="换档口增补费用">
          <Input v-model="changeInfo.append_fee" placeholder="换档口增补费用" style="width: 300px"></Input>
        </FormItem>
        <hr style="margin-bottom:15px;border:1px solid #eee;">
        <FormItem label="旧档口公摊结束时间">
          <DatePicker :value="changeInfo.old_date" format="yyyy-MM-dd" type="date" placeholder="旧档口公摊结束时间" style="width: 300px" @on-change="setOldShareDate"></DatePicker>
        </FormItem>
        <FormItem label="旧档口电表结束值">
          <Input v-model="changeInfo.old_energy" placeholder="旧档口电表结束值" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="旧档口水表结束值">
          <Input v-model="changeInfo.old_water" placeholder="旧档口水表结束值" style="width: 300px"></Input>
        </FormItem>
        <hr style="margin-bottom:15px;border:1px solid #eee;">
        <FormItem label="新档口公摊开始时间">
          <DatePicker :value="changeInfo.new_date" format="yyyy-MM-dd" type="date" placeholder="新档口公摊结束时间" style="width: 300px" @on-change="setNewShareDate"></DatePicker>
        </FormItem>
        <FormItem label="新档口电表起始值">
          <Input v-model="changeInfo.new_energy" placeholder="新档口电表起始值" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="新档口水表起始值">
          <Input v-model="changeInfo.new_water" placeholder="新档口水表起始值" style="width: 300px"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAllShopList , getStoreNoList , changeStoreNo } from '@/api/data'
export default {
  name: 'KSLNormalShopsTables',
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
      normal_shops_columns: [
        {title: 'ID', key: 'id', width: 80},
        {title: '厨房', key: 'kitchen_name'},
        {title: '商铺ID', key: 'store_id'},
        {title: '商铺', key: 'store_no',sortable: 'custom'},
        {title: '商铺名', key: 'store_name'},
        {title: '起租时间', key: 'start_date',sortable: 'custom'},
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
                    vm.$emit('data-change-store', params)
                  }
                }},
              '更换档口')
            },
          ]
        }
      ],
      normal_shops_list: [],
      normal_shops_page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 排序字段
      normal_sort_data:{
        order:'',
        key:'',
      },
      // 更换档口
      showChangeShopStoreModel:false,
      changeInfo:{},
      // 档口列表
      shopList:{},
    }
  },
  methods: {
    // 提交函数
    submitValidate(info){
      if (!info.change_date) {
        this.$Notice.warning({
          title: '请选择换档时间！'
        })
        return true
      }
      if (!info.after) {
        this.$Notice.warning({
          title: '请选择更换到的档口！'
        })
        return true
      }
      if (info.append_fee*1 < 0) {
        this.$Notice.warning({
          title: '请修改正确的增补费用！'
        })
        return true
      }
      if (!info.old_energy || isNaN(info.old_energy) || info.old_energy<= 0) {
        this.$Notice.warning({
          title: '请正确输入旧档口电表结束值！'
        })
        return true
      }
      if (!info.old_water || isNaN(info.old_water) || info.old_water<= 0) {
        this.$Notice.warning({
          title: '请正确输入旧档口水表结束值！'
        })
        return true
      }
      if (!info.old_date) {
        this.$Notice.warning({
          title: '请选择旧档口公摊结束时间！'
        })
        return true
      }
      if (!info.new_energy || isNaN(info.new_energy) || info.new_energy< 0) {
        this.$Notice.warning({
          title: '请正确输入新档口电表起始值！'
        })
        return true
      }
      if (!info.new_water || isNaN(info.new_water) || info.new_water< 0) {
        this.$Notice.warning({
          title: '请正确输入新档口水表起始值！'
        })
        return true
      }
      if (!info.new_date) {
        this.$Notice.warning({
          title: '请选择新档口水表起始值！'
        })
        return true
      }
    },
    //更换档口操作
    changeShopStore( params ){
      this.changeInfo = {};
      this.changeInfo.store_id = params.row.store_id;
      this.changeInfo.before = params.row.store_no;
      this.changeInfo.store_name = params.row.store_name;
      this.changeInfo.month_rent = params.row.month_rent;
      this.showChangeShopStoreModel = true;
    },
    // 保存更换
    saveChangeShopStoreInfo( ){
      if(this.submitValidate(this.changeInfo)){
        return
      }
      changeStoreNo( this.changeInfo ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: dbody.msg
        })
        this.getNormalShops( { page : this.normal_shops_page.current_page } );
      })
    },
    // 获取档口列表
    getStoreNoList(){
      let obj = { kitchen_id:this.sreachInfo.kitchen_id }
      getStoreNoList( obj ).then(res => {
        const dbody = res.data
        this.shopList = dbody.data
      })
    },
    // 设置换档时间
    setChangeDate(date){
      this.changeInfo.change_date = date;
    },
    // 设置换档时间
    setOldShareDate(date){
      this.changeInfo.old_date = date;
    },
    // 设置换档时间
    setNewShareDate(date){
      this.changeInfo.new_date = date;
    },
    // 获取租赁中
    getNormalShops( data ){
      let info = Object.assign({}, this.sreachInfo , this.normal_sort_data , data)
      info.lease_type = 2;
      getAllShopList( info ).then(res => {
        const dbody = res.data
        this.normal_shops_list = dbody.data.list || [];
        this.normal_shops_page = dbody.data.page;
      })
    },
    getNormalShopsNewPage(page){
      // 获取新页-全部店铺
      this.getNormalShops( { page : page } );
    },
    // 表格排序
    normalShopsSortTables(sort_data){
      if(sort_data.order == 'normal'){
        this.normal_sort_data.order = null;
        this.normal_sort_data.key = null;
      }else{
        this.normal_sort_data.order = sort_data.order;
        this.normal_sort_data.key = sort_data.key;
      }
      this.getNormalShops({page : this.normal_shops_page.current_page});
    },

    // 起租中编辑
    editShopCard( params ){
      let id = params.row.store_id
      let kitchen_id = params.row.kitchen_id
      const route = {
        name: 'kitchenShopEdit',
        query: {
          id,
          kitchen_id
        }
      }
      this.$router.push(route)
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
    // init
    initData(){
      this.getNormalShops( {} )
      this.getStoreNoList()
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
