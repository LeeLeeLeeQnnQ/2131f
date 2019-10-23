<template>
  <div>
    <Card shadow>
      <p slot="title">
        {{hTitle}}
      </p>
      <Collapse simple>
        <Panel v-for="item in paperList">
          {{ item.title }}
          <div slot="content">
            <Paper :subjects=item.subjects :number=item.number :opinion=item.opinion :pictures=item.pictures></Paper>
          </div>
        </Panel>
      </Collapse>
    </Card>
  </div>
</template>

<script>
//权限
// /api/Work/getWorkOptionList,/api/Work/show
import { getWorkOptionList, getWorkOptionDetail } from '@/api/standard'
import Paper from '_c/paper'
export default {
  name: 'kitchenNightInspectItem',
  components: {
    Paper
  },
  data () {
    return {
      paperList: [],
      paper: [],
      hTitle: ''
    }
  },
  methods: {
    // 清除空值
    trimNull (array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == '' || typeof (array[i]) === 'undefined') {
          array.splice(i, 1)
          i = i - 1
        }
      }
      return array.length > 0 ? array : null
    },
    // 获取paper
    getOnePaper (item, number) {
      let newObj = JSON.parse(JSON.stringify(this.paper))
      let num = number
      for (let i = 0, length = newObj.length; i < length; i++) {
        let option = JSON.parse(item.work_option)
        newObj[i].judge = option[i]
        newObj[i].content = newObj[i].title
        if (option[i] == 1) {
          num += newObj[i].score*1
        }
      }
      return { newObj, num }
    }
  },
  created () {
    // 获取id
    let type = this.$route.query.type
    let info = this.$store.state.user.store_paper;
    // 获取厨房列表
    getWorkOptionList( { type: type } ).then(res => {
      const dbody = res.data
      this.paper = dbody.data
      getWorkOptionDetail( { kitchen_id:info.kitchen_id , store_id:info.store_id , work_date:info.work_date , work_type : this.$route.query.work_type} ).then(res => {
        const info = res.data
        let that = this
        if (info.code != 0) {
          this.$Notice.warning({
            title: info.msg
          })
          // kitchen_total_inspect_list
          this.$router.go(-1)
          return
        }
        this.hTitle = info.data.work_date + ' / ' + info.data.store_no + ' / ' + info.data.store_name 
        let list = info.data.detail || []
        list.forEach(function (item, index) {
          let it = {}
          it.title = '第' + (index + 1) + '次检查 / ' + item.create_time + ' / ' + item.creator_name
          it.pictures = that.trimNull(item.images.split(','))
          let obj = that.getOnePaper(item, 0)
          it.subjects = obj.newObj
          it.number = obj.num + '分'
          it.opinion = item.remark
          that.paperList.push(it)
        })
      })
    })
  }
}
</script>

<style lang="less">

</style>
