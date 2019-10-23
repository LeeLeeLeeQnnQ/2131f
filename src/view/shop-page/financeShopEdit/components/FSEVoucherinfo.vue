<template>
  <div>
    <Card shadow>
      <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
      </Modal>
      <Modal v-model="vStartshowModal" title="起租表格编辑" @on-ok="saveVStartModalInfo">
        <Form :model="v_start_modalItem" :label-width="80">
          <FormItem label="项目名称">
            <Select v-model="v_start_modalItem.category_id" @on-change="setVStartModalTitle">
                <Option v-for="item in v_start_workCategoryList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          <FormItem label="收支类型">
            <RadioGroup v-model="v_start_modalItem.rent_type">
                <Radio label="1">应收</Radio>
                <Radio label="2">减免</Radio>
            </RadioGroup>
          </FormItem>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="12">
              <FormItem label="项目金额">
                <Input v-model="v_start_modalItem.money" placeholder="输入金额"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="项目数量">
                <Input v-model="v_start_modalItem.quantity" placeholder="输入数量"></Input>
              </FormItem>
            </i-col>
          </Row>
          <FormItem label="项目备注">
              <Input v-model="v_start_modalItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
          </FormItem>
        </Form>
      </Modal>
      <Form :label-width="100">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="首期应缴款：">
              <h3>{{data.unpaid_fee}}</h3>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="起租凭证">
          <div class="img-upload-list" v-for="item in voucherinfo_pay">
            <img :src="item">
            <div class="img-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemovePayImg(item)"></Icon>
            </div>
          </div>
          <Upload
            ref="voucherinfoPayImg"
            :show-upload-list="false"
            :on-success="handleSuccessPayImg"
            :before-upload="handleBeforeUpload"
            :format="['jpg','jpeg','png']"
            :max-size="2000"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            multiple
            type="drag"
            action="/api/Index/upload"
            style="display: inline-block;width:60px;">
            <div style="width: 60px;height:60px;line-height: 60px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="起租表格">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="24">
              <FormItem>
                <Button type="primary" @click="addVStartTableDataItem">增加一条</Button>
              </FormItem>
            </i-col>
            <i-col span="22" style="margin-top:8px;">
              <Table :columns="v_start_tableColumns" :data="v_start_tableData">
                <div slot="footer" class="tableFooter">
                  <h3>总计： {{ startTableTotal }}</h3>
                </div>
              </Table>
            </i-col>
          </Row>
        </FormItem>
        <FormItem>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem>
                <Button @click="vStartInfoSubmit" type="warning">保存</Button>
              </FormItem>
            </i-col>
          </Row>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import { getShopDetail , getKitchenList , setStartShopEdit , getWorkCategoryList  } from '@/api/data'
