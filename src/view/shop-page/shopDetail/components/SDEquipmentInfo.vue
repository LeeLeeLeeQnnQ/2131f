<template>
	<div>
    <Modal title="预览图" fullscreen v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
		<Form :label-width="100">
      <FormItem label="设备凭证">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <div class="img-upload-list" v-for="item in equipmentinfo.connect">
                <img :src="item">
                <div class="img-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
          </i-col>
        </Row>
      </FormItem>
      <Table ref="tables" :data="equipmentTableData" :columns="equipmentColumns"/>
        <div slot="footer" class="tableFooter">
          <h3>
              <span>电器设备功率合计：  {{tableKWTotal}}</span>
              <span style="margin-left: 1em;">燃气设备气量合计：  {{tableGASTotal}}</span>
            </h3>
        </div>
      </Table>
    </Form>
	</div>
</template>

<script>
import { showStoreDevice } from '@/api/kitchen'
import Tables from '_c/tables'
export default {
  name: 'SDEquipmentInfo',
  components: {
    Tables
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
      // 设备清单
      equipmentColumns:[
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
      ],
      equipmentinfo:{},
      equipmentTableData:[],
      imgUrl: '',
      visible: false,
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
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
  	initData(){
      if(!this.data.store_id){
        return
      }
      this.store_id = this.data.store_id
      this.initEquipmentinfo(this.store_id)
    },
    initEquipmentinfo( store_id ){
      showStoreDevice( store_id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: "设备清单获取失败！"
          })
          return
        }
        let data = dbody.data;
        this.equipmentinfo.connect = this.trimNull(data.connect.split(','))
        this.equipmentTableData = data.device;
      })
    },
  },
  created () {
    this.initData();
  },
  computed: {
    tableKWTotal:function() {
      if (this.equipmentTableData.length <= 0) {
        return '0.00'
      }
      let kw = 0
      this.equipmentTableData.forEach(function (i, j) {
        if(!!i.kw && i.kw*1 > 0){kw += i.kw*1*i.quantity*1 }
      })
      return (kw*1).toFixed(2);
    },
    tableGASTotal:function() {
      if (this.equipmentTableData.length <= 0) {
        return '0.00'
      }
      let gas = 0
      this.equipmentTableData.forEach(function (i, j) {
        if(!!i.gas && i.gas*1 > 0){gas += i.gas*1*i.quantity*1 }
      })
      return (gas*1).toFixed(2);
    }
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
  .ivu-tabs-content{
    overflow-x: hidden;
  }
  .tableFooter{
    margin-left: 20px;
  }
  .cellTit{
    margin-bottom: 12px;
    span{
      color:#fff;
      background-color:#3399ff;
      border-radius:5px;
      padding:5px 8px;
      margin-right: 10px;
    }
    .noData{
      background-color: #ff9900;
    }
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