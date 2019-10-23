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
    <Tabs :animated="false" style="margin-top: 5px;" >
        <Button @click="quitStore" size="small" slot="extra">店铺退租</Button>
        <TabPane label="起租中">
          <KSLStartShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="租赁中">
          <KSLNormalShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="退租中">
          <KSLEndShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="退款中">
          <KSLRefundShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="已归档">
          <KSLEliminateShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="全部商户">
          <KSLAllShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import KSLStartShopsTables from './components/KSLStartShopsTables'
import KSLNormalShopsTables from './components/KSLNormalShopsTables'
import KSLEndShopsTables from './components/KSLEndShopsTables'
import KSLRefundShopsTables from './components/KSLRefundShopsTables'
import KSLEliminateShopsTables from './components/KSLEliminateShopsTables'
import KSLAllShopsTables from './components/KSLAllShopsTables'

// 权限
// /api/Kitchen/index,/api/StoreLease/index,Index/getKitchenList
import { getKitchenList } from '@/api/data'
export default {
  name: 'kitchenShopList',
  components: {
    KSLStartShopsTables,
    KSLNormalShopsTables,
    KSLEndShopsTables,
    KSLRefundShopsTables,
    KSLEliminateShopsTables,
    KSLAllShopsTables
  },
  data () {
    return {
      sreachInfo:{
        kitchen_id:'',
        keyword:'',
      },
      submitSreachInfo:{},
      kitchenList:[],
    }
  },
  methods: {
    // 店铺退租
    quitStore(){
      const route = {
        name: 'kitchenShopEliminate'
      }
      this.$router.push(route)
    },
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
