<template>
  <div>
    <div>
      <Card shadow>
        <Row :gutter="20">
          <i-col :xs="4" :md="4" :lg="4">
            <Select v-model="sreachInfo.kitchen_id" @on-change="sreachData">
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
    <Tabs :animated="false" style="margin-top: 5px;">
        <TabPane label="建档中">
          <CSLPreBuildShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="起租中">
          <CSLStartShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="租赁中">
          <CSLNormalShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="退租中">
          <CSLEndShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="退款中">
          <CSLRefundShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="已归档">
          <CSLEliminateShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="全部商户">
          <CSLAllShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import CSLStartShopsTables from './components/CSLStartShopsTables'
import CSLNormalShopsTables from './components/CSLNormalShopsTables'
import CSLEndShopsTables from './components/CSLEndShopsTables'
import CSLRefundShopsTables from './components/CSLRefundShopsTables'
import CSLEliminateShopsTables from './components/CSLEliminateShopsTables'
import CSLAllShopsTables from './components/CSLAllShopsTables'
import CSLPreBuildShopsTables from './components/CSLPreBuildShopsTables'

// 权限
// /api/Kitchen/index,/api/StoreLease/index
import { getKitchenList } from '@/api/data'
export default {
  name: 'canvassShopList',
  components: {
    CSLStartShopsTables,
    CSLNormalShopsTables,
    CSLEndShopsTables,
    CSLRefundShopsTables,
    CSLEliminateShopsTables,
    CSLAllShopsTables,
    CSLPreBuildShopsTables
  },
  data () {
    return {
      // 搜索部分
      sreachInfo:{
        kitchen_id:'',
        keyword:'',
      },
      submitSreachInfo:{},
      kitchenList:[],
    }
  },
  methods: {
    // 搜索函数
    sreachData(){
      this.submitSreachInfo = Object.assign({},this.sreachInfo);
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
      this.sreachInfo.kitchen_id = this.kitchenList.length > 0 ? this.kitchenList[this.kitchenList.length - 1].id : '';
      this.sreachData();
    }) 
  }
}
</script>

<style>

</style>
