<template>
  <div>
    <Modal v-model="showModal" title="编辑表格" @on-ok="saveModalInfo">
        <Form :model="modalItem" :label-width="80">
          <FormItem label="项目名称">
            <Select v-model="modalItem.category_id" @on-change="setModalTitle">
                <Option v-for="item in workCategoryList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="12">
              <FormItem label="项目金额">
                <Input v-model="modalItem.money" placeholder="输入金额"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="项目数量">
                <Input v-model="modalItem.quantity" placeholder="输入数量"></Input>
              </FormItem>
            </i-col>
          </Row>
          <FormItem label="项目备注">
              <Input v-model="modalItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
          </FormItem>
        </Form>
    </Modal>
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
    <Card title="厨房支出" shadow>
      <Form ref="formItem" :model="formItem" :label-width="80">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="12">
            <FormItem label="标题" prop="title">
                <Input v-model="formItem.title" placeholder="输入标题" style="width: 400px"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="类别选择">
              <Select style="width: 200px" v-model="formItem.expend_type" @on-change="tagSelect">
                  <Option v-for="(item,index) in tagList" :value="item.type" :key="item.type">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="10"  offset="2" v-show="isShowKitchenList">
            <FormItem label="厨房选择" prop="kitchenSelect">
              <Select v-model="formItem.kitchenSelect" style="width: 200px">
                  <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="20">
            <FormItem label="图片上传">
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
              <Modal title="预览图" v-model="visible">
                  <img :src="imgUrl" v-if="visible" style="width: 100%">
              </Modal>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="24">
            <FormItem label="支出">
              <Button type="primary" @click="showModal = true">增加一条</Button>
            </FormItem>
          </i-col>
          <i-col span="22">
            <FormItem>
              <Table :columns="tableColumns" :data="tableData">
                <div slot="footer" class="tableFooter">
                  <h3>总计： {{ tableTotal }}</h3>
                </div>
              </Table>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <FormItem label="备注" prop="textarea">
              <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <FormItem>
            <Button @click="handleSubmit('formItem')" type="primary">提交</Button>
          </FormItem>
        </Row>
      </Form>
    </Card>
  </div>
</template>

