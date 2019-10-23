<template>
  <div>
    <Card>
      <p slot="title">
          下拉配置列表
      </p>
      <a href="#" slot="extra" @click.prevent="showAddModalfn">
          新建配置
      </a>
      <tables ref="tables"  v-model="orderConfigList" :columns="columns" @data-edit="handleEdit" @data-dele="handleDele"/>
      <Page :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
    </Card>
    <Modal v-model="showAddModal" title="添加下拉项目" @on-ok="saveAddModalInfo">
        <Form :label-width="80" inline>
          <FormItem label="工单种类">
            <Select v-model="selectOrderId" style="width:200px;">
              <Option v-for="item in orderlist" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          <FormItem label="可选项目">
            <Input v-model="eventTitle" placeholder="输入项目名称" style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
    <Modal v-model="showEditModal" title="修改工单数据" @on-ok="saveEditModalInfo">
        <Form :label-width="80" inline>
          <FormItem label="工单种类">
            <Select v-model="selectOrderId" style="width:200px;">
              <Option v-for="item in orderlist" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          <FormItem label="可选项目">
            <Input v-model="eventTitle" placeholder="输入项目名称" style="width: 200px"></Input>
          </FormItem>
        </Form>
    </Modal>
    <Modal
        title="删除操作"
        v-model="showDeleModal"
        @on-ok="saveDeleModalInfo"
        :style="{top: '20px'}">
        <p>确认删除吗？</p>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// /api/WorkCategory/index,/api/WorkCategory/add,editWorkCategory,/api/WorkCategory/delete
import { getWorkCategoryList, addWorkCategory, editWorkCategory, deleWorkCategory} from '@/api/setting'
export default {
  name: 'permissionSelectConfig',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {title: 'ID', key: 'id'},
        { title: '工单种类',
          render: (h, params) => {
            let status = params.row.work_type
            switch (status*1) {
              case 1:
                return h('span', '奖惩下拉')
                break
              case 2:
                return h('span', '维修下拉')
                break
              case 3:
                return h('span', '接驳下拉')
                break
              case 4:
                return h('span', '缴费下拉')
                break
              case 5:
                return h('span', '厨房费用下拉')
                break
              case 6:
                return h('span', '租金下拉')
                break
              case 7:
                return h('span', '起租表格')
                break
              case 8:
                return h('span', '退租表格')
                break
              case 9:
                return h('span', '区域下拉')
                break
            }
          }
        },
        {title: '项目名称', key: 'title'},
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
      orderConfigList: [],
      showAddModal: false,
      showEditModal: false,
      showDeleModal: false,
      itemId: '',
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      selectOrderId:'',
      eventTitle:'',
      orderlist:[
        {
          id:1,
          title:'奖罚工单'
        },
        {
          id:2,
          title:'维修工单'
        },
        {
          id:3,
          title:'接驳工单'
        },
        {
          id:4,
          title:'缴费工单'
        },
        {
          id:5,
          title:'厨房费用工单'
        },
        {
          id:6,
          title:'租金工单'
        },
        {
          id:7,
          title:'起租表格'
        },
        {
          id:8,
          title:'退租表格'
        },
        {
          id:9,
          title:'区域下拉'
        },
      ]
    }
  },
  methods: {
    showAddModalfn(){
      this.itemId = '';
      this.selectOrderId = '';
      this.eventTitle = '';
      this.showAddModal = true;
    },
    getNewPage (page) {
      this.setWorkCategoryList( page );
    },
    // 显示编辑
    handleEdit (params) {
      this.itemId = params.row.id;
      this.selectOrderId = params.row.work_type;
      this.eventTitle = params.row.title;
      this.showEditModal = true;
    },
    // 显示删除
    handleDele (params) {
      this.itemId = params.row.id;
      this.selectOrderId = '';
      this.eventTitle = '';
      this.showDeleModal = true;
    },
    // 新增
    saveAddModalInfo () {
      if(!this.selectOrderId){
        this.$Notice.warning({
          title: '请选择工单类型！'
        })
        return
      }
      if(!this.eventTitle){
        this.$Notice.warning({
          title: '请填写项目！'
        })
        return
      }
      let obj = {
        work_type : this.selectOrderId,
        title : this.eventTitle,
      }
      addWorkCategory( obj ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 处理成功逻辑
        this.setWorkCategoryList();
      })
    },
    // 修改
    saveEditModalInfo () {
      if(!this.selectOrderId){
        this.$Notice.warning({
          title: '请选择工单类型！'
        })
        return
      }
      if(!this.eventTitle){
        this.$Notice.warning({
          title: '请填写项目！'
        })
        return
      }
      let obj = {
        id : this.itemId,
        work_type : this.selectOrderId,
        title : this.eventTitle,
      }
      editWorkCategory(obj).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 处理成功逻辑
        this.setWorkCategoryList();
      })
    },
    // 删除
    saveDeleModalInfo () {
      deleWorkCategory({ id: this.itemId }).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 处理成功逻辑
        this.setWorkCategoryList();
      })
    },
    setWorkCategoryList( page ){
      let obj = {};
      obj.page = page || 1;
      getWorkCategoryList( obj ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        if(!dbody.data.list){
          return
        }
        this.orderConfigList = dbody.data.list
        this.page = dbody.data.page
      })
    }
  },
  mounted () {
    this.setWorkCategoryList();
  }
}
</script>

