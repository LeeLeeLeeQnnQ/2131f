<template>
  <div>
    <Card title="店铺预档案" shadow>
      <Form ref="formItem" :model="formItem" :label-width="80"  :rules="ruleValidate">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="店铺名称" prop="store_name">
              <Input v-model="formItem.store_name" placeholder="输入店铺名称"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="签约时间" prop="sign_date">
              <DatePicker :value="formItem.sign_date" format="yyyy-MM-dd" type="date" placeholder="签约时间" style="width: 200px" @on-change="setSignDate" ></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="10" offset="2">
            <FormItem label="客户ID" prop="customer_id">
              <Input v-model="formItem.customer_id" disabled placeholder="客户ID"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="店主姓名" prop="shopkeeper">
                <Input v-model="formItem.shopkeeper" placeholder="输入店铺负责人信息"></Input>
            </FormItem>
          </i-col>
          <i-col span="10" offset="2">
            <FormItem label="店铺电话" prop="shopkeeper_phone">
                <Input v-model="formItem.shopkeeper_phone" placeholder="输入店铺联系电话"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10" >
            <FormItem label="招商经理" prop="manage_lease_id">
                 <Select
                  v-model="formItem.manage_lease_id"
                  filterable
                  remote
                  clearable
                  :remote-method="remoteLeaseMethod"
                  :loading="remoteLoading"
                  @on-change="selectmanageLease"
                  >
                  <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
                </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="所属厨房" prop="kitchen_id">
                <Select v-model="formItem.kitchen_id" @on-change="selectKitchen">
                  <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="10" offset="2">
            <FormItem label="档口选择" prop="store_no">
              <Select v-model="formItem.store_no">
                  <Option v-for="item in shopList" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="月租金" prop="month_rent">
              <Input v-model="formItem.month_rent" placeholder="输入月租金"></Input>
            </FormItem>
          </i-col>
           <i-col span="10" offset="2">
            <FormItem label="押金" prop="deposit_fee">
              <Input v-model="formItem.deposit_fee" placeholder="输入押金"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="入场费" prop="entrance_fee">
              <Input v-model="formItem.entrance_fee" placeholder="输入入场费"></Input>
            </FormItem>
          </i-col>
           <i-col span="10" offset="2">
            <FormItem label="增容费" prop="zr_fee">
              <Input v-model="formItem.zr_fee" placeholder="输入增容费"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="收费周期" prop="rent_bill">
              <Input v-model="formItem.rent_bill" placeholder="房租收费周期／月"></Input>
            </FormItem>
          </i-col>
           <i-col span="10" offset="2">
            <FormItem label="首期期数" prop="rent_start">
              <Input v-model="formItem.rent_start" placeholder="首期起租缴纳房租期数／月"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="20">
            <FormItem label="转账凭证上传">
              <div class="img-upload-list" v-for="item in uploadList">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleUploadListRemove(item)"></Icon>
                </div>
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccessUploadImg"
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
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="20">
            <FormItem label="意向合同">
              <div class="img-upload-list" v-for="item in contract">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveContractImg(item)"></Icon>
                </div>
              </div>
              <Upload
                ref="contractImg"
                :show-upload-list="false"
                :on-success="handleSuccessContractImg"
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
          </i-col>
        </Row>

        <Row type="flex" justify="start" align="middle" :gutter="20">
          <FormItem>
            <Button @click="handleSubmit('formItem')" type="primary">修改</Button>
          </FormItem>
        </Row>
      </Form>
    </Card>
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
//权限
// /api/StoreLease/add,/api/Index/getKitchenList,/api/Index/getStoreNo,/api/Index/getEmployeeList,/api/Index/getWorkCategory,Clue/existCustomer
import {  editPreBuildItem , showPreBuildItem } from '@/api/canvass'
import { getKitchenList, getStoreNoList, getLeasingList ,getWorkCategoryList , isExistCustome } from '@/api/data'
export default {
  name: 'canvassShopPreBuildEdit',
  data () {
    return {
      // 表哥数据
      // 列表提交项
      formItem: {
        store_name: '',
        shopkeeper: '',
        shopkeeper_phone: '',
        manage_lease_id: '',
        manage_lease: '',
        kitchen_id: '',
        store_no: '',
      },
      // 验证数据
      ruleValidate: {
        store_name: [
          { required: true, message: '店铺姓名不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '标题不能超过50个字', trigger: 'blur' }
        ],
        sign_date: [
          { required: true, message: '签约时间不能为空', trigger: 'blur' },
        ],
        customer_id: [
          { required: true, message: '客户ID不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '标题不能超过50个字', trigger: 'blur' }
        ],
        shopkeeper: [
          { required: true, message: '店铺联系人姓名不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '店铺联系人姓名不能超过50个字', trigger: 'blur' }
        ],
        shopkeeper_phone: [
          { required: true, message: '店铺联系人手机号不能为空', trigger: 'blur' }
        ],
        manage_lease_id: [
          { required: true, message: '招商经理不能为空', trigger: 'change' }
        ],
        kitchen_id: [
          { required: true, message: '请选择厨房', trigger: 'change' }
        ],
        store_no: [
          { required: true, message: '请选择档口号', trigger: 'change' }
        ],
        month_rent:[
          { required: true, message: '填写月租金', trigger: 'change' }
        ],
        deposit_fee:[
          { required: true, message: '填写押金', trigger: 'change' }
        ],
        entrance_fee:[
          { required: true, message: '填写入场费', trigger: 'change' }
        ],
        zr_fee:[
          { required: true, message: '填写增容费', trigger: 'change' }
        ],
        rent_bill:[
          { required: true, message: '房租账单周期', trigger: 'change' }
        ],
        rent_start:[
          { required: true, message: '首期起租缴纳房租期数', trigger: 'change' }
        ]
      },
      // 招商经理列表
      leasingList: [],
      remoteLoading:false,
      // leasingList:[],
      // 厨房列表
      kitchenList: [],
      // 档口列表
      shopList: [],

      // 图片
      imgUrl: '',
      visible: false,
      // 财务凭证
      uploadList: [],
      // 合同照片
      contract:[],
      workCategoryList:[],
    }
  },
  methods: {
    remoteLeaseMethod (query) {
        if (query !== '') {
          this.remoteLoading = true;
          getLeasingList({keyword:query}).then(res => {
            const dbody = res.data
            this.remoteLoading = false;
            if (dbody.code != 0) {
              this.$Notice.warning({
                title: dbody.msg
              })
              return
            }
            this.leasingList = dbody.data || [];
          }).catch(err =>{
            this.remoteLoading = false;
          })
        } else {
          this.leasingList = [];
        }
    },
    // 设置签约时间
    setSignDate(date){
      this.formItem.sign_date = date;
    },
    // 客户是否存在
    isExistCustome(obj){
      let info = { customer_id : obj.customer_id }
      isExistCustome( info ).then(res => {
        let dbody = res.data;
        if (dbody.code == 0) {
          let data = dbody.data;
          if(!!data){
            if (this.submitValidateField(obj)) {
              this.setOrderInfo(obj)
            }
            return true
          }else{
            this.$Notice.warning({
              title: '请输入正确客户ID！'
            })
            return false
          }
        }else{
          this.$Notice.warning({
            title: '请输入正确客户ID！'
          })
          return false
        }
      })
    },
    // 提交验证器
    submitValidateField(obj) {
      obj.store_name = obj.store_name.trim()
      let priceReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!obj.store_name) {
        this.$Notice.warning({
          title: '请输入正确标题！'
        })
        return false
      }
      if (!obj.sign_date) {
        this.$Notice.warning({
          title: '请选择正确签约时间！'
        })
        return false
      }
      if (!obj.shopkeeper) {
        this.$Notice.warning({
          title: '请输入正确店主信息！'
        })
        return false
      }
      let phoneReg = /^1\d{10}$/
      if (!obj.shopkeeper_phone || !phoneReg.test(obj.shopkeeper_phone)) {
        this.$Notice.warning({
          title: '请输入正确店主手机号！'
        })
        return false
      }
      if (!obj.manage_lease_id || !obj.manage_lease) {
        this.$Notice.warning({
          title: '请选择招商经理！'
        })
        return false
      }
      if (!obj.kitchen_id) {
        this.$Notice.warning({
          title: '请选择厨房！'
        })
        return false
      }
      if (!obj.store_no) {
        this.$Notice.warning({
          title: '请选择档口号！'
        })
        return false
      }
      if (obj.pay.length <= 0) {
        this.$Notice.warning({
          title: '请上传财务凭证！'
        })
        return false
      }
      if (obj.pay.contract <= 0) {
        this.$Notice.warning({
          title: '请上传合同凭证！'
        })
        return false
      }
      if (!obj.rent_bill || isNaN(obj.rent_bill)) {
        this.$Notice.warning({
          title: '请填写房租账单周期！'
        })
        return false
      }
      if (!obj.rent_start || isNaN(obj.rent_start)) {
        this.$Notice.warning({
          title: '请填写首期起租缴纳房租期数！'
        })
        return false
      }
      if (!obj.month_rent || obj.month_rent * 1 <= 0 || !priceReg.test(obj.month_rent)) {
        this.$Notice.warning({
          title: '请输入正确租金！'
        })
        return false
      };
      if (!obj.deposit_fee || obj.deposit_fee * 1 <= 0 || !priceReg.test(obj.deposit_fee)) {
        this.$Notice.warning({
          title: '请输入正确押金！'
        })
        return false
      };
      if ( obj.entrance_fee * 1 < 0 || !obj.entrance_fee ||  !priceReg.test(obj.entrance_fee)) {
        this.$Notice.warning({
          title: '请输入正确入场费！'
        })
        return false
      };
      if ( obj.zr_fee * 1 < 0 || !obj.zr_fee ||  !priceReg.test(obj.zr_fee)) {
        this.$Notice.warning({
          title: '请输入正确增容费！'
        })
        return false
      };
      return true
    },
    // 提交工单按钮
    handleSubmit () {
      this.formItem.pay = this.uploadList
      this.formItem.contract = this.contract
      this.formItem.rent = this.tableData
      this.isExistCustome(this.formItem)
    },
    // 发送数据
    setOrderInfo (info) {
      let arr = []
      let that = this
      info.pay = info.pay.join(',')
      info.contract = info.contract.join(',')

      delete info.create_time 
      delete info.update_time 

      editPreBuildItem(info).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.$Notice.warning({
            title: '修改完成！'
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
    handleUploadListRemove (file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1)
    },
    handleRemoveContractImg (file) {
      this.contract.splice(this.uploadList.indexOf(file), 1)
    },
    // 获取图片
    handleSuccessUploadImg (res, file) {
      if (res.code == 0) {
        if(!this.contract){
          this.uploadList = [];
        }
        this.uploadList.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    // 获取起租凭证图片
    handleSuccessContractImg (res, file) {
      if (res.code == 0) {
        if(!this.contract){
          this.contract = [];
        }
        this.contract.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    // 删除证件图片
    handleRemoveIdentityImg(file) {
      this.identity.splice(this.identity.indexOf(file), 1)
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
    // 依据厨房获取店铺
    selectKitchen () {
      const id = this.formItem.kitchen_id
      let that = this
      this.kitchenList.forEach(function (item) {
        if (item.id == id) {
          that.formItem.kitchen_name = item.kitchen_name
        }
      })
      let obj = { kitchen_id:id }
      getStoreNoList( obj ).then(res => {
        const dbody = res.data
        this.shopList = dbody.data
      })
    },
    // 依据招商ID获取店长姓名
    selectmanageLease () {
      let key = this.formItem.manage_lease_id
      let that = this
      this.leasingList.forEach(function (item) {
        if (item.id == key) {
          that.formItem.manage_lease = item.fullname
        }
      })
    },
    // showPreBuildItem
    showPreBuildItem(){
      let obj = { id:this.formItem.id }
      let that = this
      showPreBuildItem( obj ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          setTimeout(function (argument) {
            that.$router.go(-1)
          }, 1000)
          return
        }
        let obj = {
          id:dbody.data.manage_lease_id,
          fullname:dbody.data.manage_lease,
        }
        this.leasingList = [];
        this.leasingList.push(obj);
        this.$nextTick(() => {
          this.formItem = dbody.data;
          this.uploadList = !! dbody.data.pay ? dbody.data.pay.split(',') : [];
          this.contract = !! dbody.data.contract ? dbody.data.contract.split(',') : [];
          this.selectKitchen();
        })
      })
      this.$refs.formItem.resetFields()
    }
  },
  created: function () {
    this.formItem.id = this.$route.query.id
    getKitchenList().then(res => {
      const dbody = res.data
      this.kitchenList = dbody.data
    })
    getWorkCategoryList( "7" ).then(res => {
      const dbody = res.data
      this.workCategoryList = dbody.data || [];
    })
  },
  mounted () {
    this.$nextTick(function () {
      this.showPreBuildItem();
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
