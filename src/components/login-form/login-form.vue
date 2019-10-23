<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="captcha">
      <Input v-model="form.captcha" placeholder="请输入验证码">
        <span slot="prepend">
          <Icon :size="14" type="md-settings" />
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <img ref="captcha" style="width:100%;height:100%" :src="captcha_src" name="verify" title="看不清,点击更换验证码" @click="changeCaptcha"/>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getCaptcha } from '@/api/user'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    captchaRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: '',
        password: '',
        captcha: ''
      },
      captcha_src: ''
    }
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules,
        captcha: this.captchaRules
      }
    }
  },
  created: function () {
    this.setCaptcha()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            username: this.form.username,
            password: this.form.password,
            captcha: this.form.captcha
          })
        }
      })
    },
    changeCaptcha () {
      getCaptcha().then(res => {
        this.$refs.captcha.src = res.data.data
      })
    },
    setCaptcha () {
      getCaptcha().then(res => {
        this.captcha_src = res.data.data
      })
    }
  }
}
</script>
