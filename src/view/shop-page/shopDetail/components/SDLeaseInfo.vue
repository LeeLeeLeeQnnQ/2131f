<template>
	<div>
		<Form :label-width="100">
      <Divider orientation="left" dashed>起租基本资料</Divider>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="月租金(元)" class="cellTit">
            <span v-show="!!leaseinfo.month_rent">{{leaseinfo.month_rent}}</span>
            <span v-show="!leaseinfo.month_rent" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="押金(元)" class="cellTit">
            <span v-show="!!leaseinfo.deposit_fee">{{leaseinfo.deposit_fee}}</span>
            <span v-show="!leaseinfo.deposit_fee" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="入场费(元)" class="cellTit">
            <span v-show="!!leaseinfo.entrance_fee">{{leaseinfo.entrance_fee}}</span>
            <span v-show="!leaseinfo.entrance_fee" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="增容费" class="cellTit">
            <span v-show="!!leaseinfo.zr_fee">{{leaseinfo.zr_fee}}</span>
            <span v-show="!leaseinfo.zr_fee" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="房租账单周期(月)" class="cellTit">
            <span v-show="!!leaseinfo.rent_bill">{{leaseinfo.rent_bill}}</span>
            <span v-show="!leaseinfo.rent_bill" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="首期起租缴纳房租期数" class="cellTit">
            <span v-show="!!leaseinfo.rent_start">{{leaseinfo.rent_start}}</span>
            <span v-show="!leaseinfo.rent_start" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="饿了么上线日期" class="cellTit">
            <span v-show="!!leaseinfo.ele_date">{{leaseinfo.ele_date}}</span>
            <span v-show="!leaseinfo.ele_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset='2'>
          <FormItem label="美团上线日期" class="cellTit">
            <span v-show="!!leaseinfo.meituan_date">{{leaseinfo.meituan_date}}</span>
            <span v-show="!leaseinfo.meituan_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="到期时间" class="cellTit">
            <span v-show="!!leaseinfo.end_date">{{leaseinfo.end_date}}</span>
            <span v-show="!leaseinfo.end_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Divider orientation="left" dashed>租期基本资料</Divider>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="接驳时间"  class="cellTit">
            <span v-show="!!leaseinfo.connect_date">{{leaseinfo.connect_date}}</span>
            <span v-show="!leaseinfo.connect_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset='2'>
          <FormItem label="库房费用(元)" class="cellTit">
            <span v-show="!!leaseinfo.storage_fee">{{leaseinfo.storage_fee}}</span>
            <span v-show="!leaseinfo.storage_fee" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="公摊开始日期" class="cellTit">
            <span v-show="!!leaseinfo.entrance_date">{{leaseinfo.entrance_date}}</span>
            <span v-show="!leaseinfo.entrance_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset='2'>
          <FormItem label="入场日期" class="cellTit">
            <span v-show="!!leaseinfo.join_date">{{leaseinfo.join_date}}</span>
            <span v-show="!leaseinfo.join_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="起租日期" class="cellTit">
            <span v-show="!!leaseinfo.start_date">{{leaseinfo.start_date}}</span>
            <span v-show="!leaseinfo.start_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="店铺电表起始" class="cellTit">
            <span v-if="leaseinfo.start_energy*1 >= 0">{{leaseinfo.start_energy}}</span>
            <span v-else class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="店铺水表起始" class="cellTit">
            <span v-if="leaseinfo.start_water*1 >= 0">{{leaseinfo.start_water}}</span>
            <span v-else class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="公摊结束日期" class="cellTit">
            <span v-show="!!leaseinfo.exit_date">{{leaseinfo.exit_date}}</span>
            <span v-show="!leaseinfo.exit_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Divider orientation="left" dashed>退租基本资料</Divider>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="退租申请日期" class="cellTit">
            <span v-show="!!leaseinfo.apply_date">{{leaseinfo.apply_date}}</span>
            <span v-show="!leaseinfo.apply_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="店铺电表结束" class="cellTit">
            <span v-if="leaseinfo.end_energy*1 >= 0" >{{leaseinfo.end_energy}}</span>
            <span v-else class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="店铺水表结束" class="cellTit">
            <span v-if="leaseinfo.end_water*1 >= 0" >{{leaseinfo.end_water}}</span>
            <span v-else class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">  
        <i-col span="10">
          <FormItem label="租金结束日期" class="cellTit">
            <span v-show="!!leaseinfo.settle_date">{{leaseinfo.settle_date}}</span>
            <span v-show="!leaseinfo.settle_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
    </Form>
	</div>
</template>

<script>
export default {
  name: 'SDLeaseInfo',
  components: {
  },
  props: {
    data:{
      type: Object,
      default () {
        return { }
      }
    },
  },
  data () {
    return {
       leaseinfo:{}
    }
  },
  methods: {
  	initData(){
      if(!this.data.store_id){
        return
      }
      this.leaseinfo = Object.assign({},this.data)
    },
  },
  created () {
    this.initData();
  },
  beforeDestroy () {
    
  },
  watch: {
    data (newV, oldV) {
      this.initData();
    },
  }
}
</script>

<style lang="less" scoped>
  .ivu-tabs-content{
    overflow-x: hidden;
  }
  .tableFooter{
    margin-left: 20px;
  }
  .cellTit{
    margin-bottom: 12px;
    span{
      color:#fff;
      background-color:#3399ff;
      border-radius:5px;
      padding:5px 8px;
      margin-right: 10px;
    }
    .noData{
      background-color: #ff9900;
    }
  }
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