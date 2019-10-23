<template>
  <div>
    <Card style="padding-top: 2em;">
      <a href="#" slot="extra" @click.prevent="showAddModalFn">
          新建档口
      </a>
      <tables
        ref="tables"
        v-model="kitchenStoreList"
        :columns="storeColumns" 
        @data-edit="handleEdit"
        @data-dele="handleDele"
      />
      <Page
        style="margin-top:10px;" 
        :total="store_page.total"
        :page-size="store_page.list_rows"
        @on-change="getNewKitchenStorePage"/>
      <Modal v-model="showAddModal" title="添加档口" @on-ok="saveAddModalInfo">
        <Form :model="addStore" :label-width="80">
          <FormItem label="档口名称">
            <Input v-model="addStore.store_no" placeholder="输入档口名称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="店铺面积">
            <Input v-model="addStore.area" placeholder="输入店铺面积" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="原价入场费">
            <Input v-model="addStore.entrance_fee" placeholder="输入原价入场费" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="实际入场费">
            <Input v-model="addStore.entrance_sell" placeholder="输入实际入场费" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="原价租金">
            <Input v-model="addStore.rent_fee" placeholder="输入原价租金" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="实际租金">
            <Input v-model="addStore.rent_sell" placeholder="输入实际租金" style="width: 200px"></Input>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="showEditModal" title="修改店铺数据" @on-ok="saveEditModalInfo">
        <Form :model="editStore" :label-width="80">
          <FormItem label="档口名称">
            <Input v-model="editStore.store_no" placeholder="输入档口名称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="店铺面积">
            <Input v-model="editStore.area" placeholder="输入店铺面积" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="原价入场费">
            <Input v-model="editStore.entrance_fee" placeholder="输入原价入场费" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="实际入场费">
            <Input v-model="editStore.entrance_sell" placeholder="输入实际入场费" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="原价租金">
            <Input v-model="editStore.rent_fee" placeholder="输入原价租金" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="实际租金">
            <Input v-model="editStore.rent_sell" placeholder="输入实际租金" style="width: 200px"></Input>
          </FormItem>
        </Form>
      </Modal>
      <Modal
          title="删除操作"
          v-model="showDeleModal"
          @on-ok="saveDeleModalInfo"
          :style="{top: '20px'}">
          <p>确认删除档口吗？</p>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getKitchenStoreList , addKitchenStore , editKitchenStore , deleKitchenStore  } from '@/api/setting'
