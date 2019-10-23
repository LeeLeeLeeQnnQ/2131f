<template>
	<div>
		<Form :label-width="100">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="店铺名称">
            <Input v-model="baseinfo.store_name" placeholder="输入店铺名称"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="店主姓名">
            <Input v-model="baseinfo.shopkeeper" placeholder="输入店主姓名"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="店铺电话" prop="shopkeeper_phone">
              <Input v-model="baseinfo.shopkeeper_phone" placeholder="输入店铺联系电话"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem>
            <Button @click="baseinfoSubmit" type="warning">保存</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
	</div>
</template>

<script>

import { setStartShopEdit } from '@/api/data'
export default {
  name: 'KSEBaseInfo',
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
       baseinfo:{}
    }
  },
  methods: {
  	initData(){
      if(!this.data.store_id){
        return
      }
      this.baseinfo = Object.assign({},this.data)
  	},
  	baseinfoSubmit(){
      if (this.baseinfoSubmitValidateField(this.baseinfo)) {
        let obj = {}
        obj.store_id = this.baseinfo.store_id;
        obj.store_name = this.baseinfo.store_name;
        obj.shopkeeper = this.baseinfo.shopkeeper;
        obj.shopkeeper_phone = this.baseinfo.shopkeeper_phone;
        setStartShopEdit(obj).then(res => {
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
      }
    },
    baseinfoSubmitValidateField(obj) {
      obj.store_name = obj.store_name.trim()
      if (!obj.store_name) {
        this.$Notice.warning({
          title: '请输入正确标题！'
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
      return true
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