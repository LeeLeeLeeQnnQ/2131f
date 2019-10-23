<template>
  <div>
    <Row :gutter="20">
      <i-col span="5">
        <Card class='cardHigh'>
          <p slot="title">
              <Icon type="md-person"/></Icon>
              人员列表
          </p>
          <p v-for="(item,index) in personList" @click="selectPerson(index)" class="pCell">
            {{item.fullname}}
          </p>
        </Card>
      </i-col>
      <i-col span="5">
        <Card class='cardHigh'>
          <p slot="title">
              <Icon type="md-home" /></Icon>
              店铺列表
          </p>
          <p v-for="(item,index) in shopList" @click="selectShop(index)" class="pCell">
            {{item.store_no}} / {{item.store_name}}
          </p>
        </Card>
      </i-col>
      <i-col span="14">
        <Card class='cardHigh_2'>
          <p slot="title">
              匹配組
              <a @click="confirmMatch" style="margin-left: 20px;">确认匹配</a>
          </p>
          <Row :gutter="20" class='cardBgc'>
            <i-col span="12">
              <p>
                姓名
              </p>
              <p v-for="item in matchPerson" @click="returnPerson" class="pCell">
                {{item.fullname}}
              </p>
            </i-col>
            <i-col span="12">
              <p>
                厨房
              </p>
              <p v-for="(item,index) in matchShop" @click="returnShop(index)" class="pCell">
                {{item.store_name}}
              </p>
            </i-col>
          </Row>
        </Card>
        <Card class='cardHigh_2'>
          <p slot="title">
              已经匹配
              <a @click="setCalendar" style="margin-left: 20px;">保存班表</a>
          </p>
          <Row :gutter="20">
              <p v-if="item.person.length > 0 && item.shop.length > 0" v-for="(item,index) in matchList" class="pCell">
                <span  v-for="i in item.person">
                  <Icon type="ios-contact" />
                  {{ i.fullname }}
                </span>
                <Icon type="md-arrow-round-forward" />
                <span v-for="i in item.shop" style="margin-left: 5px;">
                  <Icon type="ios-home" />
                  {{ i.store_name }}
                </span>
                <a @click="deleteData(index)" style="margin-left: 20px;">删除</a>
              </p>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Card title="生效班表" style="margin-top: 10px;">
      <Row :gutter="20">
        <i-col span="4">
          姓名
        </i-col>
        <i-col span="20">
          商户
        </i-col>
      </Row>
      <Row :gutter="20" v-if="calendarList.length > 0" v-for="item in calendarList" style="margin-top: 10px;">
        <i-col span="4">
          <span class="shopCell">
            <Icon type="ios-contact" />
            {{item.person[0].fullname}}
          </span>
        </i-col>
        <i-col span="20">
          <span v-for="i in item.shop" class="shopCell">
            <Icon type="ios-home" />
            {{i.store_name}}
          </span>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'calendar',
  props: {
    list: {
      type: Object,
      default () {
        return { personList: [], shopList: []}
      }
    }
  },
  data () {
    return {
      personList: [],
      shopList: [],
      matchPerson: [],
      matchShop: [],
      matchList: [],
      calendarList: []
    }
  },
  methods: {
    selectPerson (index) {
      if (this.matchPerson.length > 0) {
        this.personList = this.personList.concat(this.matchPerson)
        this.matchPerson = []
      }
      this.matchPerson = this.matchPerson.concat(this.personList.splice(index, 1))
    },
    selectShop (index) {
      this.matchShop = this.matchShop.concat(this.shopList.splice(index, 1))
    },
    returnPerson () {
      this.personList = this.personList.concat(this.matchPerson)
      this.matchPerson = []
    },
    returnShop (index) {
      this.shopList = this.shopList.concat(this.matchShop.splice(index, 1))
    },
    deleteData (index) {
      let obj = this.matchList.splice(index, 1)[0]
      this.shopList = this.shopList.concat(obj.shop)
      this.personList = this.personList.concat(obj.person)
    },
    confirmMatch () {
      if (this.matchPerson.length <= 0) {
        this.$Notice.warning({
          title: '请选择员工！'
        })
        return
      }
      if (this.matchShop.length <= 0) {
        this.$Notice.warning({
          title: '请选择店铺！'
        })
        return
      }
      let obj = {
        person: this.matchPerson,
        shop: this.matchShop
      }
      this.matchList.push(obj)
      this.matchShop = []
      this.matchPerson = []
    },
    setCalendar () {
      if (this.shopList.length > 0 || this.matchShop.length > 0) {
        this.$Notice.warning({
          title: '店铺未分配完毕！'
        })
        return
      }
      let arr = this.matchList
      this.matchList = []
      this.calendarList = arr
      this.dlist = JSON.parse(JSON.stringify(this.list))
      this.personList = this.dlist.personList
      this.shopList = this.dlist.shopList
      this.$emit('sendCalendar', this.calendarList)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.personList = this.list.personList.slice()
      this.shopList = this.list.shopList.slice()
    })
  },
  watch: {
    list: { // 深度监听，可监听到对象、数组的变化
      handler (newV, oldV) {
        this.personList = newV.personList.slice()
        this.shopList = newV.shopList.slice()
        this.matchPerson = []
        this.matchShop = []
        this.matchList = []
        this.calendarList = []
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .cardHigh{
    height: 500px;
    overflow: auto;
  }
  .cardHigh_2{
    height: 250px;
    overflow: auto;
  }
  .pCell{
    padding: 5px;
    cursor: pointer;
  }
  .cardBgc{
    background-color: #f5f7f9;
    border-radius: 5px;
    padding: 5px 0;
    height: 100%;
    overflow: auto;
  }
  .shopCell{
    background-color: #5cadff;
    border-radius: 5px;
    padding: 5px;
    margin-right: 5px;
    color: #fff;
    display: inline-block;
    margin-top: 5px;
  }
</style>