export default {
  name: 'FSEVoucherinfo',
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
      // 凭证资料
      voucherinfo:{},
      // 财务凭证
      voucherinfo_pay:[],
      vStartshowModal:false,
      v_start_tableData:[],
      // 获取起租表格下拉选项
      v_start_workCategoryList:[],
      v_start_modalItem:{},
      // 凭证资料表格头
      v_start_tableColumns: [
        {
          title: '名称',
          key: 'title'
        },
        {
          title: '收支',
          key: 'rent_type',
          render: (h, params) => {
            return h('strong', params.row.rent_type == '1' ? '应收' : '减免')
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
                attrs:{
                  style:"",
                },
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.removeVEndTableDataItem(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      v_end_tableData:[],
      // 图片
      imgUrl: '',
      visible: false,
    }
  },
  methods:{
    getWorkCategoryList(){
      getWorkCategoryList( "7" ).then(res => {
        const dbody = res.data
        this.v_start_workCategoryList = dbody.data || [];
      })
    },
    //初始化数据
    initData ( data ) {
      if(!this.data.store_id){
        return
      }
      //厨房  商户名 档口号
      this.initVoucherinfo(this.data);
    },
     // 验证表格信息
    formModalInfo: function (obj) {
      obj.title = obj.title.trim()
      obj.money = (obj.money * 1).toFixed(2)
      let priceReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!obj.title) {
        this.$Notice.warning({
          title: '请输入正确名称！'
        })
        return true
      }
      if (!obj.rent_type) {
        this.$Notice.warning({
          title: '请选择正确收支选项！'
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
    // 发送触发
    handleBeforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
      }
    },
    // 图片错误提示
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件 ' + file.name + ' 格式错误, 请上传jpg／jpeg／png格式.'
      })
    },
    // 图片超大提示
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超过最大限制',
        desc: '文件  ' + file.name + ' 过大, 不能超过 2M.'
      })
    },
    // 删除起租凭证图片
    handleRemovePayImg (file) {
      this.voucherinfo_pay.splice(this.voucherinfo_pay.indexOf(file), 1)
    },
    // 获取起租凭证图片
    handleSuccessPayImg (res, file) {
      if (res.code == 0) {
        if(!this.voucherinfo_pay){
          this.voucherinfo_pay = [];
        }
        this.voucherinfo_pay.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    //起租表格编辑
    addVStartTableDataItem(){
      this.v_start_modalItem = {
        category_id:'',
        title: '',
        rent_type: 1,
        money: '',
        remark: '',
        quantity: 1
      };
      this.vStartshowModal = true;
    },
    //删除表格信息 
    removeVEndTableDataItem(index){
      this.v_start_tableData.splice(index, 1)
    },
    // 起租弹窗下啦事件
    setVStartModalTitle(){
      let that = this;
      let id = this.v_start_modalItem.category_id;
      this.v_start_workCategoryList.forEach( function( item ) {
        if( item.id ==  id ){
          that.v_start_modalItem.title = item.title;
          return;
        }
      });
    },
    // 保存起租表格信息
    saveVStartModalInfo(){
      if (this.formModalInfo(this.v_start_modalItem)) {
        return
      }
      this.v_start_tableData.push(this.v_start_modalItem)
    },
    // 保存签约凭证起租信息
    vStartInfoSubmit(){
      let info = {
        kitchen_id:this.data.kitchen_id,
        store_id:this.data.store_id,
      }
      info.rent = this.v_start_tableData;
      info.pay = this.voucherinfo_pay.length > 0 ? this.voucherinfo_pay.join(",") : '';
      setStartShopEdit( info ).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.$Notice.warning({
            title: '信息提交完成！'
          })
          setTimeout(()=>{
            this.$router.go(-1)
          }, 1000)
        } else {
          this.$Notice.warning({
            title: dbody.msg
          })
        }
      })
    },
    
    // 工具函数
    // 清除空值
    trimNull (array) {
      if(array.length <= 0){
        return null;
      }
      for (var i = 0; i < array.length; i++) {
        if (array[i] == '' || typeof (array[i]) === 'undefined') {
          array.splice(i, 1)
          i = i - 1
        }
      }
      return array;
    },
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    // 签约凭证卡片
    initVoucherinfo( data ){
      // 起租表格
      this.getStartTable( data );
      // 起租财务上传凭证
      this.voucherinfo_pay = this.trimNull(data.pay.split(',')) || [];
    },
    // 获取起租表格
    getStartTable( data ){
      getShopDetail({id: data.store_id, lease_type: 1}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: "起租表格数据获取失败！"
          })
          return
        }
        this.v_start_tableData =  dbody.data.rent || [];
      })
    },
  },
  computed: {
    startTableTotal:function() {
      if (this.v_start_tableData.length > 0) {
        let t = 0
        this.v_start_tableData.forEach(function (i, j) {
          if (i.rent_type == '1') {
            t += 1 * i.money * i.quantity
          } else {
            t -= 1 * i.money * i.quantity
          }
        })
        return t.toFixed(2)
      } else {
        return '0.00'
      }
    },
  },
  created () {
    this.initData();
    this.getWorkCategoryList();
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
  .tableFooter{
    margin-left: 20px;
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