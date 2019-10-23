<template>
  <div>
    <Modal title="预览图" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
  	<Form :label-width="100">
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
      <FormItem label="合同人身份证">
        <div class="img-upload-list" v-for="item in identity">
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemoveIdentityImg(item)"></Icon>
          </div>
        </div>
        <Upload
          ref="identityImg"
          :show-upload-list="false"
          :on-success="handleSuccessIdentityImg"
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
      <FormItem label="正式合同">
        <div class="img-upload-list" v-for="item in store_contract">
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemoveStoreContractImg(item)"></Icon>
          </div>
        </div>
        <Upload
          ref="storeContractImg"
          :show-upload-list="false"
          :on-success="handleSuccessStoreContractImg"
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
      <FormItem label="授权合照">
        <div class="img-upload-list" v-for="item in figure">
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemoveFigureImg(item)"></Icon>
          </div>
        </div>
        <Upload
          ref="storeFigureImg"
          :show-upload-list="false"
          :on-success="handleSuccessFigureImg"
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
      <FormItem label="起租其他凭证">
        <div class="img-upload-list" v-for="item in start_other">
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemoveStartOtherImg(item)"></Icon>
          </div>
        </div>
        <Upload
          ref="startOtherImg"
          :show-upload-list="false"
          :on-success="handleSuccessStartOtherImg"
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
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem>
            <Button @click="leaseinfoImgSubmit" type="warning">保存</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { setStartShopEdit } from '@/api/data'

export default {
  name: 'CSEPictrueInfo',
  components: {
  },
  props: {
    baseinfo:{
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
      // 凭证
      contract:[],
      identity:[],
      store_contract:[],
      figure:[],
      start_other:[],
    }
  },
  methods: {
    //公用函数
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
    // 删除合同资料
    handleRemoveContractImg(file) {
      this.contract.splice(this.contract.indexOf(file), 1)
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
    // 获取证件图片
    handleSuccessIdentityImg (res, file) {
      if (res.code == 0) {
        if(!this.identity){
          this.identity = [];
        }
        this.identity.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    // 删除店铺合同图片
    handleRemoveStoreContractImg(file) {
      this.store_contract.splice(this.store_contract.indexOf(file), 1)
    },
    // 获取店铺合同图片
    handleSuccessStoreContractImg (res, file) {
      if (res.code == 0) {
        if(!this.store_contract){
          this.store_contract = [];
        }
        this.store_contract.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    // 删除授权合照图片
    handleRemoveFigureImg(file) {
      this.figure.splice(this.figure.indexOf(file), 1)
    },
    // 获取授权合照图片
    handleSuccessFigureImg (res, file) {
      if (res.code == 0) {
        if(!this.figure){
          this.figure = [];
        }
        this.figure.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    // 删除起租其他图片
    handleRemoveStartOtherImg(file) {
      this.start_other.splice(this.start_other.indexOf(file), 1)
    },
    // 获取授权合照图片
    handleSuccessStartOtherImg (res, file) {
      if (res.code == 0) {
        if(!this.start_other){
          this.start_other = [];
        }
        this.start_other.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    // 初始化
  	initData(){
  		this.initPicsInfo(this.baseinfo);
  	},
  	initPicsInfo( data ){
      // 合同资料
      this.contract = !!data.contract ? this.trimNull(data.contract.split(',')) : [];
      // 店主身份证
      this.identity = !!data.identity ?this.trimNull(data.identity.split(',')) : [];
      // 店铺合同
      this.store_contract = !!data.store_contract ? this.trimNull(data.store_contract.split(',')) : [];
      // 授权合照
      this.figure =  !!data.figure ? this.trimNull(data.figure.split(',')) : [];
      // 起租其他凭证
      this.start_other = !!data.start_other ? this.trimNull(data.start_other.split(',')) : [];
    },
    //凭证卡片
    leaseinfoImgSubmit(){
      let obj = {};
      obj.contract = '';
      if(this.contract.length > 0){
        obj.contract = this.contract.join(',');
      }
      obj.identity = '';
      if(this.identity.length > 0){
        obj.identity = this.identity.join(',');
      }
      obj.store_contract = '';
      if(this.store_contract.length > 0){
        obj.store_contract = this.store_contract.join(',');
      }
      obj.figure = '';
      if(this.figure.length > 0){
        obj.figure = this.figure.join(',');
      }
      obj.start_other = '';
      if(this.start_other.length > 0){
        obj.start_other = this.start_other.join(',');
      }
      obj.kitchen_id = this.baseinfo.kitchen_id;
      obj.store_id = this.baseinfo.store_id;
      setStartShopEdit(obj).then(res => {
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
  },
  created () {
    this.initData();
  },
  beforeDestroy () {
    
  },
  watch: {
    baseinfo (newV, oldV) {
      this.initData();
    },
  }
}
</script>

<style lang="less" scoped>
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