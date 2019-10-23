<template>
  <div style="display: none;">
    <PrintEnergy id="printEnergy" :print_info="print_energy_info"></PrintEnergy>
  </div>
</template>

<script>
  import printJS from 'print-js'
  import PrintEnergy from '_c/print-energy'
  export default {
    name: 'FSBPrintEnergy',
    components: {
      PrintEnergy
    },
    props: {
      
    },
    data () {
      return {
        // 打印经营费用数据
        print_energy_info:{},
        print_energy_str:"@page{size:A4;margin:0}@media print{*{font-size:9pt;font-family:'宋体'}.page{margin:0;border:initial;border-radius:initial;width:initial;min-height:initial;box-shadow:initial;background:initial;page-break-after:always}}.page{box-sizing:border-box;padding:22px;padding-top:20px}.page h4{text-align:center;margin-bottom:5px;font-size:22px}.page_head{width:100%;overflow:hidden;line-height:.9em}.page_head_left,.page_head_right{display:inline-block;width:50%;float:left}.table_box table{width:100%;border-spacing:0;border-collapse:collapse;border:1px solid gray;margin-top:5px}.table_box table th{border:1px solid gray;padding:3px}.table_box table td{border-left:1px solid gray;padding:3px;box-sizing:border-box}.table_box table .total_tr td{border:0;border-top:1px solid gray;padding:3px;box-sizing:border-box}.table_box table .total_tr .total_td{border-left:1px solid gray;padding:3px;box-sizing:border-box}.table_box table .last_tr{border-top:1px solid gray}.page_footer{padding:5px;line-height:.9em}.page_footer .zhanghao{overflow:hidden;margin-bottom:10px}.page_footer .zhanghao>div{display:inline-block;float:left}.page_footer .zhanghao .line_box{float:right;margin-right:100px;text-align:center}.page_footer .zhanghao .line_box .line{width:240px;height:14px;border-bottom:1px solid #000;margin-bottom:5px}.page_footer .contect p{margin-top:8px;width:50%;display:inline-block}",
      }
    },
    methods: {
      // init
      print(data){
        this.print_energy_info = data;
        setTimeout(()=>{
          printJS({
            printable: 'printEnergy',
            documentTitle: '橘猫精选',
            type: 'html',
            targetStyle: ['*'],
            maxWidth: 1200,
            gridStyle:'border: 1px solid lightgray; margin-bottom: -1px;',
            style: this.print_energy_str,
          })
        },500)
      },
    },
    mounted () {
      
    },
    beforeDestroy () {
      
    },
    watch: {
      
    }
  }
</script>
