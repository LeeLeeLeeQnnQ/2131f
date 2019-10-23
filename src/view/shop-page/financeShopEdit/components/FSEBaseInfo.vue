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
          <FormItem label="签约时间" prop="sign_date">
            <DatePicker :value="baseinfo.sign_date" format="yyyy-MM-dd" type="date" placeholder="签约时间" style="width: 200px" @on-change="setSignDate" ></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="客户ID" prop="customer_id">
            <Input v-model="baseinfo.customer_id" placeholder="客户ID"></Input>
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
<!--         <i-col span="10">
          <FormItem label="负责店长" prop="manage_id">
              <Select v-model="baseinfo.manage_id" @on-change="selectmanageName">
                <Option v-for="item in manageList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
              </Select>
          </FormItem>
        </i-col> -->
        <i-col span="10">
          <FormItem label="招商经理" prop="manage_lease_id">
               <Select
                v-model="baseinfo.manage_lease_id"
                filterable
                remote
                clearable
                :remote-method="remoteLeaseMethod"
                :loading="remoteLoading"
                @on-change="selectmanageLease"
                >
                <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
              </Select>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="所属厨房" prop="kitchen_id">
            <Select v-model="baseinfo.kitchen_id" @on-change="selectKitchen">
                <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="档口选择" prop="store_no">
            <Select v-model="baseinfo.store_no">
                <Option v-for="item in shopList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="月租金">
            <Input v-model="baseinfo.month_rent" placeholder="输入月租金"></Input>
          </FormItem>
        </i-col>
         <i-col span="10" offset="2">
          <FormItem label="押金">
            <Input v-model="baseinfo.deposit_fee" placeholder="输入押金"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="入场费">
            <Input v-model="baseinfo.entrance_fee" placeholder="输入入场费"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="增容费">
            <Input v-model="baseinfo.zr_fee" placeholder="输入增容费"></Input>
          </FormItem>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <FormItem label="收费周期" prop="rent_bill">
            <Input v-model="baseinfo.rent_bill" placeholder="房租收费周期／月"></Input>
          </FormItem>
        </i-col>
        <i-col span="10" offset="2">
          <FormItem label="首期起租缴纳房租期数" prop="rent_start">
            <Input v-model="baseinfo.rent_start" placeholder="首期起租缴纳房租期数／月"></Input>
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