export default {
  name: 'KDSLKitchenStoreList',
  components: {
    Tables,
  },
  props: {
    kitchen_id:{
      default () {
        return ''
      }
    },
  },
  data () {
    return {
      kitchenStoreList:[],
      // 添加弹窗
      addStore:{},
      showAddModal:false,
      // 表格属性
      storeColumns:[
        {title: '档口号', key: 'store_no'},
        {title: '档口面积', key: 'area'},
        {title: '原价入场费', key: 'entrance_fee'},
        { title: '入场费折扣',
          render: (h, params) => {
            let t = params.row.entrance_fee*1;
            let b = params.row.entrance_sell*1;
            if(t > 0 && b > 0){
              let r = (1-((t-b)/t)).toFixed(2);
              return h('span', r );
            }else{
              return h('span', 0 );
            }
          }
        },
        {title: '实际入场费', key: 'entrance_sell'},
        {title: '原价租金', key: 'rent_fee'},
        { title: '租金折扣',
          render: (h, params) => {
            let t = params.row.rent_fee*1;
            let b = params.row.rent_sell*1;
            if(t > 0 && b > 0){
              let r = (1-((t-b)/t)).toFixed(2);
              return h('span', r );
            }else{
              return h('span', 0 );
            }
          }
        },
        {title: '实际租金', key: 'rent_sell'},
        {
          title: '操作',
          key: 'handle',
          width : 160,
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
              '修改')
            },
            (h, params, vm) => {
              return h('Button', {
                style: {margin: '0 0 0 0.5em'},
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-dele', params)
                  }
                }},
              '删除')
            }
          ]
        }
      ],
      store_page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 修改弹窗
      editStore:{},
      showEditModal:false,
      // 删除弹窗
      store_id:'',
      showDeleModal:false,
      
    }
  },
  methods: {
    // 获取档口
    getKitchenStoreList( obj ){
      getKitchenStoreList( obj ).then(res => {
        const dbody = res.data;
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        if( !dbody.data.list || dbody.data.list.length <= 0){
          this.kitchenStoreList = [];
          return;
        }
        this.kitchenStoreList = dbody.data.list
        this.store_page = dbody.data.page
      })
    },
    // 添加档口弹窗
    showAddModalFn(){
      this.addStore = {};
      this.showAddModal = true;
    },
    // 修改操作
    handleEdit (params) {
      this.editStore = {};
      this.store_id = '';
      this.store_id  =  params.row.id ;
      this.editStore.store_no = params.row.store_no;
      this.editStore.area = params.row.area;
      this.editStore.entrance_fee = params.row.entrance_fee;
      this.editStore.entrance_sell = params.row.entrance_sell;
      this.editStore.rent_fee = params.row.rent_fee;
      this.editStore.rent_sell = params.row.rent_sell;
      this.showEditModal = true;
    },
    // 删除弹窗
    handleDele (params) {
      this.store_id = '';
      this.store_id = params.row.id;
      this.showDeleModal = true
    },
    //验证发送对象
    verifyObj( obj ){
      if( !obj.store_no ){
        this.$Notice.warning({
          title: '请输入档口名！'
        })
        return false
      }
      if(isNaN(obj.area*1) || obj.area*1 <= 0){
        this.$Notice.warning({
          title: '请输入正确面积！'
        })
        return false
      }
      if(isNaN(obj.entrance_fee*1)){
        this.$Notice.warning({
          title: '请输入原价入场费！'
        })
        return false
      }
      if(isNaN(obj.entrance_sell*1)){
        this.$Notice.warning({
          title: '请输入实际入场费！'
        })
        return false
      }
      if(isNaN(obj.rent_fee*1)){
        this.$Notice.warning({
          title: '请输入原价入场费！'
        })
        return false
      }
      if(isNaN(obj.rent_sell*1)){
        this.$Notice.warning({
          title: '请输入实际入场费！'
        })
        return false
      }
      return true;
    },
    // 点击分页
    getNewKitchenStorePage( page ){
      let data = { 
        kitchen_id : this.kitchen_id ,
        page : page ,
      }
      this.getKitchenStoreList( data );
    },
    // 保存添加档口 - 弹窗
    saveAddModalInfo () {
      if( this.verifyObj( this.addStore ) ){
        let obj = this.addStore;
        obj.kitchen_id = this.kitchen_id;
        addKitchenStore( obj ).then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.$Notice.warning({
            title: "添加成功！"
          })
          this.getKitchenStoreList({ kitchen_id : this.kitchen_id});
        })
      }
    },
    // 编辑修改
    saveEditModalInfo () {
      if( this.verifyObj( this.editStore ) ){
        let obj = this.editStore;
        obj.kitchen_id = this.kitchen_id;
        obj.id = this.store_id;
        editKitchenStore( obj ).then(res => {
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
          this.getKitchenStoreList({ kitchen_id : this.kitchen_id});
        })
      }
    },
    // 删除操作
    saveDeleModalInfo () {
      deleKitchenStore({ id: this.store_id }).then(res => {
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
        this.getKitchenStoreList({ kitchen_id : this.kitchen_id});
      })
    },
    // init
    initData(){
      if(!this.kitchen_id){
        return
      }
      this.getKitchenStoreList( { kitchen_id : this.kitchen_id })
    },
  },
  created(){
    
  },
  mounted () {
    this.initData();
  },
  beforeDestroy () {
    
  },
  watch: {
    kitchen_id (newV, oldV) {
      this.initData();
    },
  }
}
</script>