<script>
//权限
// /api/Index/getKitchenList,/api/StoreLease/queryList,/api/Index/getWorkCategory,/api/KitchenExpend/index,/api/KitchenExpend/show,/api/KitchenExpend/edit
import { getKitchenList, getStoreList , getWorkCategoryList } from '@/api/data'
import { getKitchenExpendList , showKitchenExpend , editKitchenExpend , getExpendType } from '@/api/finance'
export default {
  name: 'financeKitchenExpendItemEdit',
  data () {
    return {
      isShowKitchenList:false,
      // 表格
      tableColumns: [
        {
          title: '名称',
          key: 'title'
        },
        {
          title: '收支',
          key: 'pay_type',
          render: (h, params) => {
            return h('strong','支出');
          }
        },
        {
          title: '数量',
          key: 'quantity'
        },
        {
          title: '金额',
          key: 'money'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'handle',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.removeItem(params.index)
                    this.tableTotal = this.getTableSum()
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      // select选项
      // 厨房选择列表
      kitchenList: [],
      shopList: [],
      orderTag: [
        {title: '普通', key: '1'},
        {title: '紧急', key: '2'}
      ],
      // 列表提交项
      formItem: {},
      // 表哥数据
      tableData: [],
      // 表哥计算total
      tableTotal: '0.00',
      // 表哥弹窗
      showModal: false,
      // 表哥单元存储
      modalItem: {
        category_id:'',
        title: '',
        money: '',
        remark: '',
        quantity: 1
      },
      // 图片
      imgUrl: '',
      visible: false,
      // 图片上传列表
      uploadList: [],
      workCategoryList:[],
      //报账日期 
      expense_date:'',
      tagList:[],
    }
  },
  methods: {
    // tagSelect
    tagSelect(expend_type){
      let data = this.tagList.filter(item => 
        item.type == expend_type
      );
      this.formItem.category_id = data[0].category_id;
      this.formItem.expend_type = data[0].type;
      if(this.formItem.category_id == 1){
        this.isShowKitchenList = true;
      }
      if(this.formItem.category_id == 2){
        this.isShowKitchenList = false;
        this.formItem.kitchenSelect = '';
      }
    },
    // 选择报账日期
    selectExpenseDate( date ){
      this.formItem.expense_date = date;
    },
    setModalTitle(){
      let that = this;
      let id = this.modalItem.category_id;
      this.workCategoryList.forEach( function( item ) {
        if( item.id ==  id ){
          that.modalItem.title = item.title;
          return;
        }
      });
    },
    // 保存表格信息
    saveModalInfo: function () {
      if (this.formModalInfo(this.modalItem)) {
        return
      }
      this.tableData.push(this.modalItem)
      this.tableTotal = this.getTableSum()
      this.modalItem = {
        category_id:'',
        title: '',
        money: '',
        remark: '',
        quantity: 1
      }
    },
    // 验证表格信息
    formModalInfo: function (obj) {
      obj.money = (obj.money * 1).toFixed(2)
      let priceReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!obj.title) {
        this.$Notice.warning({
          title: '请输入正确名称！'
        })
        return true
      }
      if (!obj.quantity || (obj.quantity <= 0)) {
        this.$Notice.warning({
          title: '请正确输入数量！'
        })
        return true
      }
      if (!obj.money || obj.money * 1 <= 0 || !priceReg.test(obj.money)) {
        this.$Notice.warning({
          title: '请输入正确金额！'
        })
        return true
      };
      return false
    },
    // 提交验证器
    submitValidateField: function (obj) {
      if (!obj.title) {
        this.$Notice.warning({
          title: '请输入正确标题！'
        })
        return false
      }
      obj.title = obj.title.trim();
      if (!obj.expense_date) {
        this.$Notice.warning({
          title: '请输入报销时间！'
        })
        return false
      }
      if(!obj.expend_type || !obj.category_id){
        this.$Notice.warning({
          title: '请输入支出类别！'
        })
        return false
      }
      if (!obj.kitchenSelect && obj.category_id != 2) {
        this.$Notice.warning({
          title: '请选择厨房！'
        })
        return false
      }
      obj.textarea = (!!obj.textarea && obj.textarea.length) > 0 ? obj.textarea.trim() : '';
      if (obj.tableData.length <= 0) {
        this.$Notice.warning({
          title: '请填写表格内容！'
        })
        return false
      }
      return true
    },
    // 删除表格信息
    removeItem (index) {
      this.tableData.splice(index, 1)
    },
    // 获取表格总计
    getTableSum () {
      if (this.tableData.length > 0) {
        let t = 0
        this.tableData.forEach(function (i, j) {
            t -= 1 * i.money * i.quantity
        })
        return t.toFixed(2)
      } else {
        return '0.00'
      }
    },
    // 提交工单按钮
    handleSubmit (name) {
      this.formItem.tableData = this.tableData
      if (this.submitValidateField(this.formItem)) {
        this.setOrderInfo(this.formItem)
      }
    },
    // 发送数据
    setOrderInfo (info) {
      let data = {}
      let that = this
      data.id = info.id
      data.title = info.title
      data.kitchen_id = info.kitchenSelect
      data.expend_date = info.expense_date
      data.expend_type = info.expend_type
      data.category_id = info.category_id
      data.remark = info.textarea
      data.images = info.uploadList
      data.list = info.tableData || {}
      data.money = Math.abs(that.tableTotal);
      data.work_id = "0"
      let imagesArr = []
      this.uploadList.forEach(function (item) {
        imagesArr.push(item.url)
      })
      data.images = imagesArr.join(',')
      editKitchenExpend(data).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.$Notice.warning({
            title: '提交完成！'
          })
          setTimeout(function () {
            that.$router.go(-1)
          }, 1500)
        } else {
          this.$Notice.warning({
            title: dbody.msg
          })
        }
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
    initData( id ){
      let that = this;
      showKitchenExpend( id ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        let data = dbody.data;
        this.formItem.id = id
        this.formItem.title = data.title
        this.formItem.expense_date = data.expend_date
        this.formItem.expend_type = data.expend_type
        if( this.formItem.expend_type != 2){
          this.isShowKitchenList = true;
          this.formItem.kitchenSelect = data.kitchen_id
        }
        let arr = !!data.images ? data.images.split(",") : [];
        arr.forEach( function(element, index) {
          let obj = {}
          obj.url = element
          obj.status = 'finished'
          obj.showProgress = false
          that.uploadList.push(obj)
        });
        this.tableData = data.list
        this.formItem.textarea = data.remark
        this.tableTotal = (0 - data.money).toFixed(2)
      })
    },
    getExpendType(){
      getExpendType( ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.tagList = dbody.data;
      })
    }
  },
  computed: {
  },
  watch: {
  },
  created: function () {
    // 获取id
    let id = this.$route.query.id
    this.$nextTick(function () {
      getKitchenList().then(res => {
        const dbody = res.data
        this.kitchenList = dbody.data || [];
      })
      getWorkCategoryList( "5" ).then(res => {
        const dbody = res.data
        this.workCategoryList = dbody.data || [];
      })
      this.getExpendType();
      setTimeout(()=>{
        this.initData( id );
      },500)
    })
  }
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
