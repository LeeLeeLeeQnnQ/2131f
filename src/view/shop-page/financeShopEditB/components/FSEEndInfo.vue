<template>
  <div>
    <Modal title="预览图" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
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
  	<Form :label-width="100" class="h100">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="租金结算日期">
            <DatePicker type="date" placeholder="选择租金结算日期" style="width: 200px" :value="leaseinfo.settle_date" @on-change="getSettleDatePicker"></DatePicker>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="公摊结束日期">
            <DatePicker type="date" placeholder="选择公摊结束日期" style="width: 200px" :value="leaseinfo.exit_date" @on-change="getExitDatePicker"></DatePicker>
          </FormItem>
        </i-col>
      </Row>
      <FormItem label="财务打款凭证">
        <div class="img-upload-list" v-for="item in archive">
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemoveArchiveImg(item)"></Icon>
          </div>
        </div>
        <Upload
          ref="archiveImg"
          :show-upload-list="false"
          :on-success="handleSuccessArchiveImg"
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
              <h3>
                <Icon type="ios-alert-outline" />
                退款计算公式：【退款】=【总缴款】- 【房租应缴款】- 【房租滞纳金】-【运营费】-【运营费滞纳金】
              </h3>
            </FormItem>
          </i-col>
          <i-col span="22" style="margin-top:8px;">
            <Table :columns="end_tableColumns" :data="end_tableData">
              <div slot="footer" class="tableFooter">
                <h3>{{ endTableTotal }}</h3>
              </div>
            </Table>
          </i-col>
        </Row>
      </FormItem>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem>
            <Button @click="leaseinfoSubmit" type="warning">确定</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { getShopDetail , setEndShopEdit , getWorkCategoryList , getRefundData } from '@/api/data'
