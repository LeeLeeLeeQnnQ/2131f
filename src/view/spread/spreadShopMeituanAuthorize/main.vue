<template>
  <div>
    <!-- 列表 -->
    <Card shadow>
      <tables ref="tables"
              v-model="shopList"
              @data-shop-edit="handleEditShopInfo" 
              @data-shop-authorize="handleShopAuthorize" 
              :columns="columns"/>
      <Page :total="page.total"
            :page-size="page.list_rows"
            style="margin-top:10px;"
            @on-change="getNewPage"/>
    </Card>
    <Modal title="修改商户"
      v-model="editShopInfo"
      @on-ok="editStoreMeituan">
      <Form :model="shopInfo" :label-width="120" inline>
          <FormItem label="账号">
            <Input v-model="shopInfo.username" placeholder="商户账号" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="密码">
            <Input v-model="shopInfo.password" placeholder="密码" style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
// 权限
// StoreMeituan/index,StoreMeituan/edit,StoreMeituan/auth
import { getStoreMeituanList , editStoreMeituan } from '@/api/spread'
import Tables from '_c/tables'
export default {
  name: 'spreadShopMeituanAuthorize',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {title: 'ID', key: 'id', width: 80 },
        {title: '商铺名称', key: 'store_name'},
        {title: '授权状态', 
          render: (h, params) => {
            let auth_state = params.row.auth_state*1
            if(auth_state == 0){
              return h('span', { style: {color: '#2d8cf0'}}, '未绑定')
            }else if (auth_state == 1) {
              return h('span', { style: {color: '#19be6b'}}, '已绑定' )
            }else if (auth_state == 2) {
              return h('span', { style: {color: '#8b56dd'}}, '已解绑' )
            }
          }
        },
        {title: '商户Id', key: 'id'},
        {title: 'appAuthToken', key: 'appAuthToken'},
        {title: 'ePoiId', key: 'ePoiId'},
        {title: 'poiId', key: 'poiId'},
        {title: 'poiName', key: 'poiName'},
        {title: 'poiPhone', key: 'poiPhone'},
        {
          title: '编辑',
          key: 'handle',
          width :80,
          button: [
            (h, params, vm) => {
              let obj = Object.assign({'infoType':'1'},params.row)
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-shop-edit', obj)
                  }
                }},
              '编辑')
            },
          ]
        },
        {
          title: '授权',
          key: 'handle',
          width :80,
          button: [
            (h, params, vm) => {
              let obj = Object.assign({'infoType':'1'},params.row)
              return h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-shop-authorize', obj)
                  }
                }},
              '授权')
            },
          ]
        },
      ],
      page: {
        current_page: '',
        last_page: '',
        list_rows: 0,
        total: 0
      },
      shopList: [],
      // 编辑商户
      editShopInfo:false,
      shopInfo:{},
    }
  },
  methods: {
    // getNewPage
    getNewPage (page) {
      this.init({ page : page });
    },
    // 修改商户信息
    handleEditShopInfo(info){
      this.shopInfo = {};
      this.shopInfo.id = info.id;
      this.shopInfo.username = info.username;
      this.shopInfo.shop_name = info.shop_name;
      this.editShopInfo = true;
    },
    // editStoreEle
    editStoreMeituan(){
      if(!this.shopInfo.username){
        this.$Notice.warning({
          title: '商户账号有误！'
        })
        return
      }
      if(!this.shopInfo.password){
        this.$Notice.warning({
          title: '商户密码有误！'
        })
        return
      }
      editStoreMeituan(this.shopInfo).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }else{
          this.$Notice.warning({
            title: '修改成功！'
          })
          this.init({ page : this.page.current_page })
          return
        }
      })
    },
    // 授权操作
    handleShopAuthorize(info){
      if(!info.id){
        this.$Notice.warning({
          title: '数据有误！'
        })
        return
      }
      const href = "./api/StoreMeituan/auth?id="+ info.id;
      window.open(href, '_blank')
    },
    // 初始化
    init(data){
      let obj = Object.assign(data,this.sreach)
      getStoreMeituanList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.shopList = dbody.data.list
        this.page = dbody.data.page
      })
    }
  },
  mounted () {
    this.init({});
  },
  computed: {

  }
}
</script>

<style>
  
</style>
