<template>
	<div>
		<Modal v-model="showModal" title="登记人员" @on-ok="saveModalInfo">
      <Form :model="modalItem" :label-width="80">
        <FormItem label="姓名">
          <Input v-model="modalItem.fullname" placeholder="输入姓名" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="modalItem.gender">
              <Radio label="1">男</Radio>
              <Radio label="2">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="身份证">
          <Input v-model="modalItem.id_card" placeholder="输入身份证" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="联系方式">
          <Input v-model="modalItem.contact" placeholder="输入联系方式" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="健康证日期">
          <DatePicker v-model="modalItem.card_date" format="yyyy-MM-dd" type="datetime" placeholder="健康证日期" style="width: 200px" @on-change="selectDate"></DatePicker>
        </FormItem>
        <FormItem label="职位">
          <Select v-model="modalItem.post" style="width: 200px">
              <Option value="店长">店长</Option>
              <Option value="店员">店员</Option>
          </Select>
        </FormItem>
        <FormItem label="备注">
            <Input v-model="modalItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
	  </Modal>
	  <Card style="padding-top: 2em;">
	    <a href="#" slot="extra" @click.prevent="addMember">
	          <Icon type="ios-loop-strong"></Icon>
	          登记人员
	    </a>
	    <tables ref="tables" v-model="memberList" :columns="memberListColumns" @data-dele="handleDataDele" @data-edit="handleDataEdit"/>
	  </Card>
	</div>
</template>
<script>
import Tables from '_c/tables'
import { getStoreEmployeeList , addStoreEmployee , editStoreEmployee , deleteStoreEmployee } from '@/api/kitchen'
export default {
  name: 'KSEMemberInfo',
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
      store_id:'',
    	kitchen_id:'',

    	//人员列表
      memberListColumns: [
        {title: '姓名', key: 'fullname'},
        { title: '性别',
          render: (h, params) => {
            let status = params.row.gender*1
            if (status == 1) { return h('span', '男') };
            if (status == 2) { return h('span', '女') };
          }
        },
        {title: '档口名称', key: 'store_name'},
        {title: '职位', key: 'post'},
        {title: '身份证', key: 'id_card'},
        {title: '健康证日期', key: 'card_date'},
        {title: '联系方式', key: 'contact'},
        {title: '备注', key: 'remark'},
        {
          title: '操作',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('a', {
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
                h('a', {style: {marginLeft: '8px'}}, '删除')
              ])
            }
          ]
        }
      ],
      memberList: [],
      modalItem:{},
      showModal:false,
    }
  },
  methods: {
  	initData(){
  	  if(!this.data.store_id || !this.data.kitchen_id){
        return
      }
      this.store_id = this.data.store_id
      this.kitchen_id = this.data.kitchen_id
      this.initMemberList( this.store_id )
  	},
  	initMemberList( store_id ){
      getStoreEmployeeList( store_id ).then(res => {
      const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.memberList = dbody.data.list || []
      })
    },
    saveModalInfo(){
      if(!this.verificatInfo(this.modalItem)){
        return 
      }
      this.modalItem.kitchen_id = this.kitchen_id
      this.modalItem.store_id = this.store_id
      if(this.modalItem.type == "add"){
        //添加
        addStoreEmployee(this.modalItem).then(res => {
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
          this.updateTable();
          return
        })
      }
      if(this.modalItem.type == "edit"){
        //修改
        editStoreEmployee(this.modalItem).then(res => {
          const dbody = res.data
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            return
          }
          this.$Notice.warning({
            title: "更新成功！"
          })
          this.updateTable();
          return
        })
      }
    },
    verificatInfo(info){
      if(!info.fullname){
        this.$Notice.warning({
          title: "请输入姓名！"
        })
        return false
      }
      info.fullname = info.fullname.trim();
      if(!info.contact){
        this.$Notice.warning({
          title: "请输入联系方式！"
        })
        return false
      }
      let regId_card = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(!!info.id_card && (regId_card.test(info.id_card) === false)){
        this.$Notice.warning({
          title: "请输入正确身份证！"
        })
        return false
      }
      return true
    },
    selectDate(date){
      this.modalItem.card_date = date;
    },
    // 编辑
    handleDataEdit (params) {
      this.modalItem = {};
      this.modalItem.id = params.row.id;
      this.modalItem.fullname = params.row.fullname;
      this.modalItem.contact = params.row.contact;
      this.modalItem.gender = params.row.gender;
      this.modalItem.post = params.row.post;
      this.modalItem.card_date = params.row.card_date;
      this.modalItem.id_card = params.row.id_card;
      this.modalItem.remark = params.row.remark;
      this.modalItem.type = "edit";
      this.showModal = true;
    },
    addMember(){
      this.modalItem = {};
      this.modalItem.type = "add";
      this.showModal = true;
    },
    handleDataDele (params) {
      let id = params.row.id
      deleteStoreEmployee( id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
        } else {
          this.$Notice.warning({
            title: '删除成功！'
          })
          this.updateTable();
        }
      })
    },
    handleDataDele (params) {
      let id = params.row.id
      deleteStoreEmployee( id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
        } else {
          this.$Notice.warning({
            title: '删除成功！'
          })
          this.updateTable();
        }
      })
    },
    updateTable(){
      getStoreEmployeeList(this.store_id).then(res => {
      const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.memberList = dbody.data.list || []
      })
    },
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