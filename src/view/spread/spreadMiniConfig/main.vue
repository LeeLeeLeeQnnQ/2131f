<template>
  <div>
    <!-- 厨房表格数据 -->
    <Card>
      <p slot="title">
          头部banner配置
      </p>
      <a href="#" slot="extra" @click.prevent="addNewBannerModal">
          添加banner
      </a>
      <tables ref="tables" v-model="bannerList" :columns="columns" 
          @data-view-banner="handleViewBanner" 
          @data-edit-alive="handleEditAlive" 
          @data-edit-ban="handleEditBan" 
          @data-edit-info="handleEditInfo"
      />
      <Page :total="page.total" :page-size="page.list_rows" @on-change="getNewBannerPage" style="margin-top:10px;"/>
    </Card>
    <!-- 查看图片 -->
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
    <!-- 添加 -->
    <Modal 
      v-model="showAddNewBannerModal"
      title="增加新banner"
      @on-ok="saveAddNewBannerInfo" >
        <Form :model="newBannerItem" :label-width="120" inline>
          <FormItem label="名称">
            <Input v-model="newBannerItem.title" placeholder="banner名称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="newBannerItem.sort" placeholder="越大越靠前" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="newBannerItem.content" type="textarea" :rows="4" placeholder="描述"  style="width: 200px"/>
          </FormItem>
          <FormItem label="链接">
            <Input v-model="newBannerItem.url" placeholder="请输入url" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="banner图片" style="width: 200px" >
            <div v-if="!!newBannerItem.image" class="img-upload-list">
              <img :src="newBannerItem.image">
              <div class="img-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(newBannerItem.image)"></Icon>
              </div>
            </div>
            <Upload
              ref="uploadLetter"
              :show-upload-list="false"
              :on-success="uploadNewBanner"
              :format="['jpg','jpeg','png']"
              :max-size="4200"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              action="/api/Index/upload"
              style="display: inline-block;width:60px;">
              <div style="width: 60px;height:60px;line-height: 60px;">
                  <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </FormItem>
        </Form>
    </Modal>
    <!-- 修改 -->
    <Modal 
      v-model="showEditBannerModal"
      title="修改banner"
      @on-ok="saveEditBannerInfo" >
        <Form :model="editBannerItem" :label-width="120" inline>
          <FormItem label="名称">
            <Input v-model="editBannerItem.title" placeholder="banner名称" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="editBannerItem.sort" placeholder="越大越靠前" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="editBannerItem.content" type="textarea" :rows="4" placeholder="描述"  style="width: 200px"/>
          </FormItem>
          <FormItem label="链接">
            <Input v-model="editBannerItem.url" placeholder="请输入url" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="banner图片" style="width: 200px" >
            <div v-if="!!editBannerItem.image" class="img-upload-list">
              <img :src="editBannerItem.image">
              <div class="img-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(editBannerItem.image)"></Icon>
              </div>
            </div>
            <Upload
              ref="uploadLetter"
              :show-upload-list="false"
              :on-success="updateBanner"
              :format="['jpg','jpeg','png']"
              :max-size="4200"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              action="/api/Index/upload"
              style="display: inline-block;width:60px;">
              <div style="width: 60px;height:60px;line-height: 60px;">
                  <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
