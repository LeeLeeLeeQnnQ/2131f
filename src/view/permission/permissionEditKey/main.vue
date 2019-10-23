<template>
  <div>
    <Card title="权限操作" shadow>
      <Form ref="formItem" :model="formItem" :label-width="80"  :rules="ruleValidate">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="角色名称" prop="group_name">
                <Input v-model="formItem.group_name" placeholder="输入姓名"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <FormItem label="角色描述">
              <Input v-model="formItem.describe" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入意见"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <FormItem label="角色授权">
              <Tree  ref="tree" show-checkbox :data="employeeModulesList" show-checkbox></Tree>
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
// /api/EmployeeGroup/getModules,/api/EmployeeGroup/show,/api/EmployeeGroup/edit
import { getEmployeeModules, getEmployeeGroupDetail, editEmployeeGroup } from '@/api/permission'

export default {
  name: 'permissionEditKey',
  data () {
    return {
      formItem: {
        group_name: '',
        describe: ''
      },
      edit_id: '',
      ruleValidate: {
        group_name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '标题不能超过50个字', trigger: 'blur' }
        ]
      },
      employeeModulesList: [],
      old_rules: []
    }
  },
  methods: {
    // 提交验证器
    submitValidateField: function (obj) {
      obj.group_name = obj.group_name.trim()
      if (!obj.group_name) {
        this.$Notice.warning({
          title: '角色名不能为空！'
        })
        return false
      }
      if (!obj.rules || obj.rules.length <= 0) {
        this.$Notice.warning({
          title: '权限不能为空！'
        })
        return false
      }
      return true
    },
    // 提交
    handleSubmit (name) {
      let submitPermission = this.$refs.tree.getCheckedNodes()
      let arr = []
      let obj = this.formItem
      let that = this
      submitPermission.forEach(function (item) {
        arr = arr.concat(item.parentStr.split(','))
        arr.push(item.id + '')
      })
      arr = this.uniqueArr(arr)
      obj.rules = this.removeByValue(arr, 0)
      obj.id = this.edit_id
      if (this.submitValidateField(obj)) {
        editEmployeeGroup(obj).then(res => {
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
    uniqueArr (arr) {
      let newArr = []
      for (let i = 0, len = arr.length; i < len; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
          newArr.push(arr[i])
        }
      }
      return newArr
    },
    // 去零
    removeByValue (arr, val) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          arr.splice(i, 1)
        }
      }
      return arr
    },
    // ishasRule()
    ishasRule (id) {
      for (let i = 0; i < this.old_rules.length; i++) {
        if (this.old_rules[i] == id) { return true }
      }
    },
    // 递归获取数组selected
    recursiveArr (arr, pid) {
      let that = this
      arr.forEach(function (item) {
        // 拼接权限
        item.parentStr = pid + '' ? (pid + ',' + item.parent_id) : item.parent_id + ''
        if (item.children.length > 0) {
          that.recursiveArr(item.children, item.parentStr)
        }else{
          if (that.ishasRule(item.id)) { item.checked = true }
        }
      })
    },
    // 获取权限数组
    getEmployeeModulesList () {
      getEmployeeModules().then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.recursiveArr(dbody.data, '')
        this.employeeModulesList = dbody.data
      })
    }
  },
  created () {
    this.edit_id = this.$route.query.id
    getEmployeeGroupDetail(this.edit_id).then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      this.formItem.describe = dbody.data.describe
      this.formItem.group_name = dbody.data.group_name
      this.old_rules = dbody.data.rules
      this.getEmployeeModulesList()
    })
  }
}
</script>

<style lang="less">
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
