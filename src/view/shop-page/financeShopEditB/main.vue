<template>
    <Card shadow>
      <p slot="title">
        {{data.kitchen_name}}  {{data.store_no}}  {{data.store_name}}
      </p>
      <Tabs :animated="false" style="margin-top: 5px;" class="h100">
        <TabPane label="基本资料">
          <FSEBaseInfoB :data="data" />
        </TabPane>
        <TabPane label="起租凭证">
          <FSEVoucherinfoB :data="data" />
        </TabPane>
        <TabPane label="退租凭证">
          <FSEEndInfo :data="data" />
        </TabPane>
      </Tabs>
    </Card>
</template>

<script>
  // 权限
// Index/getEmployeeList,Index/getEmployeeList,StoreLease/show,Index/getKitchenList,Index/getStoreNo,StoreLease/edit,Index/getWorkCategory,StoreLease/refund,Clue/existCustomer
import { getShopDetail } from '@/api/data'
import FSEBaseInfoB from './components/FSEBaseInfoB'
import FSEVoucherinfoB from './components/FSEVoucherinfoB'
import FSEEndInfo from './components/FSEEndInfo'
export default {
  name: 'financeShopEditB',
  components: {
    FSEBaseInfoB,
    FSEVoucherinfoB,
    FSEEndInfo
  },
  data () {
    return {
      data:{},
    }
  },
  methods: {},
  computed: {
    
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
