<template>
  <div ref="dom" class="charts chart-column"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartColumn',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    this.$nextTick(() => {
      let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let option = {
        title: {
          text: this.text,
          // subtext: this.subtext,
          x: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxisData
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  },
  watch: {
    // value (newName, oldName) {
    //   let xAxisData = Object.keys(newName)
    //   let seriesData = Object.values(newName)
    //   let option = {
    //     title: {
    //       text: this.text,
    //       // subtext: this.subtext,
    //       x: 'center'
    //     },
    //     xAxis: {
    //       type: 'category',
    //       data: xAxisData
    //     },
    //     yAxis: {
    //       type: 'value'
    //     },
    //     series: [
    //       {
    //         data: seriesData,
    //         type: 'line',
    //         label: {
    //             normal: {
    //                 show: true,
    //                 position: 'top'
    //             }
    //         },
    //         // areaStyle: {normal: {}},
    //       }
    //     ]
    //   }
    //   this.dom = echarts.init(this.$refs.dom, 'tdTheme')
    //   this.dom.setOption(option)
    //   on(window, 'resize', this.resize)
    // }
  }
}
</script>
