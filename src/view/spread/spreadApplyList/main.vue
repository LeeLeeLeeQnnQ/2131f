<template>
  <div>
    <Card shadow style="margin-bottom: 5px">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col>
          <DatePicker type="daterange" placeholder="选择时间段" style="min-width: 200px" @on-change="selectDate"></DatePicker>
        </i-col>
        <i-col>
          <Select v-model="sreach.area_id" placeholder="选择区域" style="width: 200px">
            <Option v-for="item in zoneList" :value="item.id" :key="item.id">{{ item.area_name }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Select v-model="sreach.order_state" placeholder="选择状态" style="width: 200px">
            <Option v-for="item in statusList" :value="item.order_state" :key="item.order_state">{{ item.status_name }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Input v-model="sreach.openid" placeholder="请输入openid"/>
        </i-col>
        <i-col>
          <Input v-model="sreach.keyword" placeholder="请输入关键字"/>
        </i-col>
        <i-col>
          <Button type="primary" @click="sreachKeyword">搜索</Button>
        </i-col>
        <i-col>
          <Button type="primary" @click="exportTable">导出表格</Button>
        </i-col>
      </Row>
    </Card>
    <!-- 厨房表格数据 -->
    <Card>
      <p slot="title">
          红包申领列表
      </p>
      <tables ref="tables" v-model="applyList" :columns="columns" 
          @data-view-img="handleViewImg" 
          @data-handle-return="handleApplyReturn" 
          @data-handle-pass="handleApplyPass" 
      />
      <Page :total="page.total" :page-size="page.list_rows" @on-change="getNewPage" style="margin-top:10px;"/>
    </Card>
    <!-- 申领凭证 -->
    <Modal title="充值凭证预览" v-model="showApplyImgList">
      <Form :model="evaluateInfo" :label-width="120" inline>
        <FormItem v-if="!!evaluateInfo.shop_name" label="店铺名称">
          <Input v-model="evaluateInfo.shop_name" type="textarea" :rows="2" readonly style="width: 300px"></Input>
        </FormItem>
        <FormItem v-if="!!evaluateInfo.order_total" label="实付金额">
          <Input v-model="evaluateInfo.order_total" readonly style="width: 300px"></Input>
        </FormItem>
        <FormItem v-if="!!evaluateInfo.order_time" label="订单日期">
          <Input v-model="evaluateInfo.order_time" readonly style="width: 300px"></Input>
        </FormItem>
        <FormItem label="图片凭证">
          <div class="img-upload-list" v-for="item in applyImgList">
            <div>
              <img :src="item">
              <div class="img-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              </div>
            </div>
          </div>
        </FormItem>
      </Form>
    </Modal>
    <!-- 驳回 -->
    <Modal title="驳回申请"
      v-model="showApplyReturnModal"
      @on-ok="saveApplyReturn">
      <Input v-model="return_remark.remark" type="textarea" :rows="4" placeholder="驳回原因" />
    </Modal>
    <!-- 发放 -->
    <Modal title="发放红包"
      v-model="showApplyPassModal"
      @on-ok="saveApplyPass">
      <Input v-model="apply_money.order_price" placeholder="输入发放金额"></Input>
    </Modal>
    <!-- 查看图片 -->
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
// 权限
// UserOrder/index,UserOrder/state,Area/getAreaList,UserOrder/export
import Tables from '_c/tables'
import { getSpreadUserOrderList , changeStateSpreadUserOrdert , getZoneList , searchByOrdersn} from '@/api/spread'
export default {
  name: 'spreadApplyList',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索
      sreach:{
        openid:'',
        keyword:'',
        start_time:'',
        end_time:'',
        zone_id:'',
        order_state:'',
      },
      columns: [
        {title: '申领ID', key: 'id', width: 80},
        {title: '申领日期', key: 'create_time'},
        {title: '区域', key: 'area_name'},
        {title: 'openid', key: 'openid'},
        {title: '订单号', key: 'order_sn'},
        {title: '店铺名称', key: 'shop_name'},
        {title: '红包金额', key: 'coupon_value'},
        { title: '返现规则', key: 'rules'},
        { title: '审批状态',
          render: (h, params) => {
            let order_state = params.row.order_state*1
            if(order_state == 0){
              return h('span', { style: {color: '#19be6b'}}, '未审核')
            }else if (order_state == 1) {
              return h('span', { style: {color: '#2d8cf0'}}, '已发放')
            }else if (order_state == 2) {
              return h('span', { style: {color: '#2d8cf0'}}, '发放中')
            }else if (order_state == 3) {
              return h('span', { style: {color: 'red'}}, '发放失败')
            }else if (order_state == 4) {
              return h('span', { style: {color: 'red'}}, '未通过')
            }  
          }
        },
        {title: '实发金额', key: 'order_price'},
        {title: '服务费', key: 'shop_service'},
        { title: '审批结果', width : 130 ,
          render: (h, params) => {
            let order_state = params.row.order_state*1
            let remark = params.row.remark
            let order_price = params.row.order_price*1
            let approve_time_num =  new Date(params.row.approve_time*1000)
            let approve_time  =  approve_time_num.toLocaleDateString().replace(/\//g, "-") + " " + approve_time_num.toTimeString().substr(0, 8)
            if(order_state == 0){
              return h('span', { style: {color: '#19be6b'}}, '未审核')
            }else if (order_state == 1) {
              let str = approve_time +'/已发放'+ order_price.toFixed(2) + '红包'
              return h('span', { style: {color: '#2d8cf0'}}, str )
            }else if (order_state == 2) {
              return h('span', { style: {color: '#2d8cf0'}}, '发放中请等待')
            }else if (order_state == 3) {
              return h('span', { style: {color: 'red'}}, remark )
            }else if (order_state == 4) {
              return h('span', { style: {color: 'red'}}, remark )
            }  
          }
        },
        {
          title: '查看',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                style:{
                  margin:"0"
                },
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-view-img', params)
                  }
                }},
              '查看凭证')
            }, 
          ]
        },
        {
          title: '操作',
          key: 'handle',
          width : 130 ,
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {margin: '0px'},
                on: {
                  'click': () => {
                    vm.$emit('data-handle-return', params)
                  }
                }},
              '驳回')
            },
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {marginLeft: '5px'},
                on: {
                  'click': () => {
                    vm.$emit('data-handle-pass', params)
                  }
                }},
              '发放')
            },
          ]
        },
      ],
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      applyList: [],
      // 评价信息
      evaluateInfo:{},
      showApplyImgList:false,
      applyImgList:[],
      // 
      showApplyReturnModal:false,
      showApplyPassModal:false,
      // 图片
      imgUrl: '',
      visible: false,
      // 驳回原因
      return_remark:{},
      // 发放金额
      apply_money:{},
      // 地区
      zoneList:[],
      // 审批状态
      statusList:[
        {order_state:'', status_name:'全部'},
        {order_state:0, status_name:'未审核'},
        {order_state:1, status_name:'已发放'},
        {order_state:4, status_name:'未通过'},
      ],
    }
  },
  methods: {
    // 选择时间
    selectDate(date){
      this.sreach.start_time = date[0]
      this.sreach.end_time = date[1]
    },
    // 导出
    exportTable(){
      let info =  Object.assign({},this.sreach)
      var str = '';
      for(let k in info){
        str += ( k + '=' + info[k] + "&");
      }
      str = str.substr(0, str.length - 1)
      const href = "./api/UserOrder/export?" + str;
      window.open(href, '_blank')
    },
    // 搜索
    sreachKeyword(){
      this.init({});
    },
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    // 选择新页面
    getNewPage(page){
      this.init({page:page})
    },
    // 查看凭证
    handleViewImg(params){
      this.applyImgList = [];
      this.evaluateInfo= {};
      let voucher = [];
      if(!!params.row.shop_image){
        voucher.push(params.row.shop_image)
      }
      if(!!params.row.comment_image){
        voucher.push(params.row.comment_image)
      }
      if(!!params.row.order_image){
        voucher.push(params.row.order_image)
      }
      this.applyImgList = voucher;
      let order_sn = params.row.order_sn
      searchByOrdersn({order_sn:order_sn}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.evaluateInfo = dbody.data.order
        this.showApplyImgList = true;
      })
    },
    handleApplyReturn(params){
      this.return_remark = {
        id:params.row.id,
        remark:params.row.remark,
        order_state:4,
      };
      this.showApplyReturnModal = true;
    },
    saveApplyReturn(){
      if(!this.return_remark.remark || this.return_remark.remark.length < 2){
        this.$Notice.warning({
          title: "驳回原因错误！"
        })
        return
      }
      changeStateSpreadUserOrdert(this.return_remark).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.init({ page:this.current_page });
      })
    },
    // 
    handleApplyPass(params){
      this.apply_money = {
        id:params.row.id,
        order_price:params.row.order_price,
        order_state:1,
      };
      this.showApplyPassModal = true;
    },
    saveApplyPass(){
      if(this.apply_money.order_price*1 < 1){
        this.$Notice.warning({
          title: "金额错误！"
        })
        return
      }
      changeStateSpreadUserOrdert(this.apply_money).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.init({ page:this.current_page });
      })
    },
    getZoneList(){
      getZoneList().then(res => {
        const dbody = res.data
        // 初始化函数
        this.zoneList = dbody.data || [];
        this.zoneList.unshift({
          id:'',
          area_name:"全部"
        })
      })
    },
    init(data){
      let td = this.sreach;
      let obj = Object.assign({},data,td)
      getSpreadUserOrderList(obj).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.applyList = dbody.data.list || [];
        this.page = dbody.data.page;
      })
    }
  },
  mounted () {
    this.init({});
    this.getZoneList();
  },
  computed: {

  }
}
</script>

<style scoped>
  .img-upload-list{
      display: inline-block;
      width: 60px;
      min-height: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 4px;
  }
  .img-upload-list img{
      width: 100%;
      height: 100%;
  }
  .img-upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .img-upload-list:hover .img-upload-list-cover{
      display: block;
  }
  .img-upload-list-cover i{
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
  }
</style>
