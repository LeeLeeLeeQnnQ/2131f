<template>
  <div>
    <Modal v-model="showAddModal" title="罚款登记" @on-ok="saveAddModalInfo" @on-cancel="cancelAddModalInfo">
        <Form :model="addItem" :label-width="80" inline>
          <FormItem label="商户选择">
            <div>
              <Select v-model="shopSelect" style="width: 300px" v-if="shopList.length > 0">
                  <Option v-for="item in shopList" :value="item.store_id" :key="item.store_id">{{item.store_no}} / {{item.store_name}}</Option>
              </Select>
              <div v-else>
                <Input  placeholder="厨房下无商户" style="width: 300px" readonly />
              </div>
            </div>
          </FormItem>
          <FormItem label="图片上传" style="width: 200px">
            <div class="img-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="img-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="4200"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              action="/api/Index/upload"
              style="display: inline-block;width:60px;">
              <div style="width: 60px;height:60px;line-height: 60px;">
                  <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="罚款">
            <Input v-model="addItem.amount" placeholder="输入罚款金额" style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
    <Modal v-model="showModal" title="罚款登记">
        <Form :model="showItem" :label-width="80" inline>
          <FormItem label="档口">
            <div>
               <Input v-model="showItem.store_no" placeholder="档口" style="width: 300px" readonly/>
            </div>
          </FormItem>
          <FormItem label="商户">
            <div>
               <Input v-model="showItem.store_name" placeholder="商户" style="width: 300px" readonly/>
            </div>
          </FormItem>
          <FormItem label="图片上传" style="width: 200px">
            <div class="img-upload-list" v-for="item in showUploadList">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </FormItem>
          <FormItem label="罚款金额">
            <Input v-model="showItem.amount" readonly style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
    <Card shadow>
      <Row :gutter="20">
        <i-col :xs="5" :md="5" :lg="5">
          <Select v-model="kitchenKey" @on-change="selectKichen">
            <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
          </Select>
        </i-col>
      </Row>
    </Card>
    <Card style="margin-top: 5px;padding-top: 2em;">
      <a href="#" slot="extra" @click.prevent="showAddModalFn">
          添加一个罚款
      </a>
      <tables 
        :stripe="true" 
        ref="tables" 
        v-model="fineList" 
        :columns="columns" 
        @data-view="handleItemView" 
        @data-dele="handleDele" />
      <Page 
        :current="page.current_page*1" 
        :total="page.total" 
        :page-size="page.list_rows" 
        style="margin-top:10px;" 
        @on-change="getNewPage"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// /api/Index/getKitchenList,/api/StoreLease/queryList,/api/StoreFine/index,getStoreFineList,/api/StoreFine/add,api/StoreFine/show,/api/StoreFine/delete
