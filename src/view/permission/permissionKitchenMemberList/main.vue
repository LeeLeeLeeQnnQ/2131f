<template>
  <div>
    <Card>
      <tables ref="tables" v-model="memberList" :columns="columns" @data-dele="handleDataDele" @data-edit="handleDataEdit"/>
      <Page :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 权限
// /api/Employee/index,/api/Employee/delete
import { getMemberList, deleMember } from '@/api/permission'
export default {
  name: 'permissionKitchenMemberList',
  components: {
    Tables
  },
  data () {
    return {
      sreach:{
        group_id:'7'
      },
      columns: [
        {title: 'ID', key: 'id', width: 80 },
        {title: '用户名', key: 'username'},
        {title: '姓名', key: 'fullname'},
        {title: '权限组', key: 'group_name'},
        {title: '厨房', key: 'kitchen_name', width: 200},
        { title: '性别',
          render: (h, params) => {
            let status = params.row.gender*1
            if (status == 1) { return h('span', '男') };
            if (status == 2) { return h('span', '女') };
          },
          width: 80
        },
        {title: '上次登录 ',
          render: (h, params) => {
            let time = params.row.login_time
            let now = new Date(time * 1000),
              y = now.getFullYear(),
              m = now.getMonth() + 1,
              d = now.getDate()
            let date = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.toTimeString().substr(0, 8)
            return h('span', date)
          },
          width: 150
        },
        {title: '备注', key: 'remark'},
        {
          title: '操作',
          key: 'handle',
          width :160,
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
      let obj = Object.assign(this.sreach,{page:page})
      getMemberList(obj).then(res => {
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
        name: 'permissionEditMember',
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
      deleMember(id).then(res => {
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
  mounted () {
    getMemberList(this.sreach).then(res => {
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
