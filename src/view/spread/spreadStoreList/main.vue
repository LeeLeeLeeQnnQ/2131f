<template>
  <div>
    <Card shadow>
      <Row :gutter="20">
        <i-col :xs="4" :md="4" :lg="4">
          <Input v-model="sreach.keyword" placeholder="请输入关键字"/>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4">
          <Button type="primary" @click="sreachKeyword">搜索</Button>
        </i-col>
      </Row>
    </Card>
    <Card style="padding-top: 2.5em;margin-top:10px;">
      <a href="#" slot="extra" @click.prevent="addNewShopModal">
          添加商户账号
      </a>
      <tables ref="tables"
              v-model="memberList"
              :columns="columns"
              @data-dele="handleDataDele"
              @data-edit="handleDataEdit"/>
      <Page :total="page.total"
            :page-size="page.list_rows"
            style="margin-top:10px;"
            @on-change="getNewPage"/>
    </Card>
    <!-- 添加 -->
    <Modal 
      v-model="showAddNewShopModal"
      title="添加商户账号"
      @on-ok="saveAddNewShopInfo" >
        <Form :model="newShopItem" :label-width="120" inline>
          <FormItem label="店铺名称">
            <Input v-model="newShopItem.store_name" placeholder="用户账号" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="店铺电话">
            <Input v-model="newShopItem.store_phone" placeholder="电话" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="经营者">
            <Input v-model="newShopItem.manage_name" placeholder="用户账号" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="经营者电话">
            <Input v-model="newShopItem.manage_phone" placeholder="电话" style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
    <!-- 修改 -->
    <Modal 
      v-model="showEditShopModal"
      title="编辑商户账号"
      @on-ok="saveEditShopInfo" >
        <Form :model="editShopItem" :label-width="120" inline>
          <FormItem label="店铺名称">
            <Input v-model="editShopItem.store_name" placeholder="用户账号" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="店铺电话">
            <Input v-model="editShopItem.store_phone" placeholder="电话" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="经营者">
            <Input v-model="editShopItem.manage_name" placeholder="用户账号" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="经营者电话">
            <Input v-model="editShopItem.manage_phone" placeholder="电话" style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// Store/add,Store/index,Store/edit
import { getStoreList , addStoreItem , editStoreItem } from '@/api/spread'
export default {
  name: 'spreadStoreList',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索
      sreach:{
        keyword:'',
      },
      // 
      columns: [
        {title: '商铺ID', key: 'id', width: 80 },
        {title: '店铺名称', key: 'store_name'},
        {title: '店铺电话', key: 'store_phone'},
        {title: '经营者', key: 'manage_name'},
        {title: '经营者电话', key: 'manage_phone'},
        {
          title: '操作',
          key: 'handle',
          width :160,
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-edit', params)
                  }
                }},
              '编辑')
            },
          ]
        }
      ],
      // 下拉
      shop_list:[],
      memberList: [],
      page: {
        current_page: '',
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 添加弹窗
      showAddNewShopModal:false,
      newShopItem:{},
      // 修改弹窗
      showEditShopModal:false,
      editShopItem:{},
    }
  },
  methods: {
    // 测试数据
    testValue(data){
      let store_name = data.store_name.trim() || '';
      if(!store_name){
        this.$Notice.warning({
          title: '店铺名称错误！'
        })
        return false
      }
      let store_phone = data.store_phone.trim() || '';
      if(!store_phone){
        this.$Notice.warning({
          title: '店铺电话错误！'
        })
        return false
      }
      let manage_name = data.manage_name.trim() || '';
      if(!manage_name){
        this.$Notice.warning({
          title: '经营者电话错误！'
        })
        return false
      }
      let manage_phone = data.manage_phone.trim() || '';
      if(!manage_phone){
        this.$Notice.warning({
          title: '经营者错误！'
        })
        return false
      }
      return true;
    },
    // 增加弹窗
    addNewShopModal(){
      this.newShopItem = {};
      this.showAddNewShopModal = true;
    },
    // 保存增加
    saveAddNewShopInfo(){
      if(this.testValue(this.newShopItem)){
        addStoreItem(this.trimData(this.newShopItem)).then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.init({})
        })
      }
    },
    // getNewPage
    getNewPage (page) {
      this.init({ page : page });
    },
    // 搜索
    sreachKeyword(){
      this.init({});
    },
    // 编辑
    handleDataEdit (params) {
      this.editShopItem = Object.assign({},params.row);
      this.editShopItem.password = '';
      this.showEditShopModal = true;
    },
    saveEditShopInfo(){
      if(this.testValue(this.editShopItem)){
        delete this.editShopItem.create_time
        delete this.editShopItem.update_time
        delete this.editShopItem.status
        editStoreItem(this.trimData(this.editShopItem)).then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.$Notice.warning({
            title: '修改成功！'
          })
          this.init({page : this.page.current_page})
        })
      }
    },
    // 删除
    handleDataDele (params) {
      let id = params.row.id
      deleteShopUser({id:id}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
        } else {
          this.$Notice.warning({
            title: '删除成功！'
          })
          this.init({page : this.page.current_page})
        }
      })
    },
    // 去空格
    trimData(obj){
      let td = obj || {};
      for(let k  in  obj) {
        obj[k] = (obj[k]+'').trim();
      }
      return td
    },

    // 初始化
    init(data){
      let obj = Object.assign(data,this.sreach)
      getStoreList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.memberList = dbody.data.list
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
