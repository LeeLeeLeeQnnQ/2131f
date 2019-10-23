<Card shadow>
  <Row :gutter="20">
    <i-col :xs="12" :md="12" :lg="12">
      <Select v-model="sreach.kitchen_id" multiple placeholder="请选择厨房">
        <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
      </Select>
    </i-col>
    <i-col :xs="6" :md="6" :lg="6">
      <DatePicker  @on-change="selectDate"  type="month"  placeholder="选择时间" style="width: 200px"></DatePicker>
    </i-col>
    <i-col :xs="3" :md="3" :lg="3">
      <Button type="primary" shape="circle" long @click="sreachSubmit">搜索</Button>
    </i-col>
  </Row>
  <Row :gutter="20" style="margin-top: 15px;" v-for="item in column_data">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <Card>
          <p slot="title">
           {{item.kitchen_name}}合计收入：{{item.total}}
          </p>
          <chart-column style="height: 300px;" :value="item.column" :text="item.kitchen_name"></chart-column>
        </Card>
      </i-col>
    </Row>
</Card>

<script>
// 权限
// Kitchen/index,StoreLease/index,StoreLease/exportStoreLease,StoreLease/settle,StoreLease/edit

import AFPIncome from './components/AFPIncome'
import AFPExpend from './components/AFPExpend'

// Kitchen/index,KitchenIncome/queryList,KitchenIncome/getIncomeType
import { getKitchenQueryList  } from '@/api/setting'
import { getKitchenIncomeQuery , getIncomeType , getKitchenExpendQuery , getExpendType } from '@/api/finance'
import { ChartColumn } from '_c/charts'
export default {
  name: 'analysisFinanceProfit',
  components: {
    AFPIncome,
    AFPExpend,
  },
  data () {
    return {
      // 固体数据
      kitchenList:[],
      // 搜索条件
      sreach:{
        kitchen_id:'',
        start_time:'',
        end_time:'',
        category_id:'1',
      },
      // 收入
      incomeBaseinfo:[],
      tagIncomeList:[],
      tagIncomeObj:{},
      // 支出
      expendBaseinfo:[],
      tagExpendList:[],
      tagExpendObj:{},
    }
  },
  methods: {

  },
  mounted () {

  },
  created () {
    getKitchenQueryList().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      // 初始化函数
      this.kitchenList = dbody.data || [];
    });
    getIncomeType( ).then(res => {
      const dbody = res.data
      if(dbody.code != 0){
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      let obj = {}
      dbody.data.forEach((item)=>{
        if(item.category_id == 1){
          obj[item.type] = 0;
        }
      })
      this.tagIncomeList = dbody.data;
      this.tagIncomeObj = obj;
    });
    getExpendType( ).then(res => {
      const dbody = res.data
      if(dbody.code != 0){
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      let obj = {}
      dbody.data.forEach((item)=>{
        if(item.category_id == 1){
          obj[item.type] = 0;
        }
      })
      this.tagExpendList = dbody.data;
      this.tagExpendObj = obj;
    })
  },
}
</script>