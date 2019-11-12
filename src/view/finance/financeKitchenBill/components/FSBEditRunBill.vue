<template>
  <div>
    <Modal 
      v-model="paymentModal" 
      scrollable 
      @on-ok="editStoreRunBill" 
      width="900"
      :mask-closable="false">
      <Form ref="paymentForm" :model="paymentItem">
        <Card style="border:1px solid #2db7f5;">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="12">
              <FormItem label="店铺名称">
                  <span>{{paymentItem.store_name}}</span>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="档口编号">
                  <span>{{paymentItem.store_no}}</span>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="8">
              <FormItem label="账单月份">
                  <span>{{paymentItem.month}}</span>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="厨房名称">
                  <span>{{paymentItem.kitchen_name}}</span>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="公摊天数">
                  <span>{{paymentItem.day_number}}</span>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="8">
              <FormItem label="店铺收费基数">
                  <span>{{paymentItem.base_number}}</span>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="8">
              <FormItem label="本月公摊开始日期">
                  <span>{{paymentItem.share_start_date}}</span>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="本月公摊结束日期">
                  <span>{{paymentItem.share_end_date}}</span>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="24">
              <FormItem>
                <Button type="primary" @click="goKitchenShopEdit2">编辑店铺信息</Button>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="24">
              <FormItem>
                <Alert type="warning">修改店铺公摊开始日期与结束日期会影响本月账单公摊！修改完毕后请刷新页面！</Alert>
              </FormItem>
            </i-col>
          </Row>
        </Card>
        <Card style="border:1px solid #2db7f5;margin-top: 5px;" title="周期性费用">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="4">
              <FormItem label="垃圾及隔油池">
                  <span>{{paymentItem.garbage_fee}}</span>
              </FormItem>
            </i-col>
            <i-col span="4">
              <FormItem label="烟道清洗">
                  <span>{{paymentItem.flue_fee}}</span>
              </FormItem>
            </i-col>
            <i-col span="4">
              <FormItem label="消杀">
                  <span>{{paymentItem.kill_fee}}</span>
              </FormItem>
            </i-col>
            <i-col span="4">
              <FormItem label="网络使用费">
                  <span>{{paymentItem.network_fee}}</span>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="4">
              <FormItem label="库房费">
                <span>{{paymentItem.storage_fee}}</span>
              </FormItem>
            </i-col>
            <i-col span="4">
              <FormItem label="卫生费">
                <span>{{paymentItem.health_fee}}</span>
              </FormItem>
            </i-col>
          </Row>
        </Card>
        <Row type="flex" justify="start" align="middle" :gutter="20">
          <i-col span="12">
            <Card style="border:1px solid #2db7f5;margin-top: 5px;" title="电费">
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="24">
                  <FormItem label="公摊电费" style="width: 100%'">
                    <span>{{paymentItem.energy_share_fee}}</span>
                  </FormItem>
                </i-col>
              </Row>
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="8">
                  <FormItem label="商户电费">
                    <span>{{paymentItem.energy_fee}}</span>
                  </FormItem>
                </i-col>
                <i-col span="8">
                  <FormItem label="电表起始值">
                    <span>{{paymentItem.energy_start}}</span>
                  </FormItem>
                </i-col>
                <i-col span="8">
                  <FormItem label="电表结束值">
                    <span>{{paymentItem.energy_end}}</span>
                  </FormItem>
                </i-col>
              </Row>
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="24">
                  <FormItem label="电表倍率">
                    <span>{{paymentItem.energy_multiple}}</span>
                  </FormItem>
                </i-col>
              </Row>
            </Card>
          </i-col>
          <i-col span="12">
            <Card style="border:1px solid #2db7f5;margin-top: 5px;" title="水费">
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="24">
                  <FormItem label="公摊水费">
                    <span>{{paymentItem.water_share_fee}}</span>
                  </FormItem>
                </i-col>
              </Row>
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="8">
                  <FormItem label="商户水费">
                    <span>{{paymentItem.water_fee}}</span>
                  </FormItem>
                </i-col>
                <i-col span="8">
                  <FormItem label="水表起始值">
                    <span>{{paymentItem.water_start}}</span>
                  </FormItem>
                </i-col>
                <i-col span="8">
                  <FormItem label="水表结束值">
                    <span>{{paymentItem.water_end}}</span>
                  </FormItem>
                </i-col>
              </Row>
              <Row type="flex" justify="start" align="middle" :gutter="20">
                <i-col span="24">
                  <FormItem label="水表倍率">
                    <span>{{paymentItem.water_multiple}}</span>
                  </FormItem>
                </i-col>
              </Row>
            </Card>
          </i-col>
          <i-col span="24" style="margin-top: 10px;">
            <FormItem>
              <Button type="primary" @click="goKitchenRecord">修改抄表信息</Button>
            </FormItem>
          </i-col>
          <i-col span="24">
            <FormItem>
              <Alert type="warning">修改抄表信息会影响本月账单公摊！修改完毕后请刷新页面！</Alert>
            </FormItem>
          </i-col>
        </Row>
        <Card style="border:1px solid #2db7f5;margin-top: 5px;" title="其他">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="8">
              <FormItem label="工程增项">
                  <Input v-model="paymentItem.project_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="罚款">
                  <Input v-model="paymentItem.fine_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="一次性费用">
                  <Input v-model="paymentItem.one_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="8">
              <FormItem label="滞纳金">
                <Input v-model="paymentItem.operate_overdue_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="代运营费">
                <Input v-model="paymentItem.operating_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="服务费">
                  <Input v-model="paymentItem.taxes_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="8">
              <FormItem label="物业管理费">
                  <Input v-model="paymentItem.manage_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="其他费用">
                  <Input v-model="paymentItem.other_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
            <i-col span="8">
              <FormItem label="经营费用减免">
                  <Input v-model="paymentItem.operate_exempt_fee" @on-change="updateComputedPaper"></Input>
              </FormItem>
            </i-col>
          </Row>
        </Card>
         <Card style="border:1px solid #2db7f5;margin-top: 5px;" title="备注">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="20">
              <FormItem label="备注">
                <Input v-model="paymentItem.remark" type="textarea" :rows="4" placeholder="备注" />
              </FormItem>
            </i-col>
          </Row>
        </Card>
        <Card style="margin-top: 5px;">
          <h3>总计：{{paymentItem.total}}</h3>
        </Card>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {  editStoreBillItem } from '@/api/kitchen'
