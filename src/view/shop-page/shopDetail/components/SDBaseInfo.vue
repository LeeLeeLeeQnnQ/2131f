<template>
	<div>
		<Form :label-width="100">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="店铺名称" class="cellTit">
              <span v-show="!!baseinfo.store_name">{{baseinfo.store_name}}</span>
              <span v-show="!baseinfo.store_name" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="签约时间" class="cellTit">
              <span v-show="!!baseinfo.sign_date">{{baseinfo.sign_date}}</span>
              <span v-show="!baseinfo.sign_date" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="客户ID" class="cellTit">
              <span v-show="!!baseinfo.customer_id">{{baseinfo.customer_id}}</span>
              <span v-show="!baseinfo.customer_id" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="店主姓名" class="cellTit">
              <span v-show="!!baseinfo.shopkeeper">{{baseinfo.shopkeeper}}</span>
              <span v-show="!baseinfo.shopkeeper" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="店铺电话" class="cellTit">
              <span v-show="!!baseinfo.shopkeeper_phone">{{baseinfo.shopkeeper_phone}}</span>
              <span v-show="!baseinfo.shopkeeper_phone" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="负责店长" class="cellTit">
              <span v-show="!!baseinfo.manage_name">{{baseinfo.manage_name}}</span>
              <span v-show="!baseinfo.manage_name" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="招商经理" class="cellTit">
              <span v-show="!!baseinfo.manage_lease">{{baseinfo.manage_lease}}</span>
              <span v-show="!baseinfo.manage_lease" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="所属厨房" class="cellTit">
              <span v-show="!!baseinfo.kitchen_name">{{baseinfo.kitchen_name}}</span>
              <span v-show="!baseinfo.kitchen_name" class="noData">未填写</span>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="档口选择" class="cellTit">
              <span v-show="!!baseinfo.store_no">{{baseinfo.store_no}}</span>
              <span v-show="!baseinfo.store_no" class="noData">未填写</span>
          </FormItem>
        </i-col>
      </Row>
    </Form>
	</div>
</template>

<script>
export default {
  name: 'SDBaseInfo',
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
       baseinfo:{}
    }
  },
  methods: {
  	initData(){
      if(!this.data.store_id){
        return
      }
      this.baseinfo = Object.assign({},this.data)
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