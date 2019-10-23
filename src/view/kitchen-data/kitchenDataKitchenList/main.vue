<template>
  <div>
    <!-- 厨房表格数据 -->
    <Card>
      <p slot="title">
          厨房列表
      </p>
      <a href="#" slot="extra" @click.prevent="showAddModal=true">
          添加厨房
      </a>
      <tables ref="tables" v-model="kitchenList" :columns="columns" 
          @data-view-store="handleViewStore" 
          @data-view-detail="handleViewDetail" 
          @data-edit-base="handleEditBase"
          @data-dele="handleDele"
      />
    </Card>
    <!-- 添加厨房 -->
    <Modal v-model="showAddModal" title="添加厨房" @on-ok="saveAddModalInfo" @on-cancel="cancelAddModalInfo">
        <Form :model="addItem" :label-width="80" inline>
          <FormItem label="厨房名称">
            <Input v-model="addItem.kitchen_name" placeholder="输入厨房名称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="店长">
            <Input v-model="addItem.manage_name" placeholder="输入店长名称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="店长电话">
            <Input v-model="addItem.manage_phone" placeholder="输入店长电话" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="厨房位置">
            <Input v-model="addItem.position" placeholder="输入厨房位置坐标" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="应支出房租(每月)">
            <Input v-model="editItem.kitchen_rent" placeholder="输入应支出房租(每月)" style="width: 200px"></Input>
          </FormItem>

          <FormItem label="垃圾及隔油池(固定费用)">
            <Input v-model="editItem.garbage_fee" placeholder="输入垃圾及隔油池(固定费用)" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="烟道清洗(固定费用)">
            <Input v-model="editItem.flue_fee" placeholder="输入烟道清洗(固定费用)" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="消杀(固定费用)">
            <Input v-model="editItem.kill_fee" placeholder="输入消杀(固定费用)" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="网络使用费(固定费用)">
            <Input v-model="editItem.network_fee" placeholder="输入网络使用费(固定费用)" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="卫生费(固定费用)">
            <Input v-model="editItem.health_fee" placeholder="输入卫生数(固定费用)" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="水费基数(固定费用)">
            <Input v-model="editItem.water_fee" placeholder="输入水费基数(固定费用)" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="电费基数(固定费用)">
            <Input v-model="editItem.energy_fee" placeholder="输入电费基数(固定费用)" style="width: 200px"></Input>
          </FormItem>
          
        </Form>
    </Modal>
    <!-- 删除弹框 -->
    <Modal
        title="删除操作"
        v-model="showDeleModal"
        @on-ok="saveDeleModalInfo"
        @on-cancel="cancelDeleModalInfo"
        :style="{top: '20px'}">
        <p>确认删除厨房吗？</p>
    </Modal>
  </div>
</template>
<script>
// 权限
// /api/Kitchen/index,/api/Kitchen/add,/api/Kitchen/delete
import Tables from '_c/tables'
import { addKitchen  , deleKitchen  } from '@/api/setting'
import { getKitchenList } from '@/api/data'
export default {
  name: 'kitchenDataKitchenList',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {title: '厨房ID', key: 'id'},
        {title: '厨房名称', key: 'kitchen_name'},
        { title: '档口数量', key: 'store_total'},
        { title: '租赁数量', key: 'use_total'},
        { title: '转租数量', key: 'wait_total'},
        { title: '起租数量', key: 'start_total'},
        { title: '空闲数量', key: 'free_total'},
        {title: '店长', key: 'manage_name'},
        {
          title: '查看',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                style:{
                  margin:"0"
                },
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-view-store', params)
                  }
                }},
              '商户列表')
            }, 
          ]
        },
        {
          title: '编辑',
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
                    vm.$emit('data-view-detail', params)
                  }
                }},
              '编辑')
            },
          ]
        },
        {
          title: '操作',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'error',
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
        },
      ],
      kitchenList: [],
      showAddModal: false,
      showEditModal: false,
      showDeleModal: false,
      addItem: {},
      editItem: {},
      deleItemId: ''
    }
  },
  methods: {
    // 查看厨房详情
    handleViewDetail(params){
      let kitchen_id = params.row.id
      const route = {
        name: 'kitchenDataKitchenDetail',
        query: {
          kitchen_id
        }
      }
      this.$router.push(route)
    },
    // 查看商户列表
    handleViewStore(params){
      let kitchen_id = params.row.id
      const route = {
        name: 'kitchenDataShopList',
        query: {
          kitchen_id
        }
      }
      this.$router.push(route)
    },
    // 显示编辑基础数据
    handleEditBase (params) {
      this.editItem.id = params.row.id
      this.editItem.kitchen_name = params.row.kitchen_name
      this.editItem.manage_name = params.row.manage_name
      this.editItem.manage_phone = params.row.manage_phone
      this.editItem.position = params.row.position
      this.editItem.kitchen_rent = params.row.kitchen_rent
      this.editItem.garbage_fee = params.row.garbage_fee
      this.editItem.flue_fee = params.row.flue_fee
      this.editItem.kill_fee = params.row.kill_fee
      this.editItem.network_fee = params.row.network_fee
      this.editItem.water_fee = params.row.water_fee
      this.editItem.energy_fee = params.row.energy_fee
      this.editItem.storage_fee = params.row.storage_fee
      this.editItem.health_fee = params.row.health_fee
      this.showEditModal = true
    },
    // 显示删除
    handleDele (params) {
      this.deleItemId = params.row.id
      this.showDeleModal = true
    },
    // 新增
    saveAddModalInfo () {
      addKitchen(this.addItem).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 处理成功逻辑
        getKitchenList().then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.kitchenList = dbody.data || []
        })
      })
    },
    // 删除
    saveDeleModalInfo () {
      deleKitchen({ id: this.deleItemId }).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 处理成功逻辑
        getKitchenList().then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.kitchenList = dbody.data || []
        })
      })
    },
    // 取消
    cancelAddModalInfo () {
      this.addItem = {}
    },
    cancelDeleModalInfo () {
      this.deleItemId = ''
    }
  },
  mounted () {
    getKitchenList().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      this.kitchenList = dbody.data || [];
    })
  },
  computed: {

  }
}
</script>

<style>

</style>
