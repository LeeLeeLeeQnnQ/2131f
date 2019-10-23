<template>
  <div>
    <Card>
      <p slot="title">
        电表
      </p>
      <a href="#" slot="extra" @click.prevent="addMeter(1)">
          增加公摊电表
      </a>
      <tables :columns="energy_record_columns" v-model="energy_record_list" @data-dele="deleteKitchenMeter"/>
    </Card>
    <Card style="margin-top: 10px">
      <p slot="title">
        水表
      </p>
      <a href="#" slot="extra" @click.prevent="addMeter(2)">
          增加公摊水表
      </a>
      <tables :columns="water_record_columns" v-model="water_record_list" @data-dele="deleteKitchenMeter"/>
    </Card>
    <Modal v-model="addMeterShowModal" title="编辑表格" @on-ok="addKitchenMeter">
      <Form :model="addMeterItem" :label-width="80">
        <FormItem label="类型">
          <Select v-model="addMeterItem.meter_type" disabled>
              <Option :value="1" :key="1">电表</Option>
              <Option :value="2" :key="2">水表</Option>
          </Select>
        </FormItem>
        <FormItem label="表名">
          <Input v-model="addMeterItem.meter_name" placeholder="输入表名"></Input>
        </FormItem>
        <FormItem label="倍率">
          <Input v-model="addMeterItem.multiple" placeholder="输入倍率"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getKitchenMeterList , addKitchenMeter ,deleteKitchenMeter } from '@/api/setting'


export default {
  name: 'KDSLKitchenMeter',
  components: {
    Tables,
  },
  props: {
    kitchen_id:{
      default () {
        return ''
      }
    },
  },
  data () {
    return {
      energy_record_columns:[
        {title: '所属厨房', key: 'kitchen_name'},
        {title: '电表名称', key: 'meter_name'},
        {title: '倍率', key: 'multiple'},
        {title: '添加人', key: 'creator_name'},
        {
          title: '操作',
          key: 'handle',
          width : 90,
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-dele', params)
                  }
                }},
              '删除')
            }
          ]
        }
      ],
      water_record_columns:[
        {title: '所属厨房', key: 'kitchen_name'},
        {title: '水表名称', key: 'meter_name'},
        {title: '倍率', key: 'multiple'},
        {title: '添加人', key: 'creator_name'},
        {
          title: '操作',
          key: 'handle',
          width : 90,
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-dele', params)
                  }
                }},
              '删除')
            }
          ]
        }
      ],
      energy_record_list:[],
      water_record_list:[],
      addMeterItem:{},
      addMeterShowModal:false,
    }
  },
  methods: {
    getKitchenMeterList( obj ){
      getKitchenMeterList( obj ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        let arr = dbody.data;
        let arr_e = [];
        let arr_w = [];
        arr.forEach( function(element, index) {
          if(element.meter_type*1  == 1){
            arr_e.push(element)
          }else{
            arr_w.push(element)
          }
        });
        this.energy_record_list = arr_e;
        this.water_record_list = arr_w;
      })
    },
    // 增加公摊表
    addMeter( meter_type ){
      this.addMeterItem = {};
      this.addMeterItem.meter_type = meter_type;
      this.addMeterShowModal = true;
    },
    // 确认增加
    addKitchenMeter(){
      if(!this.addMeterItem.meter_name){
        this.$Notice.warning({
          title: "表名必须填写！"
        })
        return
      }
      if(!this.addMeterItem.multiple){
        this.$Notice.warning({
          title: "倍率必须填写！"
        })
        return
      }
      this.addMeterItem.kitchen_id = this.kitchen_id;
      addKitchenMeter( this.addMeterItem ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "添加成功！"
        })
        this.getKitchenMeterList({ kitchen_id : this.kitchen_id});
      })
    },
    // 删除表
    deleteKitchenMeter(params){
      let id = params.row.id;
      deleteKitchenMeter( { id : id } ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "删除成功！"
        })
        this.getKitchenMeterList({ kitchen_id : this.kitchen_id});
      })
    },
    // init
    initData(){
      if(!this.kitchen_id){
        return
      }
      this.getKitchenMeterList({ kitchen_id : this.kitchen_id});
    },
  },
  created(){
    
  },
  mounted () {
    this.initData();
  },
  beforeDestroy () {
    
  },
  watch: {
    kitchen_id (newV, oldV) {
      this.initData();
    },
  }
}




</script>