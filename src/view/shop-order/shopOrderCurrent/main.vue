<template>
  <div>
    <Card shadow>
      <Row :gutter="20">
        <i-col :xs="4" :md="4" :lg="4">
          <Input v-model="sreach.keyword" placeholder="订单号/手机号"/>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4">
          <DatePicker type="daterange" placeholder="选择时间段" @on-change="selectDate"></DatePicker>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4">
          <Select v-model="sreach.order_type" clearable placeholder="选择来源">
            <Option v-for="(item,index) in sources" :value="item.id" :key="index">{{ item.title }}</Option>
          </Select>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4">
          <Button type="primary" @click="sreachKeyword">搜索</Button>
        </i-col>
      </Row>
    </Card>
    <Card style="margin-top:10px;">
      <tables ref="tables"
        v-model="memberList"
        :columns="columns"
        @data-view="handleDataView"/>
      <Page :total="page.total"
        :page-size="page.list_rows"
        :current="page.current_page"
        style="margin-top:10px;"
        @on-change="getNewPage"/>
    </Card>
    <Modal width="70%" title="订单详情" v-model="showOrderDetails" scrollable :mask-closable="false">
      <Card style="margin-top:3px;">
         <p slot="title">订单状态</p>
         <div class="orderDetailBox">
            <p>订单编号: {{orderDetails.order.order_sn}}</p>
            <p>订单状态: {{orderDetails.info.order_status_c}}</p>
            <p>卖家: {{orderDetails.order.shopName}}</p>
         </div>
      </Card>
      <Card style="margin-top:3px;">
         <p slot="title">支付信息</p>
         <div class="orderDetailBox">
           <p>客户: {{orderDetails.info.recipient_name}}</p>
           <p>下单时间: {{orderDetails.order.create_time}}</p>
           <p>订单总额: {{orderDetails.order.income}}</p>
           <p>优惠券:  {{orderDetails.order.hongbao}}</p>
           <p>实际支付金额: {{orderDetails.order.totalPrice}}</p>
         </div>
      </Card>
      <Card style="margin-top:3px;">
         <p slot="title">客户信息</p>
         <div class="orderDetailBox">
           <p>收货人信息:  {{orderDetails.info.recipient_name}}</p>
           <p>收货人联系电话:  {{orderDetails.info.recipient_phone}}</p>
           <p>收货人地址:  {{orderDetails.info.recipient_address}}</p>
         </div>
      </Card>
      <Card style="margin-top:3px;">
         <p slot="title">快递信息</p>
         <div class="orderDetailBox">
           <p>快递员:  {{orderDetails.info.courier_name}}</p>
           <p>快递员电话:  {{orderDetails.info.courier_phone}}</p>
         </div>
      </Card>
      <Card style="margin-top:3px;">
         <p slot="title">商品名称</p>
         <tables v-model="orderDetailList" :columns="orderDetailsColumns"/>
      </Card>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// Order/history,Order/show
import { getCurrentOrderList , getCurrentOrderDetail } from '@/api/data'
export default {
  name: 'shopOrderCurrent',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索
      sreach:{
        keyword:'',
        start_time:'',
        end_time:'',
        order_type:'',
      },
      // 
      sources:[{id:1,title:"美团"},{id:2,title:"饿了么"}],
      // showOrderDetails
      showOrderDetails:false,
      // OrderDetails
      orderDetails:{
        order:{},
        info:{},
      },
      // orderDetailList
      orderDetailList:[],
      orderDetailsColumns:[{title: 'ID', key: 'id'}],
      columns: [
        {title: 'ID', key: 'id', width: 80 },
        {title: '订单号', key: 'order_sn'},
        {title: '客户姓名', key: 'recipient_name'},
        {title: '联系电话', key: 'recipient_phone'},
        {title: '订单状态 ',
          render: (h, params) => {
            let order_status = params.row.order_status
            // 1-用户已提交订单；2-可推送到App方平台也可推送到商家；4-商家已确认；6-已配送；8-已完成；9-已取消',
            switch (order_status*1) {
              case 1:
                return h('span', '用户已提交')
                break;
              case 2:
                return h('span', '推送到商家')
                break;
              case 4:
                return h('span', '商家已确认')
                break;
              case 6:
                return h('span', '已配送')
                break;
              case 8:
                return h('span', '已完成')
                break;
              case 9:
                return h('span', '已取消')
                break;
            }
          }
        },
        {title: '订单金额', key: 'order_total'},
        {title: '订单来源 ',
          render: (h, params) => {
            let order_type = params.row.order_type
            // 1：美团；2：饿了么；3：百度',
            switch (order_type*1) {
              case 1:
                return h('span', '美团')
                break;
              case 2:
                return h('span', '饿了么')
                break;
              case 3:
                return h('span', '百度')
                break;
            }
          }
        },
        {title: '快递费用(元)', key: 'deliver_fee'},
        {title: '下单时间', key: 'order_time'},
        {
          title: '操作',
          key: 'handle',
          width :160,
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-view', params)
                  }
                }},
              '查看')
            },
          ]
        }
      ],
      memberList: [],
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
    }
  },
  methods: {
    // 选择时间
    selectDate(date){
      this.sreach.start_time = date[0]
      this.sreach.end_time = date[1]
    },
    // getNewPage
    getNewPage (page) {
      this.init({ page : page });
    },
    // 搜索
    sreachKeyword(){
      this.init({});
    },
    // handleDataView
    handleDataView(params){
      let id  = params.row.id;
      getCurrentOrderDetail({id:id}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        let info = dbody.data;
        if(info.info.order_type*1 == 1){
          this.handleDataViewMeiTuan(info)
        }else if (info.info.order_type*1 == 2) {
          this.handleDataViewEle(info)
        }
      })
    },
    handleDataViewMeiTuan(info){
      let order_status = info.info.order_status
      // 1-用户已提交订单；2-可推送到App方平台也可推送到商家；4-商家已确认；6-已配送；8-已完成；9-已取消',
      switch (order_status*1) {
        case 1:
          info.info.order_status_c = '用户已提交'
          break;
        case 2:
          info.info.order_status_c = '推送到商家'
          break;
        case 4:
          info.info.order_status_c = '商家已确认'
          break;
        case 6:
          info.info.order_status_c = '已配送'
          break;
        case 8:
          info.info.order_status_c = '已完成'
          break;
        case 9:
          info.info.order_status_c = '已取消'
          break;
      }
      this.orderDetails = info;
      this.orderDetailList = info.detail || [];
      this.orderDetailsColumns = [
        {title: '商品名称', key: 'food_name'},
        {title: '商品数量', key: 'quantity'},
        {title: '商品单价', key: 'price'},
        {title: '餐盒数量', key: 'box_num'},
        {title: '餐盒单价', key: 'box_price'},
      ]
      this.showOrderDetails = true;
    },
    handleDataViewEle(info){
      let order_status = info.info.order_status
      // 1-用户已提交订单；2-可推送到App方平台也可推送到商家；4-商家已确认；6-已配送；8-已完成；9-已取消',
      switch (order_status*1) {
        case 1:
          info.info.order_status_c = '用户已提交'
          break;
        case 2:
          info.info.order_status_c = '推送到商家'
          break;
        case 4:
          info.info.order_status_c = '商家已确认'
          break;
        case 6:
          info.info.order_status_c = '已配送'
          break;
        case 8:
          info.info.order_status_c = '已完成'
          break;
        case 9:
          info.info.order_status_c = '已取消'
          break;
      }
      this.orderDetails = info;
      this.orderDetailsColumns = [
        {title: '商品名称', key: 'name'},
        {title: '商品数量', key: 'quantity'},
        {title: '商品单价', key: 'price'},
      ]
      this.orderDetailList = info.groups || [];
      this.showOrderDetails = true;
    },
    // 初始化
    init(data){
      let obj = Object.assign(data,this.sreach)
      getCurrentOrderList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.memberList = dbody.data.list
        this.page = dbody.data.page
      })
    }
  },
  mounted () {
    this.init({});
  },
  computed: {

  }
}
</script>

<style lang='less'>
  .orderDetailBox{
    width: 100%;
    overflow: hidden;
    display: flex;
    flex: 1;
    flex-wrap: wrap;    
    position: relative;
    >p{
      width: 50%;
      min-height: 2.3em;
    }
  }
</style>