import { getManageList , getLeasingList , getKitchenList , getStoreNoList , setStartShopEdit  ,isExistCustome } from '@/api/data'
export default {
  name: 'FSEBaseInfo',
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
      // 基本资料
      baseinfo:{},
      // 店长列表
      // manageList: [],
      // 招商列表
      leasingList:[],
      remoteLoading:false,
      // 厨房列表
      kitchenList:[],
      // 商户列表
      shopList:[],
      
    }
  },
  methods: {
    remoteLeaseMethod (query) {
        if (query !== '') {
          this.remoteLoading = true;
          getLeasingList({keyword:query}).then(res => {
            const dbody = res.data
            this.remoteLoading = false;
            if (dbody.code != 0) {
              this.$Notice.warning({
                title: dbody.msg
              })
              return
            }
            this.leasingList = dbody.data || [];
          }).catch(err =>{
            this.remoteLoading = false;
          })
        } else {
          this.leasingList = [];
        }
    },
    initData(){
      let data = Object.assign({},this.data)
      if(!data.id){
        return
      }
      let obj = {
        id:data.manage_lease_id,
        fullname:data.manage_lease,
      }
      this.leasingList = [];
      this.leasingList.push(obj);
      this.$nextTick(() => {
        this.baseinfo = Object.assign({},this.data)
      })
    },
    // 设置签约时间
    setSignDate(date){
      this.baseinfo.sign_date = date;
    },
    // 依据店长ID获取店长姓名
    // selectmanageName () {
    //   let key = this.baseinfo.manage_id
    //   let that = this
    //   this.manageList.forEach(function (item) {
    //     if (item.id == key) {
    //       that.baseinfo.manage_name = item.fullname
    //     }
    //   })
    // },
    // 依据招商ID获取店长姓名
    selectmanageLease () {
      let key = this.baseinfo.manage_lease_id
      let that = this
      this.leasingList.forEach(function (item) {
        if (item.id == key) {
          that.baseinfo.manage_lease = item.fullname
        }
      })
    },
    // 选择厨房
    selectKitchen () {
      const id = this.baseinfo.kitchen_id;
      let kitchen_name_arr = this.kitchenList.filter(function( item ){
        return item.id == id;
      });
      this.baseinfo.kitchen_name = kitchen_name_arr[0].kitchen_name;
      let that = this;
      this.baseinfo.store_no = '';
      getStoreNoList({ kitchen_id:id }).then(res => {
        const dbody = res.data
        this.shopList = dbody.data || [];
      })
    },
    // 提交基本卡片
    baseinfoSubmit(){
      this.isExistCustome(this.baseinfo)
    },
    // 客户是否存在
    isExistCustome(obj){
      let info = { customer_id : obj.customer_id }
      isExistCustome( info ).then(res => {
        let dbody = res.data;
        if (dbody.code == 0) {
          let data = dbody.data;
          if(!!data){
            if (this.baseinfoSubmitValidateField(obj)) {
              delete obj.update_time
              delete obj.create_time
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
            }
            return
          }else{
            this.$Notice.warning({
              title: '请输入正确客户ID！'
            })
            return false
          }
        }else{
          this.$Notice.warning({
            title: '请输入正确客户ID！'
          })
          return false
        }
      })
    },
    // 提交验证器
    baseinfoSubmitValidateField(obj) {
      obj.store_name = obj.store_name.trim()
      let priceReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!obj.store_name) {
        this.$Notice.warning({
          title: '请输入正确标题！'
        })
        return false
      }
      if (!obj.sign_date) {
        this.$Notice.warning({
          title: '请选择正确签约时间！'
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
      // if (!obj.manage_id || !obj.manage_name) {
      //   this.$Notice.warning({
      //     title: '请选择店长！'
      //   })
      //   return false
      // }
      if (!obj.manage_lease_id || !obj.manage_lease) {
        this.$Notice.warning({
          title: '请选择招商经理！'
        })
        return false
      }
      if (!obj.kitchen_id) {
        this.$Notice.warning({
          title: '请选择厨房！'
        })
        return false
      }
      if (!obj.store_no) {
        this.$Notice.warning({
          title: '请选择档口号！'
        })
        return false
      }
      if (!obj.month_rent || obj.month_rent * 1 <= 0 || !priceReg.test(obj.month_rent)) {
        this.$Notice.warning({
          title: '请输入正确租金！'
        })
        return false
      };
      if (!obj.deposit_fee || obj.deposit_fee * 1 <= 0 || !priceReg.test(obj.deposit_fee)) {
        this.$Notice.warning({
          title: '请输入正确押金！'
        })
        return false
      };
      if ( obj.entrance_fee * 1 < 0 || !obj.entrance_fee ||  !priceReg.test(obj.entrance_fee)) {
        this.$Notice.warning({
          title: '请输入正确入场费！'
        })
        return false
      };
      if (obj.zr_fee * 1 < 0 || !obj.zr_fee ||  !priceReg.test(obj.zr_fee)) {
        this.$Notice.warning({
          title: '请输入正确增容费！'
        })
        return false
      };
      if (!obj.rent_bill || isNaN(obj.rent_bill)) {
        this.$Notice.warning({
          title: '请填写房租账单周期！'
        })
        return false
      }
      if (!obj.rent_start || isNaN(obj.rent_start) || obj.rent_start > 12) {
        this.$Notice.warning({
          title: '请正确填写首期起租缴纳房租期数！'
        })
        return false
      }
      return true
    },
    // getManageList(){
    //   getManageList().then(res => {
    //     const dbody = res.data
    //     let that = this
    //     this.manageList = dbody.data || []
    //   })
    // },
    // getLeasingList(){
    //   getLeasingList().then(res => {
    //     const dbody = res.data
    //     let that = this
    //     this.leasingList = dbody.data || []
    //   })
    // },
    getKitchenList(){
      getKitchenList().then(res => {
        let that = this
        const dbody = res.data
        this.kitchenList = dbody.data || []
        this.kitchenList.forEach(function (item) {
          if (item.id == that.baseinfo.kitchen_id) {
            // 获取店铺
            getStoreNoList({kitchen_id:item.id}).then(res => {
              const body = res.data
              that.shopList = body.data || []
            })
          }
        })
      })
    }, 
  },
  created () {
    this.initData();
    // this.getManageList();
    // this.getLeasingList();
    this.getKitchenList();
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