<template>
	<div>
    <Modal title="预览图" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
		<Modal v-model="c_showModal" title="增加设备" @on-ok="savec_ModalInfo">
      <Form :model="c_modalItem" :label-width="80">
        <FormItem label="设备名称">
          <Input v-model="c_modalItem.title" placeholder="输入设备名称" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="设备数量">
          <Input v-model="c_modalItem.quantity" placeholder="输入数量" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="电压V/每个设备">
          <Input v-model="c_modalItem.voltage" placeholder="输入电压V/每个设备" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="功率KW/每个设备">
          <Input v-model="c_modalItem.kw" placeholder="输入功率KW/每个设备" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="燃气量 m³">
          <Input v-model="c_modalItem.gas" placeholder="输入燃气量 m³" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="备注">
            <Input v-model="c_modalItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="edit_showModal" title="修改设备" @on-ok="saveEditModalInfo">
      <Form :model="connectEditItem" :label-width="80">
        <FormItem label="设备名称">
          <Input v-model="connectEditItem.title" placeholder="输入设备名称" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="设备数量">
          <Input v-model="connectEditItem.quantity" placeholder="输入数量" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="电压V/每个设备">
          <Input v-model="connectEditItem.voltage" placeholder="输入电压V/每个设备" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="功率KW/每个设备">
          <Input v-model="connectEditItem.kw" placeholder="输入功率KW/每个设备" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="燃气量 m³">
          <Input v-model="connectEditItem.gas" placeholder="输入燃气量 m³" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="备注">
            <Input v-model="connectEditItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Form :label-width="100">
      <FormItem label="设备清单">
        <div class="img-upload-list" v-for="item in connectImgList">
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemoveConnectImg(item)"></Icon>
          </div>
        </div>
        <Upload
          ref="connectImg"
          :show-upload-list="false"
          :on-success="handleSuccessConnectImg"
          :before-upload="handleBeforeUpload"
          :format="['jpg','jpeg','png']"
          :max-size="2000"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          multiple
          type="drag"
          action="/api/Index/upload"
          style="display: inline-block;width:60px;">
          <div style="width: 60px;height:60px;line-height: 60px;">
              <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </FormItem>
      <FormItem label="设备表格">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="24">
            <FormItem>
              <Button type="primary" @click="addConnectTableDataItem">增加一条</Button>
            </FormItem>
          </i-col>
          <i-col span="22" style="margin-top:8px;">
            <Table :columns="connectTableColumns" :data="connectTable">
              <div slot="footer" class="tableFooter">
                <span>电器设备功率合计：  {{tableKWTotal}}</span>
                <span style="margin-left: 1em;">燃气设备气量合计：  {{tableGASTotal}}</span>
              </div>
            </Table>
          </i-col>
        </Row>
      </FormItem>
      <FormItem>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem>
              <Button @click="connectInfoSubmit" type="warning">保存</Button>
            </FormItem>
          </i-col>
        </Row>
      </FormItem>
    </Form>
	</div>
</template>

