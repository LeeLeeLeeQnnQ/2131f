<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <div class="logo-con" :style="{marginTop:'5px'}">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <div class="posLeft" >
            <a href="#" type="text" @click.prevent="goBack">返回上一页</a>
          </div>
          <Dropdown
            @on-click="handleClickCity"
            class="posLeft  main-dropdown"
            style="margin-left: 120px;width: 100px;"
            >
              <a href="javascript:void(0)">
                  <span>{{currentCity}}</span>
                  <Icon :size="18" type="md-arrow-dropdown"></Icon>
              </a>
              <DropdownMenu slot="list">
                  <DropdownItem v-for="item in cityList" :name="item.id">{{item.city_name}}</DropdownItem>
              </DropdownMenu>
          </Dropdown>
          <Dropdown
            @on-click="handleClickBrand"
            class="posLeft  main-dropdown"
            style="margin-left: 225px;width: 100px;"
            >
              <a href="javascript:void(0)">
                  <span>{{currentBrand}}</span>
                  <Icon :size="18" type="md-arrow-dropdown"></Icon>
              </a>
              <DropdownMenu slot="list">
                  <DropdownItem v-for="item in brandList" :name="item.id">{{item.brand_name}}</DropdownItem>
              </DropdownMenu>
          </Dropdown>

          <user :user-name="userName"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
          
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <keep-alive :exclude="exCludeList" v-if="isRouterAlive">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import { getBrandList, getCityList } from '@/api/permission'

import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getUsername , getCity , getBrand , setCity , setBrand } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Fullscreen,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      brandList:[],
      cityList:[],
      currentCity:'',
      currentBrand:'',
      isRouterAlive:true,
    }
  },
  computed: {
    userName () {
      return getUsername()
    },
    exCludeList () {
      let exCludeArr = ['ParentView']
      this.flatRoutersArr(routers,exCludeArr)
      return exCludeArr
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
  },
  methods: {
    ...mapMutations([
      'setLocal',
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    flatRoutersArr(tree,line){
      tree.map((item)=>{
        if(item.meta && item.meta.notCache){
          line.push(item.name)
        }
        if(item.children){
          this.flatRoutersArr(item.children,line);
        }
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
     // 返回上一页
    goBack(){
      this.$router.go(-1);
    },
    // 城市列表
    getBrandList(){
      getBrandList().then(res => {
        const dbody = res.data
        this.brandList = dbody.data || [];
        this.currentBrand = this.setCurrentBrand()
      })
    },
    getCityList(){
      getCityList().then(res => {
        const dbody = res.data
        this.cityList = dbody.data || [];
        this.currentCity = this.setCurrentCity()
      })
    },
    handleClickCity(name){
      setCity(name)
      this.currentCity = this.setCurrentCity();
      this.reload();
    },
    handleClickBrand(name){
      setBrand(name)
      this.currentBrand = this.setCurrentBrand();
      this.reload();
    },
    setCurrentCity(){
      let id = getCity();
      let name = ''
      this.cityList.forEach((item)=>{
        if(item.id*1 == id*1){
          name = item.city_name;
        }
      })
      return name
    },
    setCurrentBrand(){
      let id = getBrand();
      let name = ''
      this.brandList.forEach((item)=>{
        if(item.id*1 == id*1){
          name = item.brand_name;
        }
      })
      return name
    },
    reload () {
       this.isRouterAlive = false
       this.$nextTick(() => (this.isRouterAlive = true))
     }
  },
  watch: {

  },
  mounted(){
    
    
  },
  created () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setLocal(this.$i18n.locale)
    this.getBrandList()
    this.getCityList()
  }
}
</script>
<style lang="less">
.left-sider{
  .ivu-layout-sider-children{
    background-color: #001529;
  }
}
.main{
  &-dropdown{
    cursor: pointer;
    display: inline-block;
    height: 64px;
    vertical-align: middle;
    line-height: 64px;
    .ivu-dropdown-rel{
      height: 100%;
    }
    span{
      max-width: 70%;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    a{
      color: #515A6e;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    :hover a{
      color: #515A6e;
    }
  }
}
</style>