import { getKitchenList, getStoreList } from '@/api/data'
import { getStoreFineList , addStoreFine , showStoreFine  , deleteStoreFine } from '@/api/kitchen'
export default {
  name: 'kitchenShopFine',
  components: {
    Tables
  },
  data () {
    return {
      kitchenList: [],
      addItem:{},
      showItem:{},
      showModal:false,
      money_money:'',
      showAddModal:false,
      showUploadList:[],
      kitchenKey:'',
      fineList:[],
      shopSelect:'',
      shopList:[],
      columns: [
        {title: '所属厨房', key: 'kitchen_name'},
        {title: '档口号', key: 'store_no'},
        {title: '店铺名称', key: 'store_name'},
        {title: '罚款', key: 'amount'},
        {title: '登记时间', key: 'create_time'},
        {title: '操作人', key: 'creator_name'},
        {
          title: '操作',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                style: {margin: '0'},
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
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-dele', params)
                  }
                }
              }, [
                h('Button', {
                  style:{margin: '0 0 0 1em'},
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                }, '删除')
              ])
            },
          ]
        }
      ],
      page: {
        curmoney_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      mTime:'',
      // 图片
      imgUrl: '',
      visible: false,
      // 图片上传列表
      uploadList: [],
    }
  },
  methods: {
    handleItemView(params){
      let id = params.row.id
      showStoreFine( id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.showItem = {};
        this.showUploadList = [];
        this.showItem.store_no = dbody.data.store_no;
        this.showItem.store_name = dbody.data.store_name;
        this.showItem.amount = dbody.data.amount;
        this.showUploadList = dbody.data.images.split(',');
        this.showModal = true;
      })
    },
    handleDele(params){
      let id = params.row.id
      let that = this
      deleteStoreFine( id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.fineList.forEach( function(element, index) {
          if(element.id == id){
            that.fineList.splice(index,1);
            return
          }
        });
      })
    },
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    // 删除图片
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.uploadList.splice(fileList.indexOf(file), 1)
    },
    // 获取图片
    handleSuccess (res, file) {
      if (res.code == 0) {
        let obj = {}
        obj.url = res.data
        obj.status = 'finished'
        obj.showProgress = false
        this.uploadList.push(obj)
      }
    },
    // 错误提示
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件 ' + file.name + ' 格式错误, 请上传jpg／jpeg／png格式.'
      })
    },
    // 超大提示
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超过最大限制',
        desc: '文件  ' + file.name + ' 过大, 不能超过 4M.'
      })
    },
    // 发送触发
    handleBeforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
      }
    },
    selectDate(date){
      this.mTime = date;
    },
    // 取消
    cancelAddModalInfo () {
      this.addItem = {}
    },
    // 新增
    saveAddModalInfo () {
      this.addItem.kitchen_id = this.kitchenKey;
      this.addItem.store_id = this.shopSelect;
      this.addItem.fine_type = 2;
      if(!this.addItem.store_id){
        this.$Notice.warning({
          title: '请选择店铺！！'
        })
        return;
      }
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if(!reg.test(this.addItem.amount*1)){
        this.$Notice.warning({
          title: '请输入有效金额！！'
        })
        return;
      }
      if(this.uploadList.length <= 0){
        this.$Notice.warning({
          title: '请上传凭证！！'
        })
        return;
      }
      let arr = [];
      this.uploadList.forEach( function(element, index) {
        arr.push(element.url)
      });
      this.addItem.images = arr.join(",");
      addStoreFine( this.addItem ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
            title: "添加成功！"
          })
        this.addItem = {};
        let obj = {
          kitchen_id: this.kitchenKey,
          page: 1,
        }
        this.getStoreFineList( obj );
      })
    },
    selectKichen(){
      let obj = {
        kitchen_id: this.kitchenKey,
        page: 1,
      }
      this.getStoreFineList( obj );
      this.getStoreList();
    },
    // 获取页面
    getNewPage (page) {
      if(!this.mTime){
        this.$Notice.warning({
          title: "请选择月份！"
        })
        return
      }
      let obj = {
        kitchen_id: this.kitchenKey,
        page: page,
      }
      this.getStoreFineList( obj );
    },
    // 获取列表
    getStoreFineList( obj ){
      getStoreFineList( obj ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Message.warning(dbody.msg)
          return
        }
        this.page = dbody.data.page
        if(!dbody.data.list){
          return
        }
        this.fineList = dbody.data.list || []
      })
    },
    showAddModalFn(){
      this.addItem = {};
      this.uploadList = [];
      this.showAddModal = true;
    },
    // // 依据厨房获取店铺
    getStoreList () {
      const id = this.kitchenKey
      getStoreList(id).then(res => {
        const dbody = res.data
        this.shopList = dbody.data || [];
      })
    },
  },
  mounted () {
    getKitchenList().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Message.warning(dbody.msg)
        return
      }
      this.kitchenList = dbody.data || [];
      this.kitchenKey = this.kitchenList[this.kitchenList.length - 1].id;
      this.getStoreList();
      let obj = {
        kitchen_id: this.kitchenKey,
      }
      this.getStoreFineList( obj );
    })
  },
}
</script>

<style lang="less">
  .tableFooter{
    margin-left: 20px;
  }
  .img-upload-list{
      display: inline-block;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transpamoney;
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
