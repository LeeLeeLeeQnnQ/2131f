<template>
  <div>
    <Card shadow>
      <Row :gutter="20">
        <i-col :xs="4" :md="4" :lg="4" v-if="option.picker_kitchen" style="margin-top: 3px;">
          <Select v-model="sreachInfo.kitchen_id"  :multiple="option.kitchen_multiple"  placeholder="请选择厨房">
            <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
          </Select>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4" v-if="option.picker_month" style="margin-top: 3px;">
          <DatePicker @on-change="selectMonth" :multiple="option.month_multiple"  type="month" placeholder="选择月份" style="width: 200px"></DatePicker>
        </i-col>
        <i-col :xs="2" :md="2" :lg="2" style="margin-top: 3px;">
          <Button type="primary" @click="sendInfo">搜索</Button>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getKitchenList } from '@/api/data'
export default {
  name: 'SreachBox',
  props: {
    option:{
      type: Object,
      default () {
        return {
          picker_kitchen:false,
          kitchen_multiple:false,
          picker_month:false,
          month_multiple:false,
        }
      }
    },
    getSreachInfo: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      kitchenList:[],
      sreachInfo:{},
    }
  },
  methods: {
    // selectDate
    selectMonth(date){
      this.sreachInfo.month = date;
    },
    sendInfo(){
      if(!this.sreachInfo.kitchen_id || this.sreachInfo.kitchen_id.length <= 0){
        this.$Notice.warning({
          title: '厨房必须选择！'
        })
        return
      }
      if(!!this.option.picker_month){
        if(!this.sreachInfo.month || this.sreachInfo.month.length <= 0){
          this.$Notice.warning({
            title: '月份必须选择'
          })
          return
        }
      }
      this.getSreachInfo(this.sreachInfo)
    },
  },
  created () {
    getKitchenList().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      // 初始化函数
      this.kitchenList = dbody.data || [];
    })  
  },
  mounted () {
    
  },
  watch: {
    
  }
}
</script>

<style scoped>
  
</style>
