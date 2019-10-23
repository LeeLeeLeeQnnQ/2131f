<template>
  <div>
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
    <!-- 头部搜索 按钮 -->
    <Card shadow style="margin-bottom: 5px">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col span="10">
          <Select v-model="select_kitchen_id" style="width: 200px;margin-right:10px;" @on-change="selectKitchen">
            <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
          </Select>
        </i-col>
      </Row>
    </Card>
    <Card style="margin-top: 5px;padding-top: 2em;">
      <a href="#" slot="extra" @click.prevent="showAddModalFn">
          添加支出
      </a>
      <tables ref="tables" v-model="kitchen_expend_list" :columns="columns" @data-edit="handleEdit"  @data-dele="handleDele"/>
      <Page :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
//权限
// /api/Kitchen/index,/api/KitchenExpend/index,/api/KitchenExpend/delete
import { getKitchenList } from '@/api/data'
import { getKitchenExpendList , deleteKitchenExpend } from '@/api/finance'
export default {
  name: 'financeKitchenExpend',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索
      select_kitchen_id:'',
      kitchenList: [],
      // 数据
      kitchen_expend_list:[],
      columns: [
        {title: '支出类型', key: 'expend_type_name'},
        {title: '所属厨房', key: 'kitchen_name'},
        {title: '标题', key: 'title'},
        {title: '报账日期', key: 'expend_date'},
        {title: '登记时间', key: 'create_time'},
        {title: '金额总计', key: 'money'},
        {title: '备注', key: 'money'},
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
                style: {margin: '0'},
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
                  title: '你确定要删除吗?'
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
                  style:{margin: '0 0 0 1em'}
                 }, '删除')
              ])
            },
          ]
        }
      ],
      page: {
        curmoney_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 图片
      imgUrl: '',
      visible: false,
    }
  },
  methods: {
    // ...mapMutations([
    //   'setExpendParams',
    // ]),
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    // 删除图片
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.uploadList.splice(fileList.indexOf(file), 1)
    },
    // 获取图片
    handleSuccess (res, file) {
      if (res.code == 0) {
        let obj = {}
        obj.url = res.data
        obj.status = 'finished'
        obj.showProgress = false
        this.uploadList.push(obj)
      }
    },
    // 错误提示
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件 ' + file.name + ' 格式错误, 请上传jpg／jpeg／png格式.'
      })
    },
    // 超大提示
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超过最大限制',
        desc: '文件  ' + file.name + ' 过大, 不能超过 4M.'
      })
    },
    // 发送触发
    handleBeforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
      }
    },
    // 查看
    handleEdit(params){
      let id = params.row.id
      const route = {
        name: 'financeKitchenExpendItemEdit',
        query: {
          id
        }
      }
      this.$router.push(route)
    },
    // handleDele 删除
    handleDele(params){
      let id = params.row.id
      deleteKitchenExpend( id ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "删除成功！"
        })
        let obj = {
          kitchen_id: this.select_kitchen_id,
          page:this.page.curmoney_page
        }
        // 获取默认支出列表
        this.getKitchenExpendList( obj );
      })
    },
    // 选择厨房
    selectKitchen(){
      let obj = {
        kitchen_id: this.select_kitchen_id,
      }
      this.getKitchenExpendList( obj );
    },
    // 获取新页面
    getNewPage (page) {
      let obj = {
        kitchen_id: this.select_kitchen_id,
        page:page
      }
      this.getKitchenExpendList( obj );
    },
    // 获取支出列表
    getKitchenExpendList( obj ){
      getKitchenExpendList( obj ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.kitchen_expend_list = dbody.data.list || [];
        this.page = dbody.data.page;
      })
    },
    // 增加一条
    showAddModalFn(){
      const route = {
        name: 'financeKitchenExpendItem',
      }
      this.$router.push(route)
    },
  },
  computed: {
  },
  mounted () {
    // 获取厨房列表
    getKitchenList().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      this.kitchenList = dbody.data || [];
      // 选择默认厨房
      this.select_kitchen_id = this.kitchenList[this.kitchenList.length - 1].id;
      let obj = {
        kitchen_id: this.select_kitchen_id,
      }
      // 获取默认支出列表
      this.getKitchenExpendList( obj );
    })
  },
}
</script>

<style lang="less">
  .tableFooter{
    margin-left: 20px;
  }
  .img-upload-list{
      display: inline-block;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transpamoney;
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
