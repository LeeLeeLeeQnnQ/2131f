<template>
    <Card shadow>
      <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
      </Modal>
      <p slot="title">
        {{kitchen_name}}  {{store_no}}  {{store_name}}
      </p>
      <Tabs :animated="false" style="margin-top: 5px;" class="h100">
        <TabPane label="退租相关">
          <Modal v-model="end_showModal" title="退租表格编辑" @on-ok="saveEndModalInfo">
            <Form :model="end_modalItem" :label-width="80">
              <FormItem label="项目名称">
                <Select v-model="end_modalItem.category_id" @on-change="setEndModalTitle">
                    <Option v-for="item in end_workCategoryList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
              </FormItem>
              <FormItem label="收支类型">
                <RadioGroup v-model="end_modalItem.rent_type">
                    <Radio label="1">扣减</Radio>
                    <Radio label="2">退款</Radio>
                </RadioGroup>
              </FormItem>
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="12">
                  <FormItem label="项目金额">
                    <Input v-model="end_modalItem.money" placeholder="输入金额"></Input>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="项目数量">
                    <Input v-model="end_modalItem.quantity" placeholder="输入数量"></Input>
                  </FormItem>
                </i-col>
              </Row>
              <FormItem label="项目备注">
                  <Input v-model="end_modalItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
              </FormItem>
            </Form>
          </Modal>
          <Form :label-width="100">
            <Row type="flex" justify="start" align="middle" :gutter="20">
              <i-col span="10">
                <FormItem label="申请退场时间">
                  <DatePicker type="date" placeholder="申请退场时间" :value="leaseinfo.apply_date" @on-change="getApplyDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
                </FormItem>
              </i-col>
              <i-col span="10" offset="2">
                <FormItem label="租金结算日期">
                  <DatePicker type="date" placeholder="租金结算日期" style="width: 200px" :value="leaseinfo.settle_date" @on-change="getSettleDatePicker"></DatePicker>
                </FormItem>
              </i-col>
            </Row>
            <Row type="flex" justify="start" align="middle" :gutter="20">
              <i-col span="10">
                <FormItem label="公摊结束日期" prop="quit_date">
                  <DatePicker type="date" placeholder="公摊结束日期" style="width: 200px" :value="leaseinfo.exit_date" @on-change="getExitDatePicker"></DatePicker>
                </FormItem>
              </i-col>
            </Row>
            <Row type="flex" justify="start" align="middle" :gutter="20">
              <i-col span="10">
                <FormItem label="店铺电表结束">
                  <Input v-model="leaseinfo.end_energy" placeholder="输入店铺电表结束" style="width: 200px"></Input>
                </FormItem>
              </i-col>
              <i-col span="10" offset="2">
                <FormItem label="店铺水表结束">
                  <Input v-model="leaseinfo.end_water" placeholder="输入店铺水表起始" style="width: 200px"></Input>
                </FormItem>
              </i-col>
            </Row>
            <FormItem label="退场函">
              <div class="img-upload-list" v-for="item in end_letter">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveEndLetterImg(item)"></Icon>
                </div>
              </div>
              <Upload
                ref="voucherinfoEndLetterImg"
                :show-upload-list="false"
                :on-success="handleSuccessEndLetterImg"
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
            <FormItem label="退场其他">
              <div class="img-upload-list" v-for="item in end_other">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveEndOtherImg(item)"></Icon>
                </div>
              </div>
              <Upload
                ref="voucherinfoEndOtherImg"
                :show-upload-list="false"
                :on-success="handleSuccessEndOtherImg"
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
            <FormItem label="退租表格">
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="24">
                  <FormItem>
                    <Button type="primary" @click="addEndTableData">增加一条</Button>
                  </FormItem>
                </i-col>
                <i-col span="22" style="margin-top:8px;">
                  <Table :columns="end_tableColumns" :data="end_tableData">
                    <div slot="footer" class="tableFooter">
                      <h3>总计： {{ endTableTotal }}</h3>
                    </div>
                  </Table>
                </i-col>
              </Row>
            </FormItem>
            <FormItem>
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="10">
                  <FormItem>
                    <Button @click="endStoreModal = true" type="warning">信息确认</Button>
                  </FormItem>
                </i-col>
              </Row>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
      <Modal v-model="endStoreModal" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>确认退租信息么？</span>
        </p>
        <div slot="footer">
            <Button type="error" size="large" long @click="endInfoSubmit">确认</Button>
        </div>
      </Modal>
    </Card>
</template>

