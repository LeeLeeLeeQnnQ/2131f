<template>
  <div>
    <Card title="增加人员" shadow>
      <Form ref="formItem" :model="formItem" :label-width="120"  :rules="ruleValidate">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="用户名" prop="username">
                <Input v-model="formItem.username" placeholder="输入姓名"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="姓名" prop="fullname">
                <Input v-model="formItem.fullname" placeholder="输入姓名"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="性别" prop="gender">
                <RadioGroup v-model="formItem.gender">
                  <Radio label="1">男</Radio>
                  <Radio label="2">女</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="输入密码" prop="password1">
                <Input v-model="formItem.password1" placeholder="输入密码"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="确认密码" prop="password2">
                <Input v-model="formItem.password2" placeholder="输入密码"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Divider />
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="超级权限" prop="is_super">
                <RadioGroup v-model="formItem.is_super">
                  <Radio label="1">开启</Radio>
                  <Radio label="0">关闭</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="权限组" prop="group_id">
                <Select v-model="formItem.group_id">
                  <Option v-for="item in permission_group" :value="item.id" :key="item.id">{{ item.group_name }}</Option>
                </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="数据获取权限" prop="data_rule">
                <RadioGroup v-model="formItem.data_rule">
                  <Radio label="1">无限制</Radio>
                  <Radio label="2">自己</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="所属城市" prop="city_id">
                <Select v-model="formItem.city_id" multiple @on-change="obtainKitchenChange">
                  <Option v-for="item in city_list"  :value="item.id" :key="item.id">{{ item.city_name }}</Option>
                </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="所属品牌" prop="brand_id">
                <Select v-model="formItem.brand_id" multiple @on-change="obtainKitchenChange">
                  <Option v-for="item in brand_list"  :value="item.id" :key="item.id">{{ item.brand_name }}</Option>
                </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <FormItem label="所属厨房" prop="kitchen_id">
                <Select v-model="formItem.kitchen_id" multiple @on-change="obtainStoreChange">
                  <Option v-for="item in kitchen_list"  :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
                </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="档口数据权限">
                <RadioGroup v-model="obtain_store" @on-change="obtainStoreChange">
                  <Radio label="1" >获取所在厨房全部档口</Radio>
                  <Radio label="2" :disabled= obtain_select_disabled >获取所在厨房部分档口</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20" v-if="(obtain_store == 2) && (formItem.kitchen_id.length > 0)">
          <i-col span="20">
            <FormItem label="权限档口">
              <CheckboxGroup v-model="formItem.store_no" @on-change="checkStoreNo">
                <Checkbox v-for="item in store_List"  :label="item.id">{{item.store_no}}「 {{item.kitchen_name}} 」</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <FormItem label="备注" prop="textarea">
              <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入意见"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <FormItem>
            <Button @click="handleSubmit('formItem')" type="primary">提交</Button>
          </FormItem>
        </Row>
      </Form>
    </Card>
  </div>
</template>

