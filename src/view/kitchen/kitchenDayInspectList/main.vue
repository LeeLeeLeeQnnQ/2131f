<template>
  <div>
    <div>
      <Card shadow>
        <Row :gutter="20">
          <i-col :xs="5" :md="5" :lg="5">
            <Select v-model="curentKitchen" @on-change="getNewKitchen">
              <Option v-for="item in kitchenList"  style="width:100%;" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
            </Select>
          </i-col>
          <i-col :xs="5" :md="5" :lg="5">
            <DatePicker v-model="curentTime"  type="date" placeholder="选择日期" @on-change="getNewDate" style="width:100%;"></DatePicker>
          </i-col>
        </Row>
      </Card>
      <div style="margin-top: 10px;margin-bottom: 10px;font-size: 18px;padding-left: 20px;border-bottom: 1px solid #d7dde4;line-height: 2em;color: #657180;">
      </div>
    </div>
    <Card>
      <tables 
        :stripe="true" 
        ref="tables" 
        v-model="orderList" 
        :columns="columns" 
        @data-view="handleView"/>
      <Page 
        :current="page.current_page*1" 
        :total="page.total" 
        :page-size="page.list_rows" 
        style="margin-top:10px;" 
        @on-change="getNewPage"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { mapMutations } from 'vuex'
// 权限
// /api/Index/getKitchenList,/api/Work/index
import { getKitchenList } from '@/api/data'
import { getTotalInspectList } from '@/api/standard'
export default {
  name: 'kitchenDayInspectList',
  components: {
    Tables
  },
  data () {
    return {
      work_type:1,
      // 也属 数据
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0,
      },
      columns: [
        {title: '所属厨房', key: 'kitchen_name'},
        {title: '店铺名称', key: 'store_name'},
        {title: '店铺房号', key: 'store_no'},
        // {title: '日检人员', key: 'employee_name'},
        // { title: '白班夜班',
        //   render: (h, params) => {
        //     let status = params.row.work_type*1
        //     if (status == 1) { return h('span', '白班') };
        //     if (status == 2) { return h('span', '夜班') };
        //   }
        // },
        {title: '日检分数', key: 'score'},
        {title: '状态', key: 'check'},
        {
          title: '操作',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                style: {},
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-view', params)
                  }
                }},
              '查看报告')
            }
          ]
        }
      ],
      orderList: [],
      curentTime: '',
      curentTime2: '',
      curentKitchen: '',
      kitchenList: []
    }
  },
  methods: {
    ...mapMutations([
      'setStorePaper'
    ]),
    getNewDate (date) {
      this.curentTime = date
      this.curentTime2 = date
      let data = {
        work_date : this.curentTime2,
        kitchen_id : this.curentKitchen,
        work_type : this.work_type,
      }
      getTotalInspectList( data ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Message.warning(dbody.msg)
          return
        }
        this.orderList = dbody.data.list || []
        this.page = dbody.data.page
      })
    },
    getNewKitchen () {
      let data = {
        work_date : this.curentTime2,
        kitchen_id : this.curentKitchen,
        work_type : this.work_type,
      }
      getTotalInspectList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Message.warning(dbody.msg)
          return
        }
        this.orderList = dbody.data.list || []
        this.page = dbody.data.page
      })
    },
    handleView (params) {
      let info = params.row;
      let type = this.work_type + '' + this.curentKitchen + '' + '1';
      if(info.store_id*1 == 0){
        type = this.work_type + '' + this.curentKitchen + '' + '2';
      }
      this.setStorePaper( info );
      let query = {
        type : type,
        work_type : this.work_type,
      }
      const route = {
        name: 'kitchenDayInspectItem',
        query: query
      }
      this.$router.push(route)
    },
    //
    getCurentTime () {
      var date = new Date()
      var seperator1 = '-'
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    // getNewPage
    getNewPage (page) {
      let data = {
        work_date : this.curentTime2,
        kitchen_id : this.curentKitchen,
        work_type : this.work_type,
        page : page
      }
      getTotalInspectList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Message.warning(dbody.msg)
          return
        }
        this.orderList = dbody.data.list || []
        this.page = dbody.data.page
      })
    }
  },
  created () {
    // 获取当前时间
    this.curentTime = this.getCurentTime()
    this.curentTime2 = this.getCurentTime()
    // 获取厨房列表
    getKitchenList().then(res => {
      const dbody = res.data
      this.kitchenList = dbody.data || []
      this.curentKitchen = this.kitchenList[this.kitchenList.length - 1].id
      let data = {
        work_date : this.curentTime2,
        kitchen_id : this.curentKitchen,
        work_type : this.work_type,
      }
      getTotalInspectList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Message.warning(dbody.msg)
          return
        }
        this.orderList = dbody.data.list || []
        this.page = dbody.data.page
      })
    })
  },
  computed: {

  }
}
</script>

<style>

</style>
