<template>
  <div>
    <Modal v-model="periodStoreModalshow" title="店铺周期表格导出" ok-text="导出" @on-ok="expordPSExcal">
        <Form :label-width="80">
          <FormItem label="选择厨房">
            <Select v-model="pSE_kitchenID" style="width: 200px">
              <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="选择周期">
            <DatePicker format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择时间" style="width: 200px" @on-change="selectPSEdate"></DatePicker>
          </FormItem>
        </Form>
    </Modal> 
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
        <Button @click="buildStore" size="small" slot="extra">店铺建档</Button>
        <Button @click="periodStoreModalshow = true" size="small" slot="extra" style="margin-left: 3px;">周期表格</Button>
        <TabPane label="建档中">
          <FSLPreBuildShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="起租中">
          <FSLStartShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="租赁中">
          <FSLNormalShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="退租中">
          <FSLEndShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="退款中">
          <FSLRefundShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="已归档" >
          <FSLEliminateShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
        <TabPane label="全部商户">
          <FSLAllShopsTables :sreachInfo = "submitSreachInfo" />
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
// 权限
// Kitchen/index,StoreLease/index,StoreLease/exportStoreLease,StoreLease/settle,StoreLease/edit

import FSLStartShopsTables from './components/FSLStartShopsTables'
import FSLNormalShopsTables from './components/FSLNormalShopsTables'
import FSLEndShopsTables from './components/FSLEndShopsTables'
import FSLRefundShopsTables from './components/FSLRefundShopsTables'
import FSLEliminateShopsTables from './components/FSLEliminateShopsTables'
import FSLAllShopsTables from './components/FSLAllShopsTables'
import FSLPreBuildShopsTables from './components/FSLPreBuildShopsTables'

import { getKitchenList } from '@/api/data'

export default {
  name: 'financeShopList',
  components: {
    FSLStartShopsTables,
    FSLNormalShopsTables,
    FSLEndShopsTables,
    FSLRefundShopsTables,
    FSLEliminateShopsTables,
    FSLAllShopsTables,
    FSLPreBuildShopsTables
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
      // 查看操作
      // 导出周期表格
      periodStoreModalshow:false,
      pSE_kitchenID:'',
      selectPSEdate_s:'',
      selectPSEdate_e:'',
    }
  },
  methods: {
    // 搜索函数
    sreachData(){
      this.submitSreachInfo = Object.assign({},this.sreachInfo);
    },
    // 财务建档案
    buildStore(){
      const route = {
        name: 'financeBuild'
      }
      this.$router.push(route)
    },
    // 表格时间
    selectPSEdate(date){
      this.selectPSEdate_s = date[0]
      this.selectPSEdate_e = date[1]
    },
    // 导出表格操作
    expordPSExcal(){
      if (!this.pSE_kitchenID) {
        this.$Notice.warning({
          title: '请选择厨房！'
        })
        return false
      }
      if (!this.selectPSEdate_s || !this.selectPSEdate_e) {
        this.$Notice.warning({
          title: '请选择时间段！'
        })
        return false
      }
      const href = "./api/StoreLease/exportStoreLease?kitchen_id="+ this.pSE_kitchenID +"&start_date="+ this.selectPSEdate_s +"&end_date="+ this.selectPSEdate_e +"";
      window.open(href, '_blank')
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
