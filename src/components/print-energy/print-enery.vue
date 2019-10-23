<template>
  <div class="page">
    <h4>商户经营费用明细通知单</h4>
    <div class="page_head">
      <div class="page_head_left">
          <p><span>发单日期：</span> {{print_info.currentdate}}</p>
      </div>
      <div class="page_head_right">
          <p><span>所属店面：</span> {{print_info.kitchen_name}}</p>
          <p><span>承租档口号：</span> {{print_info.store_no}}</p>
          <p><span>业主/客户户名称：</span> {{print_info.store_name}}</p>
      </div>
    </div>
    <div class="table_box">
        <table>
          <thead>
              <tr align="left">
                <th>费用明细项目</th>
                <th>期初读数</th>
                <th>期末读数</th>
                <th>消耗量</th>
                <th>单价</th>
                <th>金额（元）</th>
              </tr>
          </thead>
          <tbody>
              <tr align="left">
                <td>电费</td>
                <td>{{ print_info.energy_start}}</td>
                <td>{{ print_info.energy_end}}</td>
                <td>{{ print_info.energy_value}}</td>
                <td>{{ print_info.energy_fee}}</td>
                <td>{{ print_info.energy_computer_fee}}</td>
              </tr>
              <tr align="left">
                <td>水费</td>
                <td>{{ print_info.water_start}}</td>
                <td>{{ print_info.water_end}}</td>
                <td>{{ print_info.water_value}}</td>
                <td>{{ print_info.water_fee}}</td>
                <td>{{ print_info.water_computer_fee}}</td>
              </tr>
              <tr align="left">
                <td>公共区域（分摊后）</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr align="left">
                <td>   --电费</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.energy_share_fee}}</td>
              </tr>
              <tr align="left">
                <td>   --水费</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.water_share_fee}}</td>
              </tr>
              <tr align="left">
                <td>网络使用费</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.network_fee}}</td>
              </tr>
              <tr align="left">
                <td>隔油池清理、垃圾排污管道</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.garbage_fee}}</td>
              </tr>
              <tr align="left">
                <td>烟道清洗</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.flue_fee}}</td>
              </tr>
              <tr align="left">
                <td>消杀</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.kill_fee}}</td>
              </tr>
              <tr align="left">
                <td>工程增项</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.project_fee}}</td>
              </tr>
              <tr align="left">
                <td>罚款</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.fine_fee}}</td>
              </tr>
              <tr align="left">
                <td>库房使用费</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.storage_fee}}</td>
              </tr>
              <tr align="left">
                <td>物业管理费</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>0.00</td>
              </tr>
              <tr align="left">
                <td>卫生费</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.health_fee}}</td>
              </tr>
              <tr align="left">
                <td>堂食耗材</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ print_info.one_fee}}</td>
              </tr>
              <tr align="left">
                <td>代收税费</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{print_info.taxes_fee}}</td>
              </tr>
              <tr align="left">
                <td>代运营费</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{print_info.operating_fee}}</td>
              </tr>
              <tr align="left">
                <td>其他费用</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{print_info.operating_fee}}</td>
              </tr>
              <tr align="left">
                <td>经营费用减免</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{print_info.operate_exempt_fee}}</td>
              </tr>
              <tr align="left" class="last_tr">
                <td>合计缴款</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{print_info.total_fee}}</td>
              </tr>
          </tbody>
        </table>
    </div>
    <p>备注：{{print_info.remark}}</p>
    <div class="page_footer">
        <p>请以下列形式付款：</p>
        <p>汇款至下列账户：</p>
        <p>账户名称：{{print_info.card_name}}</p>
        <p>开户银行：{{print_info.card_bank}}</p>
        <div class="zhanghao">
            <div>银行帐号：{{print_info.card_no}}</div>
            <div class="line_box">
                <p class="line"></p>
                <p>{{print_info.company}}</p>
            </div>
        </div>
        <div class="remark">
          <p>备注：</p>
          <p>1.转账交款时，请您在备注信息内写明所属店面和您的品牌名称。</p>
          <p>2.公共区水电费：费用包括公共照明、空调、排风、回风、水。</p>
          <p>3.管理费：本月店内员工的人员成本。</p>
          <p>4.推广费：活动期间为X个品牌提供的推广费用。（费用明细已另行提供给各参与商户）</p>
          <p>5.代收税款：为代收代缴店面管理公司税款，不在我公司物业费收费范围内，不予开具发票（含在收据内）</p>
          <p>6.我方于每月{{print_info.operate_day}}日发送您收款单，如需查询，请联系店面经理</p>
          <p>7.请您对收款单确认并签收、次月1日起，按照每日1%利息收取滞纳金，逾期10日进行断电处理</p>
          <div class="contect">
              <p>地址：</p>
              <p>电话：</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'print-energy',
  props: {
    print_info: {
      type:Object,
      default: {}
    },
  },
  data () {
    return {
    }
  },
  watch: {
    print_info (newInfo, oldInfo) {
      newInfo.currentdate = this.getCurentTime();
      this.formValue(newInfo);
      this.print_info = newInfo;
      console.log(this.print_info)
    }
  },
  methods: {
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
    formValue(info){
      info.currentdate = this.getCurentTime();
      info.energy_value = (info.energy_end*1 - info.energy_start*1 ).toFixed(2);
      info.water_value = (info.water_end*1 - info.water_start*1 ).toFixed(2);
    },
  },
  created () {
    this.formValue(this.print_info);
  },
}
</script>