export default {
  name: 'FSBEditRunBill',
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
      paymentItem:{},
      paymentModal:false,
    }
  },
  methods: {
    // init
    initData(){
      this.showInfo = Object.assign({},this.info.showInfo)
      this.paymentItem = Object.assign({},this.info)
      this.paymentModal = true;
    },
    editStoreRunBill(params){
      delete this.paymentItem.create_time
      delete this.paymentItem.operate_fee
      delete this.paymentItem.rent_fee
      delete this.paymentItem.rent_overdue_fee
      delete this.paymentItem.update_time
      editStoreBillItem( this.paymentItem ).then(res => {
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
        this.initTable(this.paymentItem.sreach)
      });
    },
    // 计算激活
    updateComputedPaper(){
      this.paymentModal = false;
      this.computedPaper( this.paymentItem )
    },
    // 计算总额
    computedPaper( info ){
      let base_number = info.base_number*1 ;
      let day_number = info.day_number*1 ;
      // let year = this.select_time.split('-')[0];
      // let month = this.select_time.split('-')[1];
      let days = 30;
      // garbage_fee 垃圾及隔油池
      // info.garbage_fee = (day_number*1 / days * base_number * this.showInfo.garbage_fee*1).toFixed(2);
      // water_start 水费差
      if( (isNaN(info.water_start) || info.water_start<0 ) || (isNaN(info.water_end) || info.water_end<0) ){
        info.water_fee = 0.00
      }else{
        if(info.water_start*1 > info.water_end*1){
          info.water_fee = 0.00
        }else{
          info.water_value = (info.water_end*1 - info.water_start*1).toFixed(2);
          info.water_fee = (info.water_value*1 * base_number * this.showInfo.water_fee*1 * info.water_multiple).toFixed(2);
        }
      }
      // energy_start 电费差
      if((isNaN(info.energy_start) || info.energy_start<0) || (isNaN(info.energy_end) || info.energy_end<0) ){
        info.energy_fee = 0.00
      }else{
        if(info.energy_start*1 > info.energy_end*1){
          info.energy_fee = 0.00
        }else{
          info.energy_value = (info.energy_end*1 - info.energy_start*1).toFixed(2);
          info.energy_fee = (info.energy_value*1 * base_number * this.showInfo.energy_fee*1 * info.energy_multiple).toFixed(2);
        }
      }
      // flue_fee 烟道清洗
      // info.flue_fee = (day_number*1 / days * base_number * this.showInfo.flue_fee*1).toFixed(2)
      // kill_fee 消杀
      // info.kill_fee = (day_number*1 / days * base_number * this.showInfo.kill_fee*1).toFixed(2)
      // network_fee 网络使用费
      // info.network_fee = (day_number*1 / days * base_number * this.showInfo.network_fee*1).toFixed(2);
      // storage_fee 库房费
      // info.storage_fee = (day_number*1 / days * base_number * this.showInfo.storage_fee*1).toFixed(2);
      //  health_fee 卫生费
      // info.health_fee = (day_number*1 / days * base_number * this.showInfo.health_fee*1).toFixed(2);

      // 总计
      info.total = '';
      info.total = this.getPayItemTotal(info);
      this.paymentModal = true;
    },
    // total
    getPayItemTotal( info ){
      let total = 0;
      total = info.garbage_fee*1 + total;
      total = info.water_fee*1 + total;
      total = info.energy_fee*1 + total;
      total = info.water_share_fee*1 + total;
      total = info.energy_share_fee*1 + total;
      total = info.flue_fee*1 + total;
      total = info.kill_fee*1 + total;
      total = info.network_fee*1 + total;
      total = info.storage_fee*1 + total;
      total = info.health_fee*1 + total;
      total = info.fine_fee*1 + total;
      total = info.one_fee*1 + total;
      total = info.other_fee*1 + total;
      total = info.operating_fee*1 + total;
      total = info.project_fee*1 + total;
      total = info.taxes_fee*1 + total;
      total = info.operate_overdue_fee*1 + total;
      total = total - info.operate_exempt_fee*1;
      return total.toFixed(2);
    },
    // 跳转商户编辑
    goKitchenShopEdit2(){
      let id = this.paymentItem.store_id;
      let kitchen_id = this.paymentItem.kitchen_id;
      const href = "./kitchenShopEditB?id="+ id +"&kitchen_id="+ kitchen_id +"&tabValue=2";
      window.open(href, '_blank')
    },
    // 跳转抄表界面
    goKitchenRecord(){
      const href = "./kitchenStoreRecord";
      window.open(href, '_blank')
    },
  },
  mounted () {

  },
  beforeDestroy () {
    
  },
  watch: {
    info (newV, oldV) {
      this.paymentItem = {}
      this.initData();
    },
  }
}
</script>
