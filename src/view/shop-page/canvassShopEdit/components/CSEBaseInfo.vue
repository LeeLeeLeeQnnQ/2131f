<template>
  <div>
    <Form :label-width="120">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="饿了么上线日期">
            <DatePicker type="date" placeholder="饿了么选择上线日期" :value="leaseinfo.ele_date" @on-change="getEleDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
          </FormItem>
        </i-col>
         <i-col span="10" offset="2">
          <FormItem label="美团上线日期">
            <DatePicker type="date" placeholder="美团选择上线日期" :value="leaseinfo.meituan_date" @on-change="getMeiTuanDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
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
  name: 'CSEBaseInfo',
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
      leaseinfo:{},
    }
  },
  methods: {
    initData(){
      this.leaseinfo = Object.assign({},this.baseinfo)
    },
    // 保存按钮
    leaseinfoSubmit( ){
      let obj = {}
      obj.ele_date = this.leaseinfo.ele_date || '';
      obj.meituan_date = this.leaseinfo.meituan_date || '';
      obj.kitchen_id = this.leaseinfo.kitchen_id;
      obj.store_id = this.leaseinfo.store_id;
      setStartShopEdit( obj ).then(res => {
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
    getEleDatePicker (date) {
      this.leaseinfo.ele_date = date
    },
    getMeiTuanDatePicker (date) {
      this.leaseinfo.meituan_date = date
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