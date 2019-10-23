<template>
  <div>
    <Modal v-model="showAddModal" title="增加城市" @on-ok="saveAddModal">
      <Form :model="addItem" :label-width="80">
        <FormItem label="城市名称">
          <Input v-model="addItem.city_name" placeholder="输入城市名称" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="addItem.remark" placeholder="输入备注" style="width: 200px"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showEditModal" title="修改城市" @on-ok="saveEditModal">
      <Form :model="editItem" :label-width="80">
        <FormItem label="城市名称">
          <Input v-model="editItem.city_name" placeholder="输入城市名称" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="editItem.remark" placeholder="输入备注" style="width: 200px"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Card shadow style="margin-top:8px;padding-top: 2em;">
      <a href="#" slot="extra" @click.prevent="handleShowAddModal">
          增加城市
      </a>
      <Tables ref="tables" v-model="cityList" :columns="columns" @data-edit="handleShowEditModal"/>
    </Card>
    <Page :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// City/index,City/add,City/edit
import { getAllCityList , addNewCity , editCity } from '@/api/permission'
export default {
  name: 'permissionCityList',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {title: '城市ID', key: 'id', width: 80 },
        {title: '城市名称', key: 'city_name'},
        {title: '备注', key: 'remark'},
        {
          title: '操作',
          key: 'handle',
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
      cityList: [],
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      showAddModal:false,
      addItem:{},
      showEditModal:false,
      editItem:{},
    }
  },
  methods: {
    // getNewPage
    getNewPage (page) {
      this.page.current_page = page;
      this.initData();
    },
    //, 
    handleShowAddModal(){
      this.addItem = {};
      this.showAddModal = true;
    },
    saveAddModal(){
      if(!this.addItem.city_name){
        this.$Notice.warning({
          title: '请输入城市名称！'
        })
        return
      }
      addNewCity(this.addItem).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.initData();
      })
    },
    //
    handleShowEditModal(params){
      this.editItem = Object.assign({},params.row);
      this.showEditModal = true;
    },
    saveEditModal(){
      if(!this.editItem.city_name){
        this.$Notice.warning({
          title: '请输入城市名称！'
        })
        return
      }
      delete this.editItem.create_time
      delete this.editItem.update_time
      editCity(this.editItem).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.initData();
      })
    },
    initData(){
      getAllCityList({page:this.page.current_page}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.cityList = dbody.data.list || [];
        this.page = dbody.data.page
      })
    },
  },
  created () {
    this.initData();
  },
  computed: {

  }
}
</script>

<style>

</style>
