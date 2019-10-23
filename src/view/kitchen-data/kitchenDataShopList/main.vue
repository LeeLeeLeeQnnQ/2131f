<template>
  <div>
    <div>
      <Card shadow>
        <Row :gutter="20">
          <i-col :xs="4" :md="4" :lg="4">
            <Select v-model="sreachInfo.kitchen_id" disabled >
              <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
            </Select>
          </i-col>
        </Row>
      </Card>
      <Card shadow style="margin-top: 5px">
        <Row :gutter="20">
          <i-col :xs="4" :md="4" :lg="4">
            <Input v-model="sreachInfo.keyword" placeholder="请输入店铺名称/档口号"/>
          </i-col>
          <i-col :xs="4" :md="4" :lg="4">
            <Button type="primary" @click="sreachData">搜索</Button>
          </i-col>
        </Row>
      </Card>
    </div>

    <Tabs :animated="false" @on-click="setCard" style="margin-top: 5px;" :value="tabValue">
        <TabPane label="起租中" name="1">
          <KDSLStartShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="租赁中" name="2">
          <KDSLNormalShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="退租中" name="3">
          <KDSLEndShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="退款中" name="7">
          <KDSLRefundShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="已归档" name="4">
          <KDSLEliminateShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="全部商户" name="5">
          <KDSLAllShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Tables from '_c/tables'
import merge from 'webpack-merge'
// 权限
// /api/Kitchen/index,/api/StoreLease/index,Index/getKitchenList
import KDSLStartShopsTables from './components/KDSLStartShopsTables'
import KDSLNormalShopsTables from './components/KDSLNormalShopsTables'
import KDSLEndShopsTables from './components/KDSLEndShopsTables'
import KDSLRefundShopsTables from './components/KDSLRefundShopsTables'
import KDSLEliminateShopsTables from './components/KDSLEliminateShopsTables'
import KDSLAllShopsTables from './components/KDSLAllShopsTables'



import { getKitchenList } from '@/api/data'


export default {
  name: 'kitchenDataShopList',
  components: {
    Tables,
    KDSLStartShopsTables,
    KDSLNormalShopsTables,
    KDSLEndShopsTables,
    KDSLRefundShopsTables,
    KDSLEliminateShopsTables,
    KDSLAllShopsTables
  },
  data () {
    return {
      // 搜索部分
      kitchenList:[],
      tabValue:'1',
      sreachInfo:{
        kitchen_id:'',
        keyword:'',
      },
      submitSreachInfo:{},
    }
  },
  methods: {
    // 搜索函数
    sreachData(){
      this.submitSreachInfo = Object.assign({},this.sreachInfo);
    },
    // 卡片路由
    setCard(num){
      this.tabValue = num;
      this.$router.push({
          query:merge(this.$route.query,{'tabValue':this.tabValue})
      })
    },
  },
  mounted () {
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
      if(!!this.$route.query.kitchen_id){
        this.sreachInfo.kitchen_id = this.$route.query.kitchen_id*1;
      }else{
        this.sreachInfo.kitchen_id = this.kitchenList.length > 0 ? this.kitchenList[this.kitchenList.length - 1].id : '';
      }
      if(!!this.$route.query.tabValue){
        this.tabValue = this.$route.query.tabValue;
      }
      this.sreachData();
    })
  }
}
</script>

<style>

</style>
