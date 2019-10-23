<template>
  <div>
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
    <Modal 
      v-model="showEditStoreBudgetModal"
      title="本月上缴"
      :mask-closable="false"
      width="80%">
      <tables
        :columns="budget_columns"
        v-model="budget_list"
        @data-delete="deleteStoreBudget"
        @voucher-view="showStoreBudgetVoucher"> 
      </tables>
    </Modal>
    <Modal title="凭证预览" v-model="showStoreBudgetList">
      <div class="img-upload-list" v-for="item in storeBudgetList">
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
import Tables from '_c/tables'
import { getStoreBillPayList   , deleteStoreBillPay } from '@/api/finance'
export default {
  name: 'FSBStoreBudget',
  components: {
    Tables
  },
  props: {
    info:{
      type: Object,
      default () {
        return {
          list:[],
          sreach:'',
        }
      }
    },
    initTable: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      sreachInfo:{},
      // 收支表格
      budget_columns:[
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
        {
          title: '操作',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                style: {},
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-delete', params)
                  }
                }},
              '删除')
            }
          ]
        },
      ],
      budget_list:[],
      // 展示收支
      showEditStoreBudgetModal:false,
      // 凭证
      showStoreBudgetList:false,
      storeBudgetList:[],
      // 图片
      imgUrl: '',
      visible: false,
    }
  },
  methods: {
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    // init
    initData(){
      this.budget_list = this.info.list;
      this.sreachInfo = this.info.sreach;
      this.showEditStoreBudgetModal = true;
    },
    // 展示凭证
    showStoreBudgetVoucher(params){
      let voucher = !!params.row.images ? params.row.images.split(',') : [];
      this.storeBudgetList = [];
      this.storeBudgetList = voucher;
      this.showStoreBudgetList = true;
    },
    // 删除一条收支
    deleteStoreBudget(params){
      let id = params.row.id;
      let bill_id = params.row.bill_id;
      deleteStoreBillPay( { id : id } ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg,
          })
          return
        }
        this.$Notice.warning({
          title: "删除成功！"
        })
        this.initTable(this.sreachInfo)
        getStoreBillPayList( { bill_id : bill_id } ).then(res => {
          const dbody = res.data
          if(dbody.code != 0){
            this.$Notice.warning({
              title: dbody.msg,
            })
            return
          }
          this.budget_list = dbody.data;
        })
      });
    },
    
  },
  mounted () {
    
  },
  beforeDestroy () {
    
  },
  watch: {
    info: {
      handler: function (newV, oldV) {
        this.showEditStoreBudgetModal = {}
        this.initData();
      },
      deep: true
    },
  }
}
</script>
