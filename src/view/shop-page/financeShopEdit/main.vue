<template>
    <Card shadow>
      <p slot="title">
        {{data.kitchen_name}}  {{data.store_no}}  {{data.store_name}}
      </p>
      <Tabs :animated="false" style="margin-top: 5px;" class="h100">
        <TabPane label="基本资料" style="min-height: 450px;">
          <FSEBaseInfo :data="data" />
        </TabPane>
        <TabPane label="起租凭证">
          <FSEVoucherinfo :data="data" />
        </TabPane>
      </Tabs>
    </Card>
</template>

<script>
// 权限
// /api/Index/getEmployeeList,/api/Index/getEmployeeList,/api/StoreLease/show,/api/Index/getKitchenList,/api/Index/getStoreNo,/api/StoreLease/edit, ,Clue/existCustomer
import { getShopDetail } from '@/api/data'
import FSEBaseInfo from './components/FSEBaseInfo'
import FSEVoucherinfo from './components/FSEVoucherinfo'
export default {
  name: 'financeShopEdit',
  components: {
    FSEBaseInfo,
    FSEVoucherinfo
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
        setTimeout(()=> {
          this.$router.go(-1)
        }, 1000)
        return
      }
      this.data = dbody.data;
    })
  }
}
</script>


