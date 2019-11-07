<template>
  <div>
    <Card shadow>
      <Row :gutter="20">
        <i-col :xs="4" :md="4" :lg="4">
          <DatePicker type="daterange" placeholder="选择时间段" @on-change="selectDate"></DatePicker>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4">
          <Select v-model="sreach.order_type" clearable placeholder="选择来源">
            <Option v-for="(item,index) in sources" :value="item.id" :key="index">{{ item.title }}</Option>
          </Select>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4">
          <Select
            v-model="sreach.id"
            filterable
            remote
            :remote-method="remoteShopMethod"
            :loading="remoteLoading"
            clearable
            @on-change="selectShopId"
            >
            <Option v-for="item in shopList" :value="item.id" :key="item.id">{{ item.store_name }}</Option>
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
        :current="page.current_page"
        :page-size="page.list_rows"
        style="margin-top:10px;"
        @on-change="getNewPage"/>
    </Card>
    <Modal title="凭证预览" v-model="showBudgetList">
      <div class="img-upload-list" v-for="item in budgetList">
        <div>
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          </div>
        </div>
      </div>
    </Modal>
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// Store/queryList,Comment/index,Comment/show
import { getStoreQueryList } from '@/api/spread'
import { getShopComment , getShopCommentDetail } from '@/api/data'
export default {
  name: 'shopOrderComment',
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
        store_id:'',
        store_name:'',
      },
      // 
      sources:[{id:1,title:"美团"},{id:2,title:"饿了么"}],
      columns: [
        {title: '评论id', key: 'comment_id' },
        {title: '时间', key: 'create_time'},
        {title: '分数', key: 'rating'},
        {title: '订单分数', key: 'order_comment_score'},
        {title: '包装分数', key: 'food_comment_score'},
        {title: '配送分数', key: 'delivery_comment_score'},
        {title: '用户评价', key: 'comment_content'},
        // {
        //   title: '查看图片',
        //   key: 'handle',
        //   width :160,
        //   button: [
        //     (h, params, vm) => {
        //       return h('Button', {
        //         props: {
        //           type: 'primary',
        //           size: 'small'
        //         },
        //         on: {
        //           'click': () => {
        //             vm.$emit('data-view', params)
        //           }
        //         }},
        //       '查看')
        //     },
        //   ]
        // }
      ],
      shopList:[],
      memberList: [],
      remoteLoading:true,
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // showBudgetList
      showBudgetList:false,
      budgetList:[],
      // 图片
      imgUrl: '',
      visible: false,
    }
  },
  methods: {
    // 选择时间
    selectDate(date){
      this.sreach.start_time = date[0]
      this.sreach.end_time = date[1]
    },
    remoteShopMethod (query) {
        if (query !== '') {
          this.remoteLoading = true;
          getStoreQueryList({keyword:query}).then(res => {
            const dbody = res.data
            this.remoteLoading = false;
            if (dbody.code != 0) {
              this.$Notice.warning({
                title: dbody.msg
              })
              return
            }
            this.shopList = dbody.data || [];
          }).catch(err =>{
            this.remoteLoading = false;
          })
        } else {
          this.shopList = [];
        }
    },
    // 列表
    selectShopId(){
      let that = this;
      this.shopList.forEach( function(element, index) {
        if(element.id*1 == that.sreach.store_id*1){
          that.sreach.store_name = element.store_name
        }
      });
    },
    // getNewPage
    getNewPage (page) {
      this.init({ page : page });
    },
    // 搜索
    sreachKeyword(){
      this.init({});
    },
    // 展示凭证
    handleDataView(params){
      // let voucher = !!params.row.images ? params.row.images.split(',') : [];
      // this.budgetList = [];
      // this.budgetList = voucher;
      // this.showBudgetList = true;
      let id = params.row.id;
      getShopCommentDetail({id:id}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
      })
    },
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    // 初始化
    init(data){
      let obj = Object.assign(data,this.sreach)
      getShopComment(data).then(res => {
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
      height: 2.3em;
    }
  }
</style>
<style lang="less">
  .cellTit{
    margin-bottom: 12px;
    span{
      color:#fff;
      background-color:#3399ff;
      border-radius:5px;
      padding:5px 8px;
      margin-right: 10px;
      // color:#464c5b;
      // border:1px solid #464c5b;
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