// 权限
// Banner/index,Banner/add,Banner/edit,Banner/status
import Tables from '_c/tables'
import { getBannerList , addNewBanner , editBanner , changeBannerStatus } from '@/api/spread'
export default {
  name: 'spreadMiniConfig',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '查看图片',
          key: 'handle',
          button: [
            (h, params, vm) => {
              let title = params.row.title;
              return h('a', {
                style:{
                  margin:"0"
                },
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-view-banner', params)
                  }
                }},
              title)
            }, 
          ]
        },
        {title: '位置（大的靠前）', key: 'sort'},
        { title: '状态',
          render: (h, params) => {
            let status = params.row.status*1
            if(status == 1){
              return h('span', { style: {color: '#19be6b'}}, '正常')
            }else if (status == 2) {
              return h('span', { style: {color: '#2d8cf0'}}, '禁用' )
            }
          }
        },
        {title: '链接', key: 'url'},
        {title: '描述', key: 'content'},
        {
          title: '编辑',
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
                    vm.$emit('data-edit-info', params)
                  }
                }},
              '编辑')
            }, 
          ]
        },
        {
          title: '操作',
          key: 'handle',
          width : 160 ,
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                style: {
                  margin:'5px 0 ',
                },
                props: {
                  confirm: true,
                  title: '启用banner！'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-edit-alive', params)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {marginLeft: '0px'}
                }, '启用')
              ])
            },
            (h, params, vm) => {
              return h('Poptip', {
                style: {
                  margin:'5px 0 ',
                },
                props: {
                  confirm: true,
                  title: '禁用banner！'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-edit-ban', params)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {marginLeft: '5px'}
                }, '禁用')
              ])
            },
          ]
        },
      ],
      bannerList: [],
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 图片
      imgUrl: '',
      visible: false,
      // 增加新banner
      showAddNewBannerModal:false,
      newBannerItem:{},
      // 修改showEditBannerModal
      showEditBannerModal:false,
      editBannerItem:{},

    }
  },
  methods: {
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
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
        desc: '文件  ' + file.name + ' 过大, 不能超过 2M.'
      })
    },
    // 发送触发
    handleBeforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
      }
    },
    //NewBanner
    uploadNewBanner (res, file) {
      if (res.code == 0) {
        this.newBannerItem.image = res.data;
        this.showAddNewBannerModal = false;
        this.showAddNewBannerModal = true;
      }else{
        this.$Notice.warning({
          title: res.msg
        })
      }
    },
    //oldBanner
    updateBanner (res, file) {
      if (res.code == 0) {
        this.editBannerItem.image = res.data;
        this.showEditBannerModal = false;
        this.showEditBannerModal = true;
      }else{
        this.$Notice.warning({
          title: res.msg
        })
      }
    },
    // 图片预览
    handleViewBanner (params) {
      this.imgUrl = params.row.image;
      this.visible = true
    },
    // 启用
    handleEditAlive(params){
      let data = {
        id:params.row.id,
        status:1,
      }
      changeBannerStatus( data ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: '变更成功！'
        })
        this.initBanner({ page:this.current_page });
      })
    },
    // 禁用
    handleEditBan(params){
      let data = {
        id:params.row.id,
        status:2,
      }
      changeBannerStatus( data ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: '变更成功！'
        })
        this.initBanner({ page:this.current_page });
      })
    },
    // 验证数据完整
    testObj( data ){
      if(!data.image){
        this.$Notice.warning({
          title: 'banner图片错误！'
        })
        return false
      }
      if(!data.title){
        this.$Notice.warning({
          title: 'banner名称错误！'
        })
        return false
      }
      if(isNaN(data.sort)){
        this.$Notice.warning({
          title: 'banner排序错误！'
        })
        return false
      }
      return true
    },
    // 增加新
    addNewBannerModal(){
      this.newBannerItem = {};
      this.showAddNewBannerModal = true;
    },
    // 保存新
    saveAddNewBannerInfo(){
      if(this.testObj(this.newBannerItem)){
        this.newBannerItem.banner_type = 2;
        addNewBanner( this.newBannerItem ).then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.$Notice.warning({
            title: '新增成功！'
          })
          this.initBanner({ page:this.current_page });
        })
      }
    },
    // 修改
    handleEditInfo(params){
      this.editBannerItem = {};
      this.editBannerItem = params.row;
      this.showEditBannerModal = true;
    },
    // saveEditBannerInfo
    saveEditBannerInfo(){
      if(this.testObj(this.editBannerItem)){
        let data = Object.assign({},this.editBannerItem);
        delete data.create_time
        delete data.update_time
        editBanner( data ).then(res => {
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
          this.initBanner({ page:this.current_page });
        })
      }
    },

    // 选择新页面
    getNewBannerPage(page){
      this.initBanner({ page : page });
    },
    // initBanner
    initBanner(data){
      getBannerList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.bannerList = dbody.data.list || [];
        this.page = dbody.data.page;
      })
    }

  },
  mounted () {
    this.initBanner();
  },
  computed: {

  }
}
</script>

<style scoped>
  .store_logo{
    width: 100px;
    height: 100px;
    border-radius: 5px;
    border:1px solid #ddd;
  }
  .store_erweima{
    width: 200px;
    height: 200px;
    border-radius: 5px;
    border:1px solid #ddd;
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
