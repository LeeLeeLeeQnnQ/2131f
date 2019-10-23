<template>
  <Card shadow>
    <Tabs>
      <TabPane label="基础资料">
        <KDSLKitchenBaseForm :kitchen_id = "kitchen_id" />
      </TabPane>
      <TabPane label="档口列表">
        <KDSLKitchenStoreList :kitchen_id = "kitchen_id" />
      </TabPane>
      <TabPane label="公摊表">
        <KDSLKitchenMeter :kitchen_id = "kitchen_id" />
      </TabPane>
      <TabPane label="支出列表">
        <KDSLKitchenExpendList :kitchen_id = "kitchen_id" />
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import Tables from '_c/tables'
import KDSLKitchenBaseForm from './components/KDSLKitchenBaseForm'
import KDSLKitchenStoreList from './components/KDSLKitchenStoreList'
import KDSLKitchenMeter from './components/KDSLKitchenMeter'
import KDSLKitchenExpendList from './components/KDSLKitchenExpendList'
// 权限
// /api/Kitchen/index,/api/KitchenStore/index,/api/KitchenStore/add,/api/KitchenStore/edit,/api/KitchenStore/delete,/api/KitchenMeter/queryList,/api/KitchenMeter/add,/api/KitchenMeter/delete,/api/KitchenExpend/index
export default {
  name: 'kitchenDataKitchenDetail',
  components: {
    Tables,
    KDSLKitchenBaseForm,
    KDSLKitchenStoreList,
    KDSLKitchenMeter,
    KDSLKitchenExpendList
  },
  data () {
    return {
      kitchen_id:'',
    }
  },
  methods: {
    
  },
  created () {
    this.$nextTick(()=>{
      this.kitchen_id = this.$route.query.kitchen_id;
    })
  }
}
</script>


<style lang="less" scoped>
  .ivu-tabs-content{
    overflow-x: hidden;
  }
  .tableFooter{
    margin-left: 20px;
  }
  .cellTit{
    margin-bottom: 12px;
    span{
      color:#fff;
      background-color:#3399ff;
      border-radius:5px;
      padding:5px 8px;
      margin-right: 10px;
    }
    .noData{
      background-color: #ff9900;
    }
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