export default {
  name: 'FSEEndInfo',
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
      // kitchen_id
      kitchen_id:'',
      // store_id
      store_id: '',
      // 名称显示
      kitchen_name:'',
      store_name: '',
      store_no: '',
      // 图片
      imgUrl: '',
      visible: false,
      // 租期租约
      leaseinfo:{},
      fileStoreModal:false,
      // 财务上传退租凭证
      archive:[],
      // 表格
      end_tableData:[],
      end_tableColumns: [
        {
          title: '名称',
          key: 'title'
        },
        {
          title: '数量',
          key: 'quantity'
        },
        {
          title: '金额',
          key: 'money',
          render: (h, params) => {
            let money = params.row.money;
            if(params.row.rent_type*1 == 1){
              let str =  '-' + money
              return h('strong', { style: {color: 'red'}} , str )
            }else{
              let str =  '+' + money
              return h('strong',  { style: {color: 'green'}}  , str )
            }
          }
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
            if(!!params.row.isHidden){
              return ''
            }
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
    }
  },
  methods:{
    initData(){
      if(!this.data.store_id){
        return
      }
      //厨房  商户名 档口号
      this.initLeaseinfo(this.data);
    },
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    //租期租约卡片
    initLeaseinfo( data ){
      this.leaseinfo.settle_date = data.settle_date;
      this.leaseinfo.exit_date = data.exit_date;
      // 获取凭证图片 
      this.archive = data.archive.length > 0 ? data.archive.split(",") : '';
      // 获取退租表格
      this.getEndTable( data );
    },
    // 获取退租表格
    getEndTable( data ){
      let store_id = data.store_id
      getShopDetail({id: data.store_id, lease_type: 2}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: "退租表格数据获取失败！"
          })
          return
        }
        this.end_tableData =  dbody.data.rent || [];
        // 获取退租计算信息
        this.getRefundData(store_id);
      })
    },
    getRefundData(store_id){
      getRefundData({store_id: store_id}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        let data = dbody.data;
        for(let k in data){
          let ii = {
            category_id:'',
            title: '',
            rent_type: '',
            money: '',
            remark: '',
            quantity: '1',
            isHidden: true,
          }
          switch ( k ) {
            case 'bill_fee':
              if(!!data['is_bill']){
                ii.title = "退款(含押金)"
                ii.money =  Math.abs(data["rent_fee"]).toFixed(2)
                ii.rent_type = data["rent_fee"]*1 < 0 ? 1 : 2 
                ii.remark = '【总缴款：'+data["pay_rent_fee"]+'】'+"\t"+'【应缴房租：'+data["payable_rent_fee"].toFixed(2)+'】'+"\t"+'【房租滞纳金费：'+data["rent_overdue_fee"]+'】'+"\t"+'【应缴运营费：'+data["operate_fee"]+'】'+"\t"+'【运营滞纳金费：'+data["operate_overdue_fee"]+'】'
                this.end_tableData.unshift(ii)
              }else{
                ii.title = "【注意】应收账款账单未出！退款可能不准确"
                ii.money =  Math.abs(data["rent_fee"]).toFixed(2)
                ii.rent_type = data["rent_fee"]*1 < 0 ? 1 : 2 
                ii.remark = '【注意】应收账款账单未出！退款可能不准确'+'【总缴款：'+data["pay_rent_fee"]+'】'+"\t"+'【应缴房租：'+data["payable_rent_fee"].toFixed(2)+'】'+"\t"+'【房租滞纳金费：'+data["rent_overdue_fee"]+'】'+"\t"+'【应缴运营费：'+data["operate_fee"]+'】'+"\t"+'【运营滞纳金费：'+data["operate_overdue_fee"]+'】'
                this.end_tableData.unshift(ii)
              }
          }
        };
      })
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
    getWorkCategoryList(){
      getWorkCategoryList( "8" ).then(res => {
        const dbody = res.data
        this.end_workCategoryList = dbody.data || [];
      })
    },
    saveEndModalInfo(){
      if (this.formModalInfo(this.end_modalItem)) {
        return
      }
      this.end_tableData.push(this.end_modalItem)
    },
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
    getSettleDatePicker (date) {
      this.leaseinfo.settle_date = date
    },
    getExitDatePicker (date) {
      this.leaseinfo.exit_date = date
    },
    handleSuccessArchiveImg (res, file) {
      if (res.code == 0) {
        if(!this.archive){
          this.archive = [];
        }
        this.archive.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
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
    leaseinfoSubmit(){
      let obj = { store_id : this.data.store_id , settle_date : this.leaseinfo.settle_date , exit_date : this.leaseinfo.exit_date};
      obj.archive = this.archive.length > 0 ? this.archive.join(",") : '';
      let arr = Object.assign(this.end_tableData);
      let arr2 = [];
      arr.forEach(function(i,j){
        if(!i.isHidden){
          arr2.push(i)
        }
      })
      obj.rent = arr2;
      setEndShopEdit(obj).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.$Notice.warning({
            title: "提交完成！"
          })
        } else {
          this.$Notice.warning({
            title: dbody.msg
          })
        }
      })
    },
    handleRemoveArchiveImg (file) {
      this.archive.splice(this.archive.indexOf(file), 1)
    },
    removeItem (index) {
      this.end_tableData.splice(index, 1)
    },
  },
  created () {
    this.initData();
    this.getWorkCategoryList();
  },
  beforeDestroy () {
    
  },
  computed: {
    endTableTotal:function() {
      if (this.end_tableData.length > 0) {
        let t = 0
        this.end_tableData.forEach(function (i, j) {
          if (i.rent_type == '1') {
            t += 1 * Math.abs(i.money) * i.quantity
          } else {
            t -= 1 * Math.abs(i.money) * i.quantity
          }
        })
        if(t.toFixed(2)>0){
          return "商户欠款："+ Math.abs(t.toFixed(2)).toFixed(2)
        }else{
          return "应退金额："+ Math.abs(t.toFixed(2)).toFixed(2)
        }
      } else {
        return "没有数据"
      }
    },
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