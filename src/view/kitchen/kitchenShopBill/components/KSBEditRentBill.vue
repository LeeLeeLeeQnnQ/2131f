<template>
  <div>
    <Modal 
      v-model="showEditStoreRentBillModal" 
      title="编辑房租" 
      @on-ok="editStoreRentBill" 
      :mask-closable="false">
      <Form :model="storeRentBill" :label-width="80">
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="22">
            <FormItem>
              <span>{{storeRentBill.month}} / {{storeRentBill.store_name}}</span>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="房租">
              <Input v-model="storeRentBill.rent_fee" style="width: 200px" ></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="滞纳金">
              <Input v-model="storeRentBill.rent_overdue_fee" style="width: 200px" ></Input>
            </FormItem>
          </i-col>
        </Row>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="10">
            <FormItem label="房租减免">
              <Input v-model="storeRentBill.rent_exempt_fee" style="width: 200px" ></Input>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {  editStoreBillItem } from '@/api/kitchen'

export default {
  name: 'KSBEditRentBill',
  components: {

  },
  props: {
    info:{
      type: Object,
      default () {
        return { }
      }
    },
    initTable: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      storeRentBill:{},
      showEditStoreRentBillModal:false,
    }
  },
  methods: {
    // init
    initData(){
      this.storeRentBill = Object.assign({},this.info)
      this.showEditStoreRentBillModal = true;
    },
     // 编辑商户月租金
    editStoreRentBill(){
      if(isNaN(this.storeRentBill.rent_fee*1)){
        this.$Notice.warning({
          title: '房租非数字！'
        })
        return
      }
      if(isNaN(this.storeRentBill.rent_overdue_fee*1)){
        this.$Notice.warning({
          title: '房租滞纳金非法！'
        })
        return
      }
      editStoreBillItem( this.storeRentBill ).then(res => {
        const dbody = res.data
        if(dbody.code != 0){
          this.$Notice.warning({
            title: dbody.msg,
          })
          return
        }
        this.$Notice.warning({
          title: "修改成功！",
        })
        this.initTable(this.storeRentBill.sreach)
      });
    },
  },
  mounted () {
    
  },
  beforeDestroy () {
    
  },
  watch: {
    info (newV, oldV) {
      this.storeRentBill = {}
      this.initData();
    },
  }
}
</script>
