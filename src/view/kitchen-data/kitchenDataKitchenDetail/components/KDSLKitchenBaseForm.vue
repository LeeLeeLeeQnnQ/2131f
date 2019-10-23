<template>
  <div>
    <Form v-model="kitchen" :label-width="100">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="厨房名称" >
            <Input v-model="kitchen.kitchen_name" placeholder="输入厨房名称" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <i-col span="10">
        <FormItem label="店长">
            <Select v-model="kitchen.manage_id" style="width: 200px">
              <Option  v-for="item in manageList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
            </Select>
        </FormItem>
      </i-col>
      <Divider />
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="应支出房租" >
            <Input v-model="kitchen.kitchen_rent" placeholder="输入应支出房租(每月)" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="垃圾及隔油池" >
            <Input v-model="kitchen.garbage_fee" placeholder="输入垃圾及隔油池(固定费用)" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="烟道清洗" >
            <Input v-model="kitchen.flue_fee" placeholder="输入烟道清洗(固定费用)" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="消杀" >
            <Input v-model="kitchen.kill_fee" placeholder="输入消杀(固定费用)" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="网络使用费" >
            <Input v-model="kitchen.network_fee" placeholder="输入网络使用费(固定费用)" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="卫生费" >
            <Input v-model="kitchen.health_fee" placeholder="输入卫生费(固定费用)" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="电费基数" >
            <Input v-model="kitchen.energy_fee" placeholder="输入电费基数(固定费用)" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="水费基数" >
            <Input v-model="kitchen.water_fee" placeholder="输入水费基数(固定费用)" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Divider />
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10" >
          <FormItem label="账户名称" >
            <Input v-model="kitchen.card_name" placeholder="账户名称" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="开户银行" >
            <Input v-model="kitchen.card_bank" placeholder="例如：中国邮政储蓄银行北京昌平区北七家支行" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10" >
          <FormItem label="账户号" >
            <Input v-model="kitchen.card_no" placeholder="例如：6217 XXXXXXXXXXX" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="公司名" >
            <Input v-model="kitchen.company" placeholder="公司名" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Divider />
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="开业时间" >
            <DatePicker type="date" placeholder="选择开业时间" @on-change="getStartDatePicker" :value="kitchen.start_date" format="yyyy-MM-dd" style="width: 200px"></DatePicker>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="租金账单日" >
            <Input v-model="kitchen.rent_day" placeholder="不大于28" style="width: 200px"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="运营账单日" >
            <Input v-model="kitchen.operate_day" placeholder="不大于28" style="width: 200px"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Divider />
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem>
             <Button type="primary" @click="editBaseinfo">保存</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { getKitchenShow , editKitchen  } from '@/api/setting'
import { getManageList } from '@/api/data'
export default {
  name: 'KDSLKitchenBaseForm',
  components: {
    
  },
  props: {
    kitchen_id:{
      default () {
        return ''
      }
    },
  },
  data () {
    return {
      manageList:[],
      kitchen:{},
      eidtkitchen:{},
    }
  },
  methods: {
    getStartDatePicker (date) {
      this.kitchen.start_date = date
    },
    // 获取店内列表
    getManageList(){
      getManageList().then(res => {
        const dbody = res.data
        this.manageList = dbody.data
      })
    },
    getKitchenShow( data ){
      getKitchenShow( data ).then(res => {
        let that = this;
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.kitchen = dbody.data;
      })
    },
    setBaseInfo( obj ){
      this.eidtkitchen = Object.assign({position:0},obj);
      delete this.eidtkitchen.create_time
      delete this.eidtkitchen.update_time
      if(!this.eidtkitchen.manage_id){
        this.$Notice.warning({
            title: '店长必须选择！'
          })
        return false
      }
      // if(!this.eidtkitchen.start_date){
      //   this.$Notice.warning({
      //       title: '开业时间必须选择！'
      //     })
      //   return false
      // }
      if( isNaN(this.eidtkitchen.rent_day) || isNaN(this.eidtkitchen.operate_day)){
        this.$Notice.warning({
            title: '账单日期输入错误'
          })
        return false
      }
      if(this.eidtkitchen.rent_day*1 > 28 || this.eidtkitchen.operate_day*1 > 28){
        this.$Notice.warning({
            title: '账单日期不能大于28'
          })
        return false
      }
      return true;
    },
    editBaseinfo(){
      if(this.setBaseInfo( this.kitchen )){
        let data = Object.assign({},this.eidtkitchen);
        this.manageList.forEach((item)=>{
          if(item.id == data.manage_id){
             data.manage_name =  item.fullname
          }
        })
        editKitchen(data).then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          // 处理成功逻辑
          this.$Notice.warning({
            title: "保存成功！"
          })
          setTimeout(()=>{
            this.$router.go(-1)
          }, 1000)
        })
      }
    },
    // init
    initData(){
      if(!this.kitchen_id){
        return
      }
      this.getKitchenShow({id:this.kitchen_id})
    },
  },
  created(){
    this.getManageList();
  },
  mounted () {
    this.initData();
  },
  beforeDestroy () {
    
  },
  watch: {
    kitchen_id (newV, oldV) {
      this.initData();
    },
  }
}
</script>
