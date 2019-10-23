<template>
	<div>
    <Modal title="预览图" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
		<Form :label-width="120">
      <FormItem label="起租函">
        <div class="img-upload-list" v-for="item in start_letter">
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemoveStartLetterImg(item)"></Icon>
          </div>
        </div>
        <Upload
          ref="startLetterImg"
          :show-upload-list="false"
          :on-success="handleSuccessStartLetterImg"
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
          <FormItem label="起租日期">
            <DatePicker type="date" placeholder="选择起租日期" :value="leaseinfo.start_date" @on-change="getStartDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="接驳时间">
            <DatePicker type="date" placeholder="选择接驳时间" :value="leaseinfo.connect_date" @on-change="getConnectDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="公摊起始日期">
            <DatePicker type="date" placeholder="选择公摊起始日期" :value="leaseinfo.entrance_date" @on-change="getEntranceDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="入场时间">
            <DatePicker type="date" placeholder="选择入场时间" :value="leaseinfo.join_date" @on-change="getJoinDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="店铺电表起始">
            <Input v-model="leaseinfo.start_energy" placeholder="输入店铺电表起始" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="店铺水表起始">
            <Input v-model="leaseinfo.start_water" placeholder="输入店铺水表起始" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="库房费用">
            <Input v-model="leaseinfo.storage_fee" placeholder="输入库房费用" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20" style="margin-bottom: 300px;">
        <i-col span="10">
          <FormItem>
            <Button @click="leaseinfoSubmit" type="warning">保存</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
	</div>
</template>

<script>
import { setStartShopEdit } from '@/api/data'
export default {
  name: 'KSEStartInfo',
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
      // 基本
      leaseinfo:{},
      start_letter:[],
    }
  },
  methods: {
  	initData(){
      if(!this.data.store_id){
        return
      }
      let data  =  Object.assign({},this.data)
      this.initLeaseinfo( data )
  	},
    initLeaseinfo( data ){
      // 起租日期
      this.leaseinfo.start_date = data.start_date || '';
      // 接驳时间
      this.leaseinfo.connect_date = data.connect_date || '';
      // 公摊起始日期
      this.leaseinfo.entrance_date = data.entrance_date || '';
      // 入场日期
      this.leaseinfo.join_date = data.join_date || '';
      // 起租电表
      this.leaseinfo.start_energy = data.start_energy || '';
      // 起租水表
      this.leaseinfo.start_water = data.start_water || '';
      // 店铺收费基数
      this.leaseinfo.pay_base = data.pay_base || '1';
      // 库房费
      this.leaseinfo.storage_fee = data.storage_fee || '';
      // 起租函
      this.start_letter = !!data.start_letter ? this.trimNull(data.start_letter.split(',')) : [];
    },
    // 设置起租日期
    getStartDatePicker (date) {
      this.leaseinfo.start_date = date
    },
    // 设置接驳日期
    getConnectDatePicker(date){
      this.leaseinfo.connect_date = date
    },
    // 设置公摊起始日期
    getEntranceDatePicker(date){
      this.leaseinfo.entrance_date = date
    },
    // 设置入场日期
    getJoinDatePicker(date){
      this.leaseinfo.join_date = date
    },
    // 保存按钮
    leaseinfoSubmit( ){ 
      this.leaseinfo.kitchen_id = this.data.kitchen_id;
      this.leaseinfo.store_id = this.data.store_id;
      this.leaseinfo.start_letter = '';
      if(this.start_letter.length > 0){
        this.leaseinfo.start_letter = this.start_letter.join(',');
      }
      setStartShopEdit(this.leaseinfo).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.$Notice.warning({
            title: '信息提交完成！'
          })
        } else {
          this.$Notice.warning({
            title: dbody.msg
          })
        }
      })
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
    handleSuccessStartLetterImg (res, file) {
      if (res.code == 0) {
        if(!this.start_letter){
          this.start_letter = [];
        }
        this.start_letter.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
    handleRemoveStartLetterImg (file) {
      this.start_letter.splice(this.start_letter.indexOf(file), 1)
    },

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