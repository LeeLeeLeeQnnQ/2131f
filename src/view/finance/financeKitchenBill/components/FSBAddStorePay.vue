<template>
  <div>
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
    <Modal v-model="showAddStorePayModal" title="添加缴费" @on-ok="addStorePay" :mask-closable="false">
      <Form :model="storeBill" :label-width="120">
        <Card shadow>
          <p slot="title">
              <Icon type="logo-usd" />
              {{storeBill.month}} {{storeBill.store_name}}
          </p>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="本次缴纳金额">
                <Input v-model="storeBill.money" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="20">
              <FormItem label="本次缴纳凭证">
                <div class="img-upload-list" v-for="item in uploadLetter">
                  <div>
                    <img :src="item">
                    <div class="img-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item,'uploadLetter')"></Icon>
                    </div>
                  </div>
                </div>
                <Upload
                    ref="uploadLetter"
                    :show-upload-list="false"
                    :on-success="uploadLetterSuccess"
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
              <FormItem label="备注">
                <Input v-model="storeBill.remark" type="textarea" :rows="3" placeholder="备注"/>
              </FormItem>
            </i-col>
          </Row>
        </Card>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { addStoreBillPay } from '@/api/finance'
  export default {
    name: 'FSBAddStorePay',
    components: {

    },
    props: {
      info:{
        type: Object,
        default () {
          return { }
        }
      },
      initTable: {
        type: Function,
        default: null
      }
    },
    data () {
      return {
        // 编辑商户账单
        storeBill:{},
        showAddStorePayModal:false,
        uploadLetter:[],
        // 图片
        imgUrl: '',
        visible: false,
      }
    },
    methods: {
      // init
      initData(){
        this.storeBill = Object.assign({},this.info)
        this.showAddStorePayModal = true;
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
          desc: '文件  ' + file.name + ' 过大, 不能超过 2M.'
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
      uploadLetterSuccess (res, file) {
        if (res.code == 0) {
          this.uploadLetter.push(res.data)
        }else{
          this.$Notice.warning({
            title: res.msg
          })
        }
      },
      // 编辑商户账单
      addStorePay(){
        // 验证操作
        if(isNaN(this.storeBill.money*1)){
          this.$Notice.warning({
            title: '上缴数字有误！'
          })
          return
        }
        if(this.uploadLetter.length <= 0){
          this.$Notice.warning({
            title: '凭证不能为空！'
          })
          return
        }
        let data = {};
        data.bill_id = this.storeBill.id;
        data.store_id = this.storeBill.store_id;
        data.money = this.storeBill.money*1;
        data.images = this.uploadLetter.join(",");
        data.remark = this.storeBill.remark;
        // 提交修改
        addStoreBillPay( data ).then(res => {
          const dbody = res.data
          if(dbody.code != 0){
            this.$Notice.warning({
              title: dbody.msg,
            })
            return
          }
          this.$Notice.warning({
            title: "添加成功！",
          })
          this.initTable(this.storeBill.sreach)
        })
      },
    },
    mounted () {
      
    },
    beforeDestroy () {
      
    },
    watch: {
      info (newV, oldV) {
        this.uploadLetter = [];
        this.storeBill = {}
        this.initData();
      },
    }
  }
</script>
