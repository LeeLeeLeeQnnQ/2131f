<template>
    <Card shadow>
      <p slot="title">
        {{data.kitchen_name}}  {{data.store_no}}  {{data.store_name}}
      </p>
      <Tabs :animated="false" style="margin-top: 5px;">
        <TabPane label="基本资料">
          <SDBaseInfo :data="data" />
        </TabPane>
        <TabPane label="租期租约">
          <SDLeaseInfo :data="data" />
        </TabPane>
        <TabPane label="签约凭证">
          <SDVoucherInfo :data="data" />
        </TabPane>
        <TabPane label="人员列表">
          <SDMemberInfo :data="data" />
        </TabPane>
        <TabPane label="设备清单">
          <SDEquipmentInfo :data="data" />
        </TabPane>
        <TabPane label="店铺缴费">
          <SDBudgetInfo :data="data" />
        </TabPane>
      </Tabs>
    </Card>
</template>

<script>
//权限
//  StoreLease/show,StoreEmployee/index,StoreDevice/show,StoreBill/index,
import { getShopDetail } from '@/api/data'
import { getStoreEmployeeList , showStoreDevice , getStoreBillListPage  } from '@/api/kitchen'
import { getStoreBillPayPage , getStoreBillPayList } from '@/api/finance'


import SDBaseInfo from './components/SDBaseInfo'
import SDLeaseInfo from './components/SDLeaseInfo'
import SDVoucherInfo from './components/SDVoucherInfo'
import SDMemberInfo from './components/SDMemberInfo'
import SDEquipmentInfo from './components/SDEquipmentInfo'
import SDBudgetInfo from './components/SDBudgetInfo'

export default {
  name: 'shopDetail',
  components: {
    SDBaseInfo,
    SDLeaseInfo,
    SDVoucherInfo,
    SDMemberInfo,
    SDEquipmentInfo,
    SDBudgetInfo,
  },
  data () {
    return {
      data:{},
    }
  },
  methods: {
  },
  created: function () {
    let id = this.$route.query.id
    getShopDetail({id: id, lease_type: 0}).then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        setTimeout((argument)=>{
          this.$router.go(-1)
        }, 1000)
        return
      }
      this.data = dbody.data
    })
  },
}
</script>
