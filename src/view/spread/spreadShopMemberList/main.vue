<template>
  <div>
    <Card style="padding-top: 2.5em;">
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
          <FormItem label="所属商铺">
            <Select v-model="newShopItem.shop_id" style="width: 200px">
              <Option v-for="item in shop_list" :value="item.id" :key="item.id">{{ item.shop_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="用户账号">
            <Input v-model="newShopItem.username" placeholder="用户账号" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="用户昵称">
            <Input v-model="newShopItem.fullname" placeholder="用户昵称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="用户密码">
            <Input v-model="newShopItem.password" placeholder="用户密码大于6位" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="电话">
            <Input v-model="newShopItem.contact" placeholder="电话" style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
    <!-- 修改 -->
    <Modal 
      v-model="showEditShopModal"
      title="编辑商户账号"
      @on-ok="saveEditShopInfo" >
        <Form :model="editShopItem" :label-width="120" inline>
          <FormItem label="所属商铺">
            <Select v-model="editShopItem.shop_id" style="width: 200px">
              <Option v-for="item in shop_list" :value="item.id" :key="item.id">{{ item.shop_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="用户账号">
            <Input v-model="editShopItem.username" placeholder="用户账号" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="用户昵称">
            <Input v-model="editShopItem.fullname" placeholder="用户昵称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="用户密码">
            <Input v-model="editShopItem.password" placeholder="用户密码大于6位" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="确认密码">
            <Input v-model="editShopItem.confirm_password" placeholder="用户密码大于6位" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="联系方式">
            <Input v-model="editShopItem.contact" placeholder="联系方式" style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// ShopUser/index,Shop/getShops,ShopUser/add,ShopUser/edit,ShopUser/delete
import { getShopUserList , getShopsList , addNewShopUser , editShopUser , deleteShopUser } from '@/api/spread'
export default {
  name: 'spreadShopMemberList',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索
      sreach:{},
      // 
      columns: [
        {title: 'ID', key: 'id', width: 80 },
        {title: '用户登陆名', key: 'username'},
        {title: '用户昵称', key: 'fullname'},
        {title: '所属商铺', key: 'shop_name'},
        {title: '联系方式', key: 'contact'},
        {title: '上次登录 ',
          render: (h, params) => {
            let time = params.row.login_time
            let now = new Date(time * 1000),
              y = now.getFullYear(),
              m = now.getMonth() + 1,
              d = now.getDate()
            let date = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.toTimeString().substr(0, 8)
            return h('span', date)
          },
          width: 150
        },
        {title: '登录次数', key: 'logins',width : 150},
        {title: '备注', key: 'remark'},
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
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-dele', params)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {marginLeft: '8px'}
                }, '删除')
              ])
            }
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
      let shop_id = data.shop_id || '';
      if(!shop_id){
        this.$Notice.warning({
          title: '请选择商铺！'
        })
        return false
      }
      let password = data.password.trim() || '';
      if(!password || password.length < 6 ){
        this.$Notice.warning({
          title: '密码错误！'
        })
        return false
      }
      let username = data.username.trim() || '';
      if(!username){
        this.$Notice.warning({
          title: '账号错误！'
        })
        return false
      }
      let fullname = data.fullname.trim() || '';
      if(!fullname){
        this.$Notice.warning({
          title: '昵称错误！'
        })
        return false
      }
      return true;
    },
    // 测试数据
    testEditValue(data){
      let shop_id = data.shop_id || '';
      if(!shop_id){
        this.$Notice.warning({
          title: '请选择商铺！'
        })
        return false
      }
      let password = data.password.trim() || '';
      if(!!password){
        if(!password || password.length < 6 ){
          this.$Notice.warning({
            title: '密码错误！'
          })
          return false
        }
      }
      let username = data.username.trim() || '';
      if(!username){
        this.$Notice.warning({
          title: '账号错误！'
        })
        return false
      }
      let fullname = data.fullname.trim() || '';
      if(!fullname){
        this.$Notice.warning({
          title: '昵称错误！'
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
        addNewShopUser(this.trimData(this.newShopItem)).then(res => {
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
    // 编辑
    handleDataEdit (params) {
      this.editShopItem = Object.assign({},params.row);
      this.editShopItem.password = '';
      this.showEditShopModal = true;
    },
    saveEditShopInfo(){
      if(this.testEditValue(this.editShopItem)){
        delete this.editShopItem.create_time
        delete this.editShopItem.update_time
        delete this.editShopItem.status
        if(!!this.editShopItem.password){
          if(this.editShopItem.password != this.editShopItem.confirm_password){
            this.$Notice.warning({
              title: '两次密码不一致！'
            })
            return
          }
        }else{
          delete this.editShopItem.password
          delete this.editShopItem.confirm_password
        }
        editShopUser(this.trimData(this.editShopItem)).then(res => {
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
      getShopUserList(data).then(res => {
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
    getShopsList().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      this.shop_list = dbody.data;
      this.init({});
    })
  },
  computed: {

  }
}
</script>

<style>

</style>
