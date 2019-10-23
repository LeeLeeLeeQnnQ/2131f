<template>
  <div>
    <Modal v-model="showModal" title="编辑表格" @on-ok="saveModalInfo">
        <Form :model="modalItem" :label-width="80">
          <FormItem label="项目名称">
             <Select v-model="modalItem.category_id" @on-change="setModalTitle">
                <Option v-for="item in workCategoryList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          <FormItem label="收支类型">
            <RadioGroup v-model="modalItem.rent_type">
                <Radio label="1">收入</Radio>
                <Radio label="2">支出</Radio>
            </RadioGroup>
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
    <Card title="店铺退租" shadow>
      <Form ref="formItem" :model="formItem" :label-width="100"  :rules="ruleValidate">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="所属厨房" prop="kitchen_id">
                <Select v-model="formItem.kitchen_id" @on-change="selectKitchen">
                  <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="商户选择" prop="store_id">
              <Select v-model="formItem.store_id">
                  <Option v-for="item in shopList" :value="item.store_id" :key="item.store_id">{{ item.store_name }} /  {{ item.store_no }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="申请日期" prop="apply_date">
              <DatePicker type="date" placeholder="选择结算日期" :value="formItem.apply_date" @on-change="getApplyDatePicker"></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="10" offset="2">
            <FormItem label="结算日期" prop="quit_date">
              <DatePicker type="date" placeholder="选择退租日期" :value="formItem.settle_date" @on-change="getSettleDatePicker"></DatePicker>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="公摊结束日期" prop="quit_date">
              <DatePicker type="date" placeholder="选择退租日期" :value="formItem.exit_date" @on-change="getExitDatePicker"></DatePicker>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="20">
            <FormItem label="退场函">
              <div class="img-upload-list" v-for="item in uploadEndLetter">
                  <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="img-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                          <Icon type="ios-trash-outline" @click.native="handleRemove(item,'uploadEndLetter')"></Icon>
                      </div>
                  </template>
                  <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
              </div>
              <Upload
                  ref="uploadEndLetter"
                  :show-upload-list="false"
                  :on-success="uploadEndLetterSuccess"
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
            <FormItem label="其他凭证">
              <div class="img-upload-list" v-for="item in uploadEndOtherList">
                  <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="img-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                          <Icon type="ios-trash-outline" @click.native="handleRemove(item,'uploadEndOtherList')"></Icon>
                      </div>
                  </template>
                  <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
              </div>
              <Upload
                  ref="uploadEndOtherList"
                  :show-upload-list="false"
                  :on-success="uploadEndOtherListSuccess"
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
       <!--  <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="24">
            <FormItem label="退租表格">
              <Button type="primary" @click="showModal = true">增加一条</Button>
            </FormItem>
          </i-col>
          <i-col span="22">
            <FormItem>
              <Table :stripe="true" :columns="tableColumns" :data="tableData">
                <div slot="footer" class="tableFooter">
                  <h3>总计： {{ tableTotal }}</h3>
                </div>
              </Table>
            </FormItem>
          </i-col>
        </Row> -->
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
// /api/Index/getKitchenList,/api/StoreLease/queryList,/api/Index/getWorkCategory,/api/StoreLease/edit
import { getKitchenList , getWorkCategoryList, getNormalStoreList } from '@/api/data'
import { quitKitchen } from '@/api/kitchen'
export default {
  name: 'kitchenShopEliminate',
  data () {
    return {
      // 厨房
      kitchenList: [],
      // 店铺列表
      shopList: [],
      // 表单验证
      formItem: {
        kitchen_id: '',
        store_id: '',
        apply_date: '',
        settle_date: ''
      },
      ruleValidate: {
        kitchen_id: [
          { required: true, message: '厨房需要选择！', trigger: 'blur' }
        ],
        store_id: [
          { required: true, message: '店铺必须选择', trigger: 'blur' }
        ],
        apply_date: [
          { required: true, message: '退租申请时间不能为空', trigger: 'blur' }
        ],
      },
      uploadEndLetter: [],
      uploadEndOtherList: [],
      // 表格头
      tableColumns: [
        {
          title: '名称',
          key: 'title'
        },
        {
          title: '收支',
          key: 'rent_type',
          render: (h, params) => {
            return h('strong', params.row.rent_type*1 == 1 ? '收入' : '支出')
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
      // 表哥
      tableData: [],
      // 表哥踪迹
      tableTotal: '0.00',
      // 表哥弹窗
      showModal: false,
      // 表哥单元存储
      modalItem: {
        category_id:'',
        title: '',
        rent_type: 1,
        money: '',
        remark: '',
        quantity: 1
      },
      // 图片
      imgUrl: '',
      visible: false,
      workCategoryList:[]
    }
  },
  methods: {
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
        rent_type: 1,
        money: '',
        remark: '',
        quantity: 1
      }
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
    // 删除表格信息
    removeItem (index) {
      this.tableData.splice(index, 1)
    },
    // 获取表格总计
    getTableSum () {
      if (this.tableData.length > 0) {
        let t = 0
        this.tableData.forEach(function (i, j) {
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
    // 提交验证器
    submitValidateField: function (obj) {
      if (!obj.kitchen_id) {
        this.$Notice.warning({
          title: '请选择厨房！'
        })
        return false
      };
      if (!obj.store_id) {
        this.$Notice.warning({
          title: '请选择店铺！'
        })
        return false
      };
      if(this.uploadEndLetter.length <= 0){
        this.$Notice.warning({
          title: '请上传退场函！'
        })
        return false
      }
      // if(this.tableData.length <= 0){
      //   this.$Notice.warning({
      //     title: '请编辑退租表格！'
      //   })
      //   return false
      // }
      return true
    },
    // 提交工单按钮
    handleSubmit () {
      this.formItem.rent = this.tableData
      if (this.submitValidateField(this.formItem)) {
        this.setOrderInfo(this.formItem)
      }
    },
    // 发送数据
    setOrderInfo (info) {
      let arr1 = []
      let arr2 = []
      let that = this
      this.uploadEndLetter.forEach(function (i, j) {
        arr1.push(i.url)
      })
      info.end_letter = arr1.join(',')
      this.uploadEndOtherList.forEach(function (i, j) {
        arr2.push(i.url)
      })
      info.end_other = arr2.join(',')
      let data = {}
      for (let key in info) {
        if (info[key]) {
          data[key] = info[key]
        }
      }
      quitKitchen(data).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.$Notice.warning({
            title: '退租信息提交成功！'
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
    handleRemove (file, name) {
      const fileList = this.$refs[name].fileList
      this.$refs[name].fileList.splice(fileList.indexOf(file), 1)
      this[name].splice(fileList.indexOf(file), 1)
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
    // 退场其他
    uploadEndOtherListSuccess (res, file) {
      if (res.code == 0) {
        let obj = {}
        obj.url = res.data
        obj.status = 'finished'
        obj.showProgress = false
        this.uploadEndOtherList.push(obj)
      }
    },
    // 退场函
    uploadEndLetterSuccess (res, file) {
      if (res.code == 0) {
        let obj = {}
        obj.url = res.data
        obj.status = 'finished'
        obj.showProgress = false
        this.uploadEndLetter.push(obj)
      }
    },
    // 获取退出申请时间
    getApplyDatePicker (date) {
      this.formItem.apply_date = date
    },
    // 获取退租时间
    getSettleDatePicker (date) {
      this.formItem.settle_date = date
    },
    // 获取退租时间
    getExitDatePicker (date) {
      this.formItem.exit_date = date
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
      getNormalStoreList(id).then(res => {
        const dbody = res.data
        this.shopList = dbody.data
      })
    }
  },
  created: function () {
    this.$nextTick(function () {
      getKitchenList().then(res => {
        const dbody = res.data
        this.kitchenList = dbody.data
      })
      getWorkCategoryList( "8" ).then(res => {
        const dbody = res.data
        this.workCategoryList = dbody.data || [];
      })
      this.$refs.formItem.resetFields()
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
