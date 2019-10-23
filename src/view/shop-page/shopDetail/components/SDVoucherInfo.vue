<template>
	<div>
    <Modal title="预览图" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
		<Form :label-width="100">
      <Divider orientation="left" dashed>起租凭证</Divider>
      <FormItem label="起租凭证">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.pay">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="起租表格">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <Table :columns="tableColumns" :data="v_start_tableData">
              <div slot="footer" class="tableFooter">
                <h3>总计： {{ startTableTotal }}</h3>
              </div>
            </Table>
          </i-col>
        </Row>
      </FormItem>
      <Divider orientation="left" dashed>租约凭证</Divider>
      <FormItem label="意向合同">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.contract">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="合同人身份证">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.identity">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="起租函">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.start_letter">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="正式合同">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.store_contract">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="授权合照">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.figure">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="起租其他凭证">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.start_other">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <Divider orientation="left" dashed>退租凭证</Divider>
      <FormItem label="退租凭证">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.end_letter">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="退租其他">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.end_other">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="财务打款凭证">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in voucherinfo.archive">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="退租表格">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <Table :columns="tableColumns" :data="v_end_tableData">
              <div slot="footer" class="tableFooter">
                <h3>总计： {{ endTableTotal }}</h3>
              </div>
            </Table>
          </i-col>
        </Row>
      </FormItem>
    </Form>
	</div>
</template>

<script>
import { getShopDetail } from '@/api/data'
export default {
  name: 'SDVoucherInfo',
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
      v_start_tableData:[],
      v_end_tableData:[],
      // 凭证资料表格头
      tableColumns: [
        {
          title: '名称',
          key: 'title'
        },
        {
          title: '收支',
          key: 'rent_type',
          render: (h, params) => {
            return h('strong', params.row.rent_type == '1' ? '收入' : '支出')
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
        }
      ],
      // 图片
      imgUrl: '',
      visible: false,
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
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
  	initData(){
      if(!this.data.store_id){
        return
      }
      let data = Object.assign({},this.data)
      this.initVoucherinfo(data);
    },
    initVoucherinfo( data ){
      let store_id = data.store_id;
      // 起租表格
      this.getStartTable( store_id );
      // 退租表格
      this.getEndTable( store_id );
      // 起租财务上传凭证
      this.voucherinfo.pay = this.trimNull(data.pay.split(',')) || [];
      // 合同资料
      this.voucherinfo.contract = this.trimNull(data.contract.split(',')) || [];
      // 店主身份证
      this.voucherinfo.identity = this.trimNull(data.identity.split(',')) || [];
      // 起租函照片
      this.voucherinfo.start_letter = this.trimNull(data.start_letter.split(',')) || [];
      // 店铺合同照片
      this.voucherinfo.store_contract = this.trimNull(data.store_contract.split(',')) || [];
      // 授权合照
      this.voucherinfo.figure = this.trimNull(data.figure.split(',')) || [];
      // 起租其他凭证
      this.voucherinfo.start_other = this.trimNull(data.start_other.split(',')) || [];
      // 起租其他凭证
      this.voucherinfo.end_letter = this.trimNull(data.end_letter.split(',')) || [];
      // 起租其他凭证
      this.voucherinfo.end_other = this.trimNull(data.end_other.split(',')) || [];
      // 退租财务打款凭证
      this.voucherinfo.archive = this.trimNull(data.archive.split(',')) || [];
    },
    // 获取起租表格
    getStartTable( store_id ){
      getShopDetail({id: store_id, lease_type: 1}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: "表格数据获取失败！"
          })
          return
        }
        this.v_start_tableData =  dbody.data.rent || [];
      })
    },
    // 获取退租表格
    getEndTable( store_id ){
      getShopDetail({id: store_id, lease_type: 2}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: "退租表格数据获取失败！"
          })
          return
        }
        this.v_end_tableData =  dbody.data.rent || [];
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
    endTableTotal:function() {
      if (this.v_end_tableData.length > 0) {
        let t = 0
        this.v_end_tableData.forEach(function (i, j) {
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
  .ivu-tabs-content{
    overflow-x: hidden;
  }
  .tableFooter{
    margin-left: 20px;
  }
  .cellTit{
    margin-bottom: 12px;
    span{
      color:#fff;
      background-color:#3399ff;
      border-radius:5px;
      padding:5px 8px;
      margin-right: 10px;
    }
    .noData{
      background-color: #ff9900;
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