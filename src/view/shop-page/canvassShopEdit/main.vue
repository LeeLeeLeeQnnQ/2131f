<template>
    <Card shadow>
      <p slot="title">
        {{baseinfo.kitchen_name}}  {{baseinfo.store_no}}  {{baseinfo.store_name}}
      </p>
      <Tabs :animated="false" style="margin-top: 5px;" class="h100">
        <TabPane label="店铺租约">
          <CSEBaseInfo :baseinfo="baseinfo" />
        </TabPane>
        <TabPane label="合同凭证">
          <CSEPictrueInfo :baseinfo="baseinfo" />
        </TabPane>
      </Tabs>
    </Card>
</template>

<script>
// 权限
// /api/StoreLease/show,/api/StoreLease/edit
import CSEBaseInfo from './components/CSEBaseInfo'
import CSEPictrueInfo from './components/CSEPictrueInfo'
import { getShopDetail , setStartShopEdit } from '@/api/data'
export default {
  name: 'canvassShopEdit',
  components: {
    CSEBaseInfo,
    CSEPictrueInfo
  },
  data () {
    return {
      // 租期租约
      baseinfo:{},
    }
  },
  methods: {
    
  },
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
        setTimeout(()=>{
          this.$router.go(-1)
        }, 1000)
        return
      }
      // 初始化函数
      this.baseinfo = dbody.data || {};
    })
  }
}
</script>

