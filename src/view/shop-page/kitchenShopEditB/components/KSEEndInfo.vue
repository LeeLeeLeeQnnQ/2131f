<template>
	<div>
    <Modal title="预览图" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
		<Modal v-model="end_showModal" title="起租表格编辑" @on-ok="saveEndModalInfo">
      <Form :model="end_modalItem" :label-width="80">
        <FormItem label="项目名称">
          <Select v-model="end_modalItem.category_id" @on-change="setEndModalTitle">
              <Option v-for="item in end_workCategoryList" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
        </FormItem>
        <FormItem label="收支类型">
          <RadioGroup v-model="end_modalItem.rent_type">
              <Radio label="1">应收</Radio>
              <Radio label="2">减免</Radio>
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
            <DatePicker type="date" placeholder="选择申请退场时间" :value="leaseinfo.apply_date" @on-change="getApplyDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="租金结算日期">
            <DatePicker type="date" placeholder="选择租金结算日期" style="width: 200px" :value="leaseinfo.settle_date" @on-change="getSettleDatePicker"></DatePicker>
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
            <Input v-model="leaseinfo.end_water" placeholder="输入店铺水表结束" style="width: 200px"></Input>
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
      <FormItem>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem>
              <Button @click="endInfoSubmit" type="warning">保存</Button>
            </FormItem>
          </i-col>
        </Row>
      </FormItem>
    </Form>
	</div>
</template>

<script>

import { quitKitchen } from '@/api/kitchen'
export default {
  name: 'KSEEndInfo',
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
      // 图片
      imgUrl: '',
      visible: false,
      leaseinfo:{},
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
                    this.end_table_removeItem(params.index)
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
    }
  },
  methods: {
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
    initData(){
      if(!this.data.store_id){
        return
      }
      this.initLeaseinfo( this.data );
    },
    initLeaseinfo( data ){
      // 申请退场时间
      this.leaseinfo.apply_date = data.apply_date || '';
      // 租金结算日期时间
      this.leaseinfo.settle_date = data.settle_date || '';
      // 电表结束
      this.leaseinfo.end_energy = data.end_energy || '';
      // 水表结束
      this.leaseinfo.end_water = data.end_water || '';
      // 公摊结束日期
      this.leaseinfo.exit_date = data.exit_date || '';
      // 退场函
      this.end_letter = !!data.end_letter ? this.trimNull(data.end_letter.split(',')) : []
      // 退场其他
      this.end_other = !!data.end_other ? this.trimNull(data.end_other.split(',')) : [];
    },
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
    // 提交工单按钮
    endInfoSubmit () {
      let obj = {};
      obj.leaseinfo = this.leaseinfo.apply_date;
      obj.settle_date = this.leaseinfo.settle_date;
      obj.exit_date = this.leaseinfo.exit_date;
      obj.end_energy = this.leaseinfo.end_energy;
      obj.end_water = this.leaseinfo.end_water;
      obj.end_letter = this.end_letter.length > 0 ? this.end_letter.join(",") : '';
      obj.end_other = this.end_other.length > 0 ? this.end_letter.join(",") : '';
      obj.rent = this.end_tableData;
      obj.store_id = this.data.store_id;
      obj.kitchen_id = this.data.kitchen_id;
      obj.lease_type = 2
      quitKitchen(obj).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.$Notice.warning({
            title: '信息提交成功！'
          })
        } else {
          this.$Notice.warning({
            title: dbody.msg
          })
        }
      })
    },
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

    // 图片
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
    // 删除退租函 退租其他
    handleRemoveEndLetterImg (file) {
      this.end_letter.splice(this.end_letter.indexOf(file), 1)
    },
    handleRemoveEndOtherImg (file) {
      this.end_other.splice(this.end_other.indexOf(file), 1)
    },
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