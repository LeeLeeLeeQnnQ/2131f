<template>
	<div>
    <Modal title="预览图" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
		<Modal v-model="showEditStoreBudgetModal" title="本月上缴" :mask-closable="false" width="80%">
      <tables
      :columns="storeBudget_columns"
      v-model="storeBudgetList"
      @voucher-view="showStoreBudgetVoucher"></tables>
    </Modal>
    <tables
      ref="tables"
      v-model="budget_list"
      :columns="budgetColumns"
      style="min-height: 220px;"
      @data-view-list="showEditStoreBudget"/></tables>
    <Page :total="budget_list_page.total" :page-size="budget_list_page.list_rows" style="margin-top:10px;" @on-change="getNewBudgetListPage"/>
    <Modal title="凭证预览" v-model="showStoreBudgetList">
      <div class="img-upload-list" v-for="item in storeBudgetImgList">
        <div>
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          </div>
        </div>
      </div>
    </Modal>
	</div>
</template>

<script>
import { getStoreBillListPage  } from '@/api/kitchen'
import { getStoreBillPayPage , getStoreBillPayList } from '@/api/finance'
import Tables from '_c/tables'
export default {
  name: 'SDBudgetInfo',
  components: {
    Tables
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
      // 图片
      imgUrl: '',
      visible: false,
      kitchen_id:'',
      store_id:'',
      // 工单列表
      budget_list:[],
      budget_list_page:{
        current_page: '',
        last_page: '',
        list_rows: 0,
        total: 0
      },
      budgetColumns: [
        {title: '厨房', key: 'kitchen_name'},
        {title: '月份', key: 'month'},
        {title: '商户', key: 'store_name'},
        {title: '档口号', key: 'store_no'},
        {title: '公摊天数', key: 'day_number'},
        { title: '经营费用',
          render: (h, params) => {
            let operate_fee = params.row.operate_fee;
            let operate_overdue_fee = params.row.operate_overdue_fee;
            let fee = (operate_fee*1 + operate_overdue_fee*1).toFixed(2);
            return h('span', fee)
          }
        },
        { title: '房租',
          render: (h, params) => {
            let rent_fee = params.row.rent_fee;
            let rent_overdue_fee = params.row.rent_overdue_fee;
            let fee = (rent_fee*1 + rent_overdue_fee*1).toFixed(2);
            return h('span', fee)
          }
        },
        {title: '往期未缴', 
          render: (h, params) => {
            let is_new = params.row.new*1;
            let store_account = '';
            if(is_new == 1){
              store_account = params.row.store_account;
            }else{
              store_account = '----';
            }
            return h('span', store_account)
          }
        },
        {
          title: '编辑',
          key: 'handle',
          width :90,
          button: [
            (h, params, vm) => {
              return h('Button', {
                style: {},
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-view-list', params)
                  }
                }},
              '缴费列表')
            }
          ]
        },
        // {title: '操作人', key: 'employee_name'},
        // {title: '创建时间', key: 'create_time'},
        // {title: '缴费金额', key: 'money'},
        // {
        //   title: '查看凭证',
        //   key: 'handle',
        //   button: [
        //     (h, params, vm) => {
        //       return h('Button', {
        //         style: {},
        //         props: {
        //           type: 'primary',
        //           size: 'small'
        //         },
        //         on: {
        //           'click': () => {
        //             vm.$emit('voucher-view', params)
        //           }
        //         }},
        //       '查看凭证')
        //     }
        //   ]
        // },
      ],
      // 展示收支
      showEditStoreBudgetModal:false,
      // 凭证
      showStoreBudgetList:false,
      storeBudgetList:[],
      // 收支表格
      storeBudget_columns:[
        {title: '金额', key: 'money'},
        {title: '操作时间', key: 'create_time'},
        {title: '操作人', key: 'employee_name'},
        {title: '备注', key: 'remark'},
        {
          title: '查看凭证',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                style: {},
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('voucher-view', params)
                  }
                }},
              '查看凭证')
            }
          ]
        },
      ],
      // 照片凭证
      storeBudgetImgList:[],
    }
  },
  methods: {
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
  	initData(){
      if(!this.data.store_id || !this.data.kitchen_id){
        return
      }
      this.store_id = this.data.store_id
      this.kitchen_id = this.data.kitchen_id
      this.initStoreBillinfo({kitchen_id:this.kitchen_id,store_id:this.store_id,});
    },
    // 获取商铺缴费列表
    initStoreBillinfo( data ){
      getStoreBillListPage( data ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg,
          })
          return
        }
        this.budget_list = dbody.data.list || [];
        this.budget_list_page = dbody.data.page;
      })
    },
    // 展示收支列表
    showEditStoreBudget(params){
      let id = params.row.id;
      getStoreBillPayList( { bill_id : id } ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg,
          })
          return
        }
        this.storeBudgetList = dbody.data;
        this.showEditStoreBudgetModal = true;
      })
    },
    // 获取新页面
    getNewBudgetListPage( page ){
      let data = {
        store_id:this.store_id,
        kitchen_id:this.kitchen_id,
        page : page
      }
      this.initStoreBillinfo( data );
    },
    // 展示凭证
    showStoreBudgetVoucher(params){
      let voucher = !!params.row.images ? params.row.images.split(',') : [];
      this.storeBudgetImgList = [];
      this.storeBudgetImgList = voucher;
      this.showStoreBudgetList = true;
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