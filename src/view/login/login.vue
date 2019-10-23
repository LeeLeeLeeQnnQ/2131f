<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录橘猫精选后台" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip"></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapMutations, mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'setUserInfo'
    ]),
    handleSubmit ({ username, password, captcha }) {
      let that = this;
      // 数据请求增容
      that.handleLogin({ username, password, captcha }).then(res => {
        if (res.code != 0) {
          that.$Message.warning(res.msg)
          return
        }
        that.setUserInfo().then(res => {
          if(res.code == 0){
            that.$Message.info("登陆中...")
            that.$nextTick(function () {
              setTimeout(function(){
                that.$router.push({
                  name: that.$config.homeName
                })
              }, 500)
            })
          }
        })
      })
      // this.handleLogin({ username, password, captcha }).then(res => {
      //   if (res.code != 0) {
      //     this.$Message.warning(res.msg)
      //     return
      //   }
      //   this.setUserInfo().then(res => {
      //     if(res.code == 0){
      //       this.$nextTick(function () {
      //         this.$router.push({
      //           name: this.$config.homeName
      //         })
      //       })
      //     }
      //   })
      // })
    }
  }
}
</script>

<style>

</style>