<style>
    @page {
        size: A4;
        margin: 0;
    }
    @media print {
        *{
            font-size: 9pt;
            font-family: "宋体"
        }
        .page {
            margin: 0;
            border: initial;
            border-radius: initial;
            width: initial;
            min-height: initial;
            box-shadow: initial;
            background: initial;
            page-break-after: always;
        }
    }
    .page{
        box-sizing: border-box;
        padding: 22px;
        padding-top: 85px;
    }
    .page h4{
        text-align: center;
        margin-bottom: 5px;
        font-size: 22px;
    }
    .page_head{
        width: 100%;
        overflow:hidden;
        line-height: 0.9em;
    }
    .page_head_left,.page_head_right{
        display: inline-block;
        width: 50%;
        float: left;
    }

    .table_box table{
        width: 100%;
        border-spacing: 0px;
        border-collapse: collapse;
        border: 1px solid gray;
        margin-top: 5px;
    }
    .table_box table th{
        border: 1px solid gray;
        padding: 3px;
    }
    .table_box table tr{
        /*border: 1px solid gray;*/
    }
    .table_box table td{
        border-left: 1px solid gray;
        padding: 3px;
        box-sizing: border-box;
    }
    .table_box table .total_tr td{
        border:none;
        border-top: 1px solid gray;
        padding: 3px;
        box-sizing: border-box;
    }
    .table_box table .total_tr .total_td{
        border-left: 1px solid gray;
        padding: 3px;
        box-sizing: border-box;
    }
    .table_box table .last_tr{
        border-top: 1px solid gray;
    }
    .page_footer{
        padding: 5px;
        line-height: 0.9em;
    }
    .page_footer .zhanghao{
        overflow: hidden;
        margin-bottom: 10px;
    }
    .page_footer .zhanghao>div{
        display: inline-block;
        float: left;
    }
    .page_footer .zhanghao .line_box{
        float: right;
        margin-right: 100px;
        text-align: center;
    }
    .page_footer .zhanghao .line_box .line{
        width:240px;
        height: 14px;
        border-bottom: 1px solid #000;
        margin-bottom: 5px;
    }
    .page_footer  .contect p{
        margin-top:8px; 
        width: 50%;
        display: inline-block;
    }
</style>