<script>
import { showStoreDevice , editStoreDevice } from '@/api/kitchen'
export default {
  name: 'KSEDeviceInfo',
  components: {
  },
  props: {
    data:{
      type: Object,
      default () {
        return { }
      }
    },
  },
  data () {
    return {
      // 图片
      imgUrl: '',
      visible: false,

      // 基本数据
      store_id:'',
      kitchen_id:'',
       // 设备列表
      connectImgList:[],
      c_showModal:false,
      c_modalItem:{},
      connectTableColumns: [
        {
          title: '设备名称',
          key: 'title'
        },
        {
          title: '设备数量',
          key: 'quantity',
        },
        {
          title: '电压V/每个设备',
          key: 'voltage'
        },
        {
          title: '功率KW/每个设备',
          key: 'kw'
        },
        {
          title: '燃气量 m³',
          key: 'gas'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'handle',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                style: {marginRight: '5px'},
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.connectTable_EditItem(params)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.connectTable_removeItem(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      connectTable:[],
      // 编辑
      edit_showModal:false,
      connectEditItem:{},
      editIndex:'',
    }
  },
  methods: {
    trimNull (array) {
      if(array.length <= 0){
        return null;
      }
      for (var i = 0; i < array.length; i++) {
        if (array[i] == '' || typeof (array[i]) === 'undefined') {
          array.splice(i, 1)
          i = i - 1
        }
      }
      return array;
    },
    initData(){
      if(!this.data.store_id || !this.data.kitchen_id){
        return
      }
      this.store_id = this.data.store_id
      this.kitchen_id = this.data.kitchen_id
      this.initConnectInfo( this.store_id )
    },
    //设备清单
    initConnectInfo( store_id ){
      showStoreDevice( store_id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        let data = dbody.data;
        this.connectImgList = this.trimNull(data.connect.split(','))
        this.connectTable = data.device;
      })
    },
    // 删除表格信息
    connectTable_removeItem (index) {
      this.connectTable.splice(index, 1)
    },
    // 编辑表格信息
    connectTable_EditItem(params){
      this.connectEditItem = {};
      this.editIndex = '';
      this.editIndex = params.index;
      let editItem = params.row;
      this.connectEditItem = Object.assign({},editItem);
      this.edit_showModal = true;
    },
    saveEditModalInfo(){
      if(!this.regModalInfo(this.connectEditItem)){
        return
      }
      let tabledata = this.connectTable.concat();
      tabledata[this.editIndex] = this.connectEditItem;
      this.connectTable = tabledata;
    },
    //起租表格编辑
    addConnectTableDataItem(){
      this.c_modalItem = {};
      this.c_showModal = true;
    },
    // regModalInfo
    regModalInfo( data ){
      if(!data.title){
        this.$Notice.warning({
          title: "请输入设备名称！"
        })
        return false
      }
      if(!data.quantity || data.quantity*1 <= 0){
        this.$Notice.warning({
          title: "请输入设备数量！"
        })
        return false
      }
      if(!!data.voltage && data.voltage*1 < 0){
        this.$Notice.warning({
          title: "请输入设备电压！"
        })
        return false
      }
      if(!!data.kw && data.kw*1 < 0){
        this.$Notice.warning({
          title: "请输入设备功率！"
        })
        return false
      }
      if(!!data.gas && data.gas*1 < 0){
        this.$Notice.warning({
          title: "请输入设备燃气量！"
        })
        return false
      }
      return true
    },
    // 增加一条
    savec_ModalInfo(){
      if(!this.regModalInfo(this.c_modalItem)){
        return
      }
      this.c_modalItem.store_id = this.store_id;
      this.connectTable.push(this.c_modalItem);
      this.c_modalItem = {};
    },
    // 提交设备清单
    connectInfoSubmit(){
      let obj = {};
      obj.connect = this.connectImgList.length > 0 ? this.connectImgList.join(',') : '';
      obj.device = this.connectTable;
      obj.store_id = this.store_id;
      obj.kitchen_id = this.kitchen_id;
      editStoreDevice( obj ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "提交成功！"
        })
      })
    },
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    // 发送触发
    handleBeforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
      }
    },
    // 图片错误提示
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件 ' + file.name + ' 格式错误, 请上传jpg／jpeg／png格式.'
      })
    },
    // 图片超大提示
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超过最大限制',
        desc: '文件  ' + file.name + ' 过大, 不能超过 2M.'
      })
    },

    // 删除设备图片
    handleRemoveConnectImg (file) {
      this.connectImgList.splice(this.connectImgList.indexOf(file), 1)
    },
    // 获取设备图片
    handleSuccessConnectImg (res, file) {
      if (res.code == 0) {
        if(!this.connectImgList){
          this.connectImgList = [];
        }
        this.connectImgList.push(res.data)
      }else{
        this.$Notice.warning({
          title: '图片上传失败',
        })
      }
    },
  },
  computed: {
    tableKWTotal:function() {
      if (this.connectTable.length <= 0) {
        return '0.00'
      }
      let kw = 0
      this.connectTable.forEach(function (i, j) {
        if(!!i.kw && i.kw*1 > 0){kw += i.kw*1*i.quantity*1 }
      })
      return (kw*1).toFixed(2);
    },
    tableGASTotal:function() {
      if (this.connectTable.length <= 0) {
        return '0.00'
      }
      let gas = 0
      this.connectTable.forEach(function (i, j) {
        if(!!i.gas && i.gas*1 > 0){gas += i.gas*1*i.quantity*1 }
      })
      return (gas*1).toFixed(2);
    }
  },
  created () {
    this.initData();
  },
  beforeDestroy () {
    
  },
  watch: {
    data (newV, oldV) {
      this.initData();
    },
  }
}
</script>

<style lang="less" scoped>
  .tableFooter{
    margin-left: 20px;
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