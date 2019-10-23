<template>
  <div>
    <Card shadow>
      <Row :gutter="20">
        <i-col :xs="4" :md="4" :lg="4">
          <Select v-model="sreach_kitchen_id" @on-change="selectKitchen">
            <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
          </Select>
        </i-col>
      </Row>
    </Card>
    <Card shadow style="margin-top: 5px;">
      <tables
        v-model="alive_store_list"
        :columns="alive_store_columns"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// Kitchen/index,KitchenStore/querylist
import { getKitchenStoreQueryList } from '@/api/setting'
import { getKitchenList } from '@/api/data'
export default {
  name: 'kitchenDataStoreSale',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索部分
      kitchenList:[],
      sreach_kitchen_id:'',
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 列表数据
      // 1租赁中2转租中3起租中4空闲中
      alive_store_list:[],
      alive_store_columns:[
        {title: '档口', key: 'store_no',"sortable": true,},
        {title: '面积', key: 'area',"sortable": true,},
        {
          "title": "档口状态",
          "key": "store_status",
          "width": 150,
          "sortable": true,
          filters: [
              {
                  label: '租赁中',
                  value: 1
              },
              {
                  label: '转租中',
                  value: 2
              },
              {
                  label: '起租中',
                  value: 3
              },
              {
                  label: '空闲中',
                  value: 4
              }
          ],
          filterMethod (value, row) {
              return (row.store_status*1 == value);
          },
          render: (h, params) => {
            let store_status = params.row.store_status*1;
            switch (store_status) {
              case 1:
                return h('span', { style: {color: '#ff9900'}} ,'租赁中')
                break;
              case 2:
                return h('span', { style: {color: '#2d8cf0'}} ,  '转租中')
                break;
              case 3:
                return h('span',  { style: {color: '#19be6b'}} ,  '起租中')
                break;
              case 4:
                return h('span', { style: {color: '#000000'}} ,'空闲中')
                break;
            }
          }
        },
        {title: '商铺ID', key: 'store_id'},
        {title: '商铺', key: 'store_name'},
        {title: '租金', key: 'store_rent_fee',"sortable": true,},
        {title: '押金', key: 'store_deposit_fee',"sortable": true,},
        {title: '入场费', key: 'store_entrance_fee',"sortable": true,},
        {title: '增容', key: 'store_zr_fee',"sortable": true,},
      ],
    }
  },
  methods: {
    // 重新选择厨房
    selectKitchen(){
      this.init();
    },
    initData( info ){
      getKitchenStoreQueryList( info ).then(res => {
        const dbody = res.data;
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.alive_store_list = dbody.data  || [];
      })
    },
    init( ){
      let info = {};
      info.kitchen_id = this.sreach_kitchen_id;
      this.initData(info);
    },
  },
  mounted () {
    getKitchenList().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      // 初始化函数
      this.kitchenList = dbody.data || [];
      if(this.kitchenList.length > 0){
        this.sreach_kitchen_id = this.kitchenList[this.kitchenList.length-1].id;
      }
      this.init();
    })  
  }
}






</script>