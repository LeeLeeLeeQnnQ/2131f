<template>
  <div>
    <Modal v-model="showAddModal" title="增加地区" @on-ok="saveAddModal">
      <Form :model="addItem" :label-width="80">
        <FormItem label="地区名称">
          <Input v-model="addItem.area_name" placeholder="输入地区名称" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="地区名称">
          <Select v-model="addItem.city_id" style="width: 200px">
            <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.city_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="addItem.area_content" placeholder="输入备注" style="width: 200px"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showEditModal" title="修改地区" @on-ok="saveEditModal">
      <Form :model="editItem" :label-width="80">
        <FormItem label="地区名称">
          <Input v-model="editItem.area_name" placeholder="输入地区名称" style="width: 200px"></Input>
        </FormItem>
         <FormItem label="地区名称">
          <Select v-model="editItem.city_id" style="width: 200px">
            <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.city_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="editItem.area_content" placeholder="输入备注" style="width: 200px"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Card shadow style="margin-top:8px;padding-top: 2em;">
      <a href="#" slot="extra" @click.prevent="handleShowAddModal">
          增加地区
      </a>
      <Tables
        ref="tables"
        v-model="zoneList"
        :columns="columns"
        @data-edit="handleShowEditModal"
        @data-dele="handleDelete"
      />
    </Card>
    <Page :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// Area/index
import { getAllAreaList , addNewArea , editArea , getCityList , deleteAreaItem } from '@/api/permission'
export default {
  name: 'permissionAreaList',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {title: '地区ID', key: 'id', width: 80 },
        {title: '地区名称', key: 'area_name'},
        {title: '所属城市', key: 'city_name'},
        {title: '备注', key: 'area_content'},
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
            (h, params, vm) => {
              return h('Poptip', {
                style: {
                  margin:'5px 0',
                },
                props: {
                  confirm: true,
                  title: '删除这个区域！'
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
                  style: {marginLeft: '5px'}
                }, '删除')
              ])
            },
          ]
        }
      ],
      zoneList: [],
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
    handleDelete(params){
      let id = params.row.id;
      deleteAreaItem({id:id}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: '删除成功！'
        })
        this.initData();
      })
    },
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
      if(!this.addItem.area_name){
        this.$Notice.warning({
          title: '请输入区域名称！'
        })
        return
      }
      if(!this.addItem.city_id){
        this.$Notice.warning({
          title: '请选择城市名称！'
        })
        return
      }
      addNewArea(this.addItem).then(res => {
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
      if(!this.addItem.area_name){
        this.$Notice.warning({
          title: '请输入区域名称！'
        })
        return
      }
      if(!this.addItem.city_id){
        this.$Notice.warning({
          title: '请选择城市名称！'
        })
        return
      }
      delete this.editItem.create_time
      delete this.editItem.update_time
      editArea(this.editItem).then(res => {
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
    getCityList(){
      getCityList().then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.cityList = dbody.data || [];
      })
    },
    initData(){
      getAllAreaList({page:this.page.current_page}).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.zoneList = dbody.data.list || [];
        this.page = dbody.data.page
      })
    },
  },
  created () {
    this.getCityList();
    this.initData();
  },
  computed: {

  }
}
</script>

<style>

</style>