<script>
import Tables from '_c/tables'
// 权限
// /api/StoreLease/show,/api/StoreLease/edit,/api/Index/getWorkCategory,/api/StoreLease/edit,/api/StoreLease/settle
import { getShopDetail , setStartShopEdit , getWorkCategoryList } from '@/api/data'
import { quitKitchen , settleShop } from '@/api/kitchen'
export default {
  name: 'kitchenShopHandleB',
  components: {
    Tables
  },
  data () {
    return {
      // kitchen_id
      kitchen_id:'',
      // store_id
      store_id: '',
      // 名称显示
      kitchen_name:'',
      store_name: '',
      store_no: '',
      // 租期租约
      leaseinfo:{},
      // 图片
      imgUrl: '',
      visible: false,

      // 退租相关
      end_letter:[],
      end_other:[],
      end_tableData:[],
      end_tableColumns: [
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
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      end_modalItem:{},
      end_showModal:false,
      end_workCategoryList:[],
      // 弹窗
      endStoreModal:false,

    }
  },
  methods: {
    // 工具函数
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
    // 删除表格信息
    removeItem (index) {
      this.end_tableData.splice(index, 1)
    },
    // 租期租约卡片

    // 设置申请退场时间日期
    getApplyDatePicker(date){
      this.leaseinfo.apply_date = date
    },
    // 设置申请退场时间日期
    getApplyDatePicker(date){
      this.leaseinfo.apply_date = date
    },
    // 获取退租时间
    getSettleDatePicker (date) {
      this.leaseinfo.settle_date = date
    },
    // 获取退租时间
    getExitDatePicker (date) {
      this.leaseinfo.exit_date = date
    },
    //租期租约卡片
    initLeaseinfo( data ){

      // 申请退场时间
      this.leaseinfo.apply_date = data.apply_date || '';
      // 租金结算日期时间
      this.leaseinfo.settle_date = data.settle_date || '';
      // 公摊结束日期
      this.leaseinfo.exit_date = data.exit_date || '';
      // 电表结束
      this.leaseinfo.end_energy = data.end_energy || '';
      // 水表结束
      this.leaseinfo.end_water = data.end_water || '';
      // 退场函
      this.end_letter = this.trimNull(data.end_letter.split(',')) || [];
      // 退场其他
      this.end_other = this.trimNull(data.end_other.split(',')) || [];
      // 退租表格
      this.getEndTable();
    },


    //退租部分
    // 删除退租函 退租其他
    handleRemoveEndLetterImg (file) {
      this.end_letter.splice(this.end_letter.indexOf(file), 1)
    },
    handleRemoveEndOtherImg (file) {
      this.end_other.splice(this.end_other.indexOf(file), 1)
    },
    // 获取起租凭证图片
    handleSuccessEndLetterImg (res, file) {
      if (res.code == 0) {
        if(!this.end_letter){
          this.end_letter = [];
        }
        this.end_letter.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    // 获取起租凭证图片
    handleSuccessEndOtherImg (res, file) {
      if (res.code == 0) {
        if(!this.end_other){
          this.end_other = [];
        }
        this.end_other.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    // 获取退租表格
    getEndTable( ){
      getShopDetail({id: this.store_id, lease_type: 2}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: "退租表格数据获取失败！"
          })
          return
        }
        this.end_tableData =  dbody.data.rent || [];
      })
    },
    //退租表格编辑
    addEndTableData(){
      this.end_modalItem = {
        category_id:'',
        title: '',
        rent_type: 1,
        money: '',
        remark: '',
        quantity: 1
      };
      this.end_showModal = true;
    },
    // 保存起租表格信息
    saveEndModalInfo(){
      if (this.formModalInfo(this.end_modalItem)) {
        return
      }
      this.end_tableData.push(this.end_modalItem)
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
    // 弹窗下啦事件
    setEndModalTitle(){
      let that = this;
      let id = this.end_modalItem.category_id;
      this.end_workCategoryList.forEach( function( item ) {
        if( item.id ==  id ){
          that.end_modalItem.title = item.title;
          return;
        }
      });
    },
    // 固定表格
    settleShop( id ){
      settleShop( id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            desc: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "操作完成！"
        })
        this.$router.go(-1);
      })
    },
    // 提交工单按钮
    endInfoSubmit () {
      let obj = {};
      obj.apply_date = this.leaseinfo.apply_date;
      obj.settle_date = this.leaseinfo.settle_date;
      obj.exit_date = this.leaseinfo.exit_date;
      obj.end_water = this.leaseinfo.end_water;
      obj.end_energy = this.leaseinfo.end_energy;
      obj.end_letter = this.end_letter.length > 0 ? this.end_letter.join(",") : '';
      obj.end_other = this.end_other.length > 0 ? this.end_letter.join(",") : '';
      obj.rent = this.end_tableData;
      obj.store_id = this.store_id;
      obj.kitchen_id = this.kitchen_id;
      obj.lease_type = 2;

      if(!obj.apply_date){
        this.$Notice.warning({
          title: "申请退场时间必须填写！"
        })
        return
      }
      if(!obj.settle_date){
        this.$Notice.warning({
          title: "租金结算日期必须填写！"
        })
        return
      }
      if(!obj.settle_date){
        this.$Notice.warning({
          title: "公摊结束日期必须填写！"
        })
        return
      }
      if(obj.end_energy*1 <= 0){
        this.$Notice.warning({
          title: "店铺电表结束必须填写！"
        })
        return
      }
      if(obj.end_water*1 <= 0){
        this.$Notice.warning({
          title: "店铺水表结束必须填写！"
        })
        return
      }
      if(!obj.end_letter){
        this.$Notice.warning({
          title: "退场函必须填写！"
        })
        return
      }
      // if(obj.rent.length <= 0){
      //   this.$Notice.warning({
      //     title: "退租表格必须填写！"
      //   })
      //   return
      // }
      quitKitchen(obj).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.settleShop(this.store_id);
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

    //初始化数据
    initData ( data ) {
      //厨房  商户名 档口号
      this.kitchen_name = data.kitchen_name;
      this.store_name = data.store_name;
      this.store_no = data.store_no;
      this.initLeaseinfo( data );
    }
  },
  computed: {
    endTableTotal:function() {
      if (this.end_tableData.length > 0) {
        let t = 0
        this.end_tableData.forEach(function (i, j) {
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
  created: function () {
    let id = this.$route.query.id
    let kitchen_id = this.$route.query.kitchen_id
    let that = this
    this.store_id = id
    this.kitchen_id = kitchen_id
    getShopDetail({id: id, lease_type: 0}).then(res => {
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
      // 初始化函数
      this.initData(dbody.data)
    })
    // 获取退租表格选项
    getWorkCategoryList( "8" ).then(res => {
      const dbody = res.data
      this.end_workCategoryList = dbody.data || [];
    })
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
