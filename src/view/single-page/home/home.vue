<template>
  <div class="hy-box filter-mix">
    <h3>欢迎使用橘猫精选后台</h3>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {

  },
  data () {
    return {

    }
  },
  methods: {

  },
  created () {

  },
  computed: {

  }
}
</script>

<style lang="less">
  .hy-box{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('../../../assets/images/shop.jpeg');
    background-size: cover;
    background-position: center;
    position: relative;
    h3{
      font-size: 2.5em;
      color:#fff;
      padding: 15px 120px;
      background-color: #ca7944;
      opacity: 0.8;
      margin-bottom:-300px;
    }
  }
</style>
