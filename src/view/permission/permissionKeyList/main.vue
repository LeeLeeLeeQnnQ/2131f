<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable searchPlace="top" v-model="memberList" :columns="columns" @data-dele="handleDataDele" @data-edit="handleDataEdit"/>
    </Card>
    <Page :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// /api/EmployeeGroup/index,/api/EmployeeGroup/delete
import { getEmployeeGroup, deleEmployeeGroup } from '@/api/permission'
export default {
  name: 'permissionKeyList',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {title: '编号', key: 'id', width: 80 },
        {title: '角色组', key: 'group_name'},
        {title: '角色描述', key: 'describe'},
        {title: '创建时间', key: 'create_time'},
        {title: '更新时间', key: 'update_time'},
        {
          title: '操作',
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-edit', params)
                  }
                }},
              '编辑')
            },
            (h, params, vm) => {
              let cant = !!(params.row.id*1 == 8) || !!(params.row.id*1 == 7)
              if(cant){
                return
              }
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-dele', params)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {marginLeft: '8px'}
                }, '删除')
              ])
            }
          ]
        }
      ],
      memberList: [],
      page: {
        current_page: '',
        last_page: '',
        list_rows: 0,
        total: 0
      }
    }
  },
  methods: {
    // getNewPage
    getNewPage (page) {
      getEmployeeGroup(page).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.memberList = dbody.data.list
        this.page = dbody.data.page
      })
    },
    // 编辑
    handleDataEdit (params) {
      let id = params.row.id
      const route = {
        name: 'permissionEditKey',
        query: {
          id
        }
      }
      this.$router.push(route)
    },
    // 删除
    removeById (arr, id) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          arr.splice(i, 1)
        }
      }
      return arr
    },
    // 删除
    handleDataDele (params) {
      let id = params.row.id
      deleEmployeeGroup(id).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
        } else {
          this.$Notice.warning({
            title: '删除成功！'
          })
          this.memberList = this.removeById(this.memberList, id)
        }
      })
    }
  },
  created () {
    getEmployeeGroup().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }
      this.memberList = dbody.data.list
      this.page = dbody.data.page
    })
  },
  computed: {

  }
}
</script>

<style>

</style>
