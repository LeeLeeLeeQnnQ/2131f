<template>
    <Card shadow>
      <p slot="title">
        {{kitchen_name}}  {{store_no}}  {{store_name}}
      </p>
      <Tabs :animated="false" style="margin-top: 5px;" class="h100">
        <TabPane label="起租相关">
          <Form :label-width="120">
            <Row type="flex" justify="start" align="middle" :gutter="20">
              <i-col span="10">
                <FormItem label="起租日期">
                  <DatePicker type="date" placeholder="起租日期" :value="leaseinfo.start_date" @on-change="getStartDatePicker"  format="yyyy-MM-dd" style="width: 200px"></DatePicker>
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
            <Row type="flex" justify="start" align="middle" :gutter="20" style="margin-bottom: 300px;">
              <i-col span="10">
                <FormItem>
                  <Button @click="startStoreModal = true" type="warning">店铺起租</Button>
                </FormItem>
              </i-col>
            </Row>
          </Form>
          <Modal v-model="startStoreModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>确认店铺起租么？</span>
            </p>
            <div slot="footer">
                <Button type="error" size="large" long @click="leaseinfoSubmit">确认</Button>
            </div>
          </Modal>
        </TabPane>
      </Tabs>
    </Card>
</template>

<script>
import Tables from '_c/tables'
// 权限
// /api/StoreLease/show,/api/StoreLease/edit,/api/StoreLease/start
import { getShopDetail , setStartShopEdit } from '@/api/data'
import { startShopStart } from '@/api/finance'
export default {
  name: 'kitchenShopHandle',
  components: {
    Tables
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
      // 租期租约
      leaseinfo:{},
      startStoreModal:false,
    }
  },
  methods: {
    // 租期租约卡片
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
    //租期租约卡片
    initLeaseinfo( data ){
      // 起租日期
      this.leaseinfo.start_date = data.start_date || '';
      // 接驳时间
      this.leaseinfo.connect_date = data.connect_date || '';
      // 公摊起始日期
      this.leaseinfo.entrance_date = data.entrance_date || '';
      // 入场日期
      this.leaseinfo.join_date = data.join_date || '';
      // 水电表底数
      this.leaseinfo.start_energy = data.start_energy || '';
      this.leaseinfo.start_water = data.start_water || '';
    },
    // 保存按钮
    leaseinfoSubmit( ){
      if(!this.leaseinfo.start_date){
        this.$Notice.warning({
          title: "起租日期必须填写！"
        })
        return
      }
      if(!this.leaseinfo.entrance_date){
        this.$Notice.warning({
          title: "公摊起始日期必须填写！"
        })
        return
      }
      if(!this.leaseinfo.join_date){
        this.$Notice.warning({
          title: "入场日期必须填写！"
        })
        return
      }
      if(this.leaseinfo.start_energy*1 < 0){
        this.$Notice.warning({
          title: "电费起始必须填写！"
        })
        return
      }
      if(this.leaseinfo.start_water*1 < 0){
        this.$Notice.warning({
          title: "水费起始必须填写！"
        })
        return
      }
      this.leaseinfo.kitchen_id = this.kitchen_id;
      this.leaseinfo.store_id = this.store_id;
      setStartShopEdit(this.leaseinfo).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.startShopStart(this.store_id);
        } else {
          this.$Notice.warning({
            title: dbody.msg
          })
        }
      })
    },
    // 允许起租
    startShopStart( id ){
      startShopStart( id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "操作完成！"
        })
        this.$router.go(-1);
      })
    },




    //初始化数据
    initData ( data ) {
      //厨房  商户名 档口号
      this.kitchen_name = data.kitchen_name;
      this.store_name = data.store_name;
      this.store_no = data.store_no;
      this.initLeaseinfo( data );
    }
  },
  computed: {
  },
  created: function () {
    let id = this.$route.query.id
    let kitchen_id = this.$route.query.kitchen_id
    let that = this
    this.store_id = id
    this.kitchen_id = kitchen_id
    getShopDetail({id: id, lease_type: 0}).then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        setTimeout(function (argument) {
          that.$router.go(-1)
        }, 1000)
        return
      }
      // 初始化函数
      this.initData(dbody.data)
    })
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
