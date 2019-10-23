<template>
    <Card shadow>
      <p slot="title">
        {{data.kitchen_name}}  {{data.store_no}}  {{data.store_name}}
      </p>
      <Tabs :animated="false" style="margin-top: 5px;" class="h100">
        <TabPane label="基本资料" style="min-height: 450px;">
          <KSEBaseInfo :data="data" />
        </TabPane>
        <TabPane label="起租相关">
          <KSEStartInfo :data="data" />
        </TabPane>
        <TabPane label="退租相关">
          <KSEEndInfo :data="data" />
        </TabPane>
        <TabPane label="人员列表">
          <KSEMemberInfo :data="data" />
        </TabPane>
        <TabPane label="设备清单">
          <KSEDeviceInfo :data="data" />
        </TabPane>
      </Tabs>
    </Card>
</template>

<script>
import Tables from '_c/tables'
// 权限
// /api/StoreLease/show,/api/StoreLease/edit,/api/StoreEmployee/index,/api/StoreEmployee/add,/api/StoreEmployee/edit,/api/StoreEmployee/delete,/api/StoreDevice/show
import { getShopDetail } from '@/api/data'

import KSEBaseInfo from './components/KSEBaseInfo'
import KSEStartInfo from './components/KSEStartInfo'
import KSEMemberInfo from './components/KSEMemberInfo'
import KSEDeviceInfo from './components/KSEDeviceInfo'
import KSEEndInfo from './components/KSEEndInfo'

export default {
  name: 'kitchenShopEdit',
  components: {
    Tables,
    KSEBaseInfo,
    KSEStartInfo,
    KSEMemberInfo,
    KSEDeviceInfo,
    KSEEndInfo
  },
  data () {
    return {
      data:{},
    }
  },
  methods: {},
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
