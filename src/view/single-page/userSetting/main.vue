<template>
  <div>
    <Card title="密码更改" shadow>
      <Form ref="formItem" :model="formItem" :label-width="80">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="8">
            <FormItem label="旧密码">
                <Input type="password" v-model="formItem.oldPWD" placeholder="输入旧密码"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="8">
            <FormItem label="新密码">
                <Input type="password" v-model="formItem.newPWD" placeholder="输入新密码"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="8">
            <FormItem label="确认密码">
                <Input type="password" v-model="formItem.comPWD" placeholder="确认新密码"></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <FormItem>
            <Button @click="changePWD" type="primary">确认更改</Button>
          </FormItem>
        </Row>
      </Form>
    </Card>
  </div>
</template>

<script>
import { setNewPWD } from '@/api/data'
export default {
  name: 'userSetting',
  data () {
    return {
      formItem: {
        oldPWD: '',
        newPWD: '',
        comPWD: ''
      }
    }
  },
  methods: {
    // 提交
    changePWD () {
      if (!this.formItem.oldPWD) {
        this.$Notice.warning({
          title: '旧密码必须填写！'
        })
        return
      }
      if (!this.formItem.newPWD || !this.formItem.comPWD) {
        this.$Notice.warning({
          title: '新密码必须填写！'
        })
        return
      }
      if (this.formItem.newPWD != this.formItem.comPWD) {
        this.$Notice.warning({
          title: '两次密码必须一致！'
        })
        return
      }
      let obj = {
        old_password: this.formItem.oldPWD,
        password: this.formItem.newPWD,
        confirm_password: this.formItem.comPWD
      }
      setNewPWD(obj).then(res => {
        const dbody = res.data
        if (dbody.code == 0) {
          this.$Notice.warning({
            title: '密码修改完成！'
          })
          this.formItem = {
            oldPWD: '',
            newPWD: '',
            comPWD: ''
          }
        } else {
          this.$Notice.warning({
            title: dbody.msg
          })
        }
      })
    }
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
