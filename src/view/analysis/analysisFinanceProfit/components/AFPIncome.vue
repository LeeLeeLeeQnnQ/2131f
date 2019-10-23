<template>
  <div>
    
  </div>
</template>

<script>
  //权限
// Kitchen/index,KitchenIncome/queryList,KitchenIncome/getIncomeType
import { getKitchenQueryList  } from '@/api/setting'
import { getKitchenIncomeQuery , getIncomeType  } from '@/api/finance'
import { ChartColumn } from '_c/charts'
export default {
  name: 'AFPIncome',
  components: {
    ChartColumn
  },
  props: {
    sreachInfo:{
      type: Object,
      default () {
        return {
          kitchen_id:'',
          start_time:'',
          end_time:'',
          category_id:'1',
        }
      }
    },
  },
  data () {
    return {
      // 固体数据
      kitchenList:[],
      // init 数据
      baseinfo:[],
      column_data:[],
      kitchen_column:[],
      tagList:[],
      tagObj:{},
    }
  },
  methods: {

  },
  mounted () {
    
  },
  beforeDestroy () {
    
  },
  watch: {
    sreachInfo (newV, oldV) {
      this.initData();
    },
  }
}
</script>