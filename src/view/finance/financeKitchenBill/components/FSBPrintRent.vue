<template>
  <div style="display: none;">
    <PrintRent id="printRent" :print_info="print_rent_info"></PrintRent>
  </div>
</template>

<script>
  import printJS from 'print-js'
  import PrintRent from '_c/print-rent'
  export default {
    name: 'FSBPrintRent',
    components: {
      PrintRent
    },
    props: {
      
    },
    data () {
      return {
        print_rent_info:{},
        print_rent_str:"@page{size:A4;margin:0}@media print{*{font-size:10pt;font-family:'宋体'}.page{margin:0;border:initial;border-radius:initial;width:initial;min-height:initial;box-shadow:initial;background:initial;page-break-after:always}}.ti2{text-indent:2em}.page{box-sizing:border-box;padding: 70px 110px 50px;}.page h4{text-align:center;margin-bottom:5px;font-size:22px}.page_head{width:100%;overflow:hidden;line-height:12pt}.page_main .page_main_item{text-indent:2em;display:flex;justify-content:flex-start;align-items:center;height:2.5em}.page_main .page_main_item span{width:170px}.page_main .page_main_item i{font-style:normal;font-weight:400}.page_main .page_main_item p{border-bottom:1px solid #000;text-align:center;text-indent:0;padding-bottom:2px;width:300px;height:1.25em;}.page_footer{padding:5px;line-height:.9em}.page_footer_top{text-indent:2em;line-height:12pt;margin:2em 0}.page_footer_main{line-height:15pt;margin:2em 0}.page_footer_bottom{line-height:15pt;text-align:right}",
      }
    },
    methods: {
      // init
      print(data){
        this.print_rent_info = data;
        setTimeout((data)=>{
          printJS({
            printable: 'printRent',
            documentTitle: '橘猫精选',
            type: 'html',
            targetStyle: ['*'],
            maxWidth: 1200,
            gridStyle:'border: 1px solid lightgray; margin-bottom: -1px;',
            style: this.print_rent_str,
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