<script>
//权限
// /api/Kitchen/index,/api/EmployeeGroup/index,/api/Employee/add
import { getEmployeeGroup, addMember } from '@/api/permission'
import { getAllCityQueryList, getAllBrandQueryList } from '@/api/permission'
import { getKitchenQueryList } from '@/api/setting'
import { getKitchenListStoreNo } from '@/api/data'
export default {
  name: 'permissionAddMember',
  data () {
    return {
      // 表单验证
      formItem: {
        username: '',
        fullname: '',
        gender: '',
        group_id: '',
        kitchen_id: [],
        password1: '',
        password2: '',
        remark: '',
        data_rule:'1',
        store_no:[],
        remark:'',
        is_super:'0',
        brand_id:'',
        city_id:'',
      },
      obtain_store:"1",
      password: '',
      ruleValidate: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '用户名不能超过50个字', trigger: 'blur' }
        ],
        password1: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', max: 16, message: '标题不能超过16个字', trigger: 'blur' },
          { type: 'string', min: 6, message: '标题不能少于6个字', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', max: 16, message: '标题不能超过16个字', trigger: 'blur' },
          { type: 'string', min: 6, message: '标题不能少于6个字', trigger: 'blur' }
        ],
        fullname: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '姓名不能超过50个字', trigger: 'blur' }
        ],
        gender: [
          { required: true}
        ],
        data_rule: [
          { required: true}
        ],
        group_id: [
          { required: true}
        ],
        kitchen_id: [
          { required: true}
        ],
        brand_id: [
          { required: true}
        ],
        city_id: [
          { required: true}
        ],
      },
      permission_group: [],
      kitchen_list: [],
      store_List:[],
      brand_list:[],
      city_list:[],
    }
  },
  methods: {
    // 提交验证器
    submitValidateField: function (obj) {
      obj.username = obj.username.trim()
      if (!obj.username) {
        this.$Notice.warning({
          title: '用户名不能为空！'
        })
        return false
      }
      obj.fullname = obj.fullname.trim()
      if (!obj.fullname) {
        this.$Notice.warning({
          title: '姓名不能为空！'
        })
        return false
      }
      if (!obj.group_id) {
        this.$Notice.warning({
          title: '姓名不能为空！'
        })
        return false
      }
      if (!obj.kitchen_id || obj.kitchen_id.length <= 0 ) {
        this.$Notice.warning({
          title: '厨房不能为空！'
        })
        return false
      }
      if (!obj.password1 || !obj.password2) {
        this.$Notice.warning({
          title: '请输入密码！'
        })
        return false
      }
      if (obj.password1.length <= 5 || obj.password2.length <= 5) {
        this.$Notice.warning({
          title: '密码不能少于6位！'
        })
        return false
      }
      if ((obj.password1 != obj.password2) || (obj.password1.length != obj.password2.length)) {
        this.$Notice.warning({
          title: '两次密码输入不一致！'
        })
        return false
      }else if (obj.password1.length <= 5 || obj.password2.length <= 5) {
        this.$Notice.warning({
          title: '密码不能少于6位！'
        })
        return false
      }{
        this.password = obj.password1
      }
      if(this.obtain_store == "1"){
        obj.store_no = '';
      }
      if(this.obtain_store == "2"){
        if(obj.store_no.length <= 0){
          this.$Notice.warning({
            title: '请选择权限档口！'
          })
          return false
        }
      }
      return true
    },
    // 提交
    handleSubmit () {
      let obj = this.formItem
      obj.kitchen_id.sort(function (a, b) { return a * 1 - b * 1 })
      obj.brand_id.sort(function (a, b) { return a * 1 - b * 1 })
      obj.city_id.sort(function (a, b) { return a * 1 - b * 1 })
      let that = this
      if (this.submitValidateField(obj)) {
        obj.password = this.password
        addMember(obj).then(res => {
          const dbody = res.data
          if (dbody.code == 0) {
            this.$Notice.warning({
              title: '信息提交完成！'
            })
            setTimeout(function () {
              that.$router.go(-1)
            }, 1500)
          } else {
            this.$Notice.warning({
              title: dbody.msg
            })
          }
        })
      }
    },
    getKitchenListStoreNo(kitchenIdArr){
      getKitchenListStoreNo(kitchenIdArr).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
        }
        let dataArr = dbody.data || [];
        let store_List = [];
        dataArr.forEach((i)=>{
          let kitchen_name = i.kitchen_name;
          let store_no = i.store_no || [];
          store_no.forEach((j)=>{
            j.kitchen_name = kitchen_name;
            store_List.push(j)
          })
        })
        this.store_List = store_List;
      })
    },
    obtainStoreChange(){
      if(this.obtain_store == "1"){
        return
      }
      if(this.obtain_store == "2"){
        this.getKitchenListStoreNo(this.formItem.kitchen_id)
      }
    },
    // 
    checkStoreNo(){
      if(this.formItem.store_no.length > 50){
         this.$Notice.warning({
          title: '档口数据不能超过50！'
        })
        this.formItem.store_no.pop()
        return
      }
    },
    getKitchenQueryList(data){
      if(!data.brand_id || data.brand_id.length <= 0){
        return
      }
      if(!data.city_id || data.city_id.length <= 0){
        return
      }
      let info = {
        city_id:data.city_id.join(','),
        brand_id:data.brand_id.join(','),
      }
      getKitchenQueryList(info).then(res => {
        let dbody = res.data
        this.kitchen_list = dbody.data || []
      })
    },
    obtainKitchenChange(){
      let data = {
        city_id:this.formItem.city_id,
        brand_id:this.formItem.brand_id,
      }
      this.getKitchenQueryList(data);
    },
  },
  computed: {
      obtain_select_disabled() {
        if(!!this.formItem.kitchen_id && this.formItem.kitchen_id.length > 0){
          return false
        }else{
          return true
        } 
      }
  },
  mounted: function () {
    getEmployeeGroup().then(res => {
      let dbody = res.data
      this.permission_group = dbody.data.list
    })
    getKitchenQueryList().then(res => {
      let dbody = res.data
      this.kitchen_list = dbody.data || [];
    })
    getAllBrandQueryList().then(res => {
      const dbody = res.data
      this.brand_list = dbody.data || []
    })
    getAllCityQueryList().then(res => {
      const dbody = res.data
      this.city_list = dbody.data || []
    })
    this.$refs.formItem.resetFields()
  }
}
</script>

<style lang="less">
</style>
