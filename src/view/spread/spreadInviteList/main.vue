<template>
  <div>
    <Card shadow style="margin-bottom: 5px">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col>
          <DatePicker type="daterange" placeholder="选择时间段" style="min-width: 200px" @on-change="selectDate"></DatePicker>
        </i-col>
        <i-col>
          <Input v-model="sreach.user_id" placeholder="请输入邀请人ID"/>
        </i-col>
        <i-col>
          <Input v-model="sreach.invite_id" placeholder="请输入被邀请人ID"/>
        </i-col>
        <i-col>
          <Select v-model="sreach.is_pay" placeholder="选择返现状态" style="width: 200px">
            <Option v-for="item in payList" :value="item.is_pay" :key="item.is_pay">{{ item.status_name }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Button type="primary" @click="sreachKeyword">搜索</Button>
        </i-col>
        <i-col>
          <Button type="primary" @click="exportTable">导出表格</Button>
        </i-col>
      </Row>
    </Card>
    <!-- 厨房表格数据 -->
    <Card>
      <tables ref="tables" v-model="inviteList" :columns="columns"/>
      <Page :total="page.total" :page-size="page.list_rows" @on-change="getNewPage" style="margin-top:10px;"/>
    </Card>
  </div>
</template>
<script>
// 权限
// UserInvite/index
import Tables from '_c/tables'
import { getInviteUserList  } from '@/api/spread'
export default {
  name: 'spreadInviteList',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索
      sreach:{
        user_id:'',
        invite_id:'',
        start_date:'',
        end_date:'',
        is_pay:'',
      },
      columns: [
        {title: '邀请人ID', key: 'user_id', width:100},
        {title: '邀请人昵称', key: 'nickname'},
        { title: '邀请人头像',
          render: (h, params) => {
            let headimgurl = params.row.headimgurl
            return h('img', {
                  style: {
                      width: "55px",
                      verticalAlign: "middle"
                  },
                  attrs: {
                      src: headimgurl
                  }
              },)
            }
        },
        {title: '被邀请人ID', key: 'invite_id', width:100},
        {title: '被邀请人昵称', key: 'invite_nickname'},
        { title: '被邀请人头像',
          render: (h, params) => {
            let headimgurl = params.row.invite_headimgurl
            return h('img', {
                  style: {
                      width: "55px",
                      verticalAlign: "middle"
                  },
                  attrs: {
                      src: headimgurl
                  }
              },)
            }
        },
        {title: '是否返现', key: 'is_pay',
          render: (h, params) => {
            let is_pay = params.row.is_pay*1
            if(is_pay == 0){
              return h('span', { style: {color: '#19be6b'}}, '未返现')
            }else if (is_pay == 1) {
              return h('span', { style: {color: '#2d8cf0'}}, '已返现')
            }
          }
        },
        { title: '返现时间', key: 'pay_time'},
      ],
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      inviteList: [],
      // 审批状态
      payList:[
        {is_pay:'', status_name:'全部'},
        {is_pay:0, status_name:'未返现'},
        {is_pay:1, status_name:'已返现'},
      ],
    }
  },
  methods: {
    // 搜索
    sreachKeyword(){
      this.init({});
    },
    // 选择时间
    selectDate(date){
      this.sreach.start_date = date[0]
      this.sreach.end_date = date[1]
    },
    // 图片预览
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    // 选择新页面
    getNewPage(page){
      this.init({page:page})
    },
    // 导出
    exportTable(){
      let info =  Object.assign({},this.sreach)
      var str = '';
      for(let k in info){
        str += ( k + '=' + info[k] + "&");
      }
      str = str.substr(0, str.length - 1)
      const href = "./api/UserInvite/export?" + str;
      window.open(href, '_blank')
    },
    init(data){
      let td = this.sreach
      let obj = Object.assign(data,td)
      getInviteUserList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.inviteList = dbody.data.list || [];
        this.page = dbody.data.page;
      })
    }
  },
  mounted () {
    this.init({});
  },
  computed: {

  }
}
</script>

<style scoped>
  .img-upload-list{
      display: inline-block;
      width: 60px;
      min-height: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 4px;
  }
  .img-upload-list img{
      width: 100%;
      height: 100%;
  }
  .img-upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .img-upload-list:hover .img-upload-list-cover{
      display: block;
  }
  .img-upload-list-cover i{
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
  }
</style>
