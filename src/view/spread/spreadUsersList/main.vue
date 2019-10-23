<template>
  <div>
    <Card shadow style="margin-bottom: 5px">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col>
          <DatePicker type="daterange" placeholder="选择时间段" style="min-width: 200px" @on-change="selectDate"></DatePicker>
        </i-col>
        <i-col>
          <Select v-model="sreach.subscribe" placeholder="选择关注状态" style="width: 200px">
            <Option v-for="item in subscribeList" :value="item.id" :key="item.id">{{ item.status_name }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Input v-model="sreach.keyword" placeholder="请输入关键字"/>
        </i-col>
        <i-col>
          <Input v-model="sreach.qr_scene_str" placeholder="请输入渠道"/>
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
      <p slot="title">
          成员数量：{{total_num}}
      </p>
      <tables ref="tables" v-model="userList" :columns="columns" @on-sort-change="userSortTables"/>
      <Page :total="page.total" :page-size="page.list_rows" @on-change="getNewPage" style="margin-top:10px;"/>
    </Card>
  </div>
</template>
<script>
// 权限
// User/index
import Tables from '_c/tables'
import { getSpreadUserList  } from '@/api/spread'
export default {
  name: 'spreadUsersList',
  components: {
    Tables
  },
  data () {
    return {
      sort_data:{
        order:'',
        key:'',
      },
      // 用户u总数
      total_num:'',
      // 搜索
      sreach:{
        qr_scene_str:'',
        keyword:'',
        start_time:'',
        end_time:'',
        subscribe:''
      },
      columns: [
        {title: 'id', key: 'id', width: 80},
        {title: 'mini_openid', key: 'mini_openid'},
        {title: 'unionid', key: 'unionid'},
        {title: 'openid', key: 'openid'},
        {title: '昵称', key: 'nickname'},
        { title: '头像',
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
        {title: '渠道', key: 'qr_scene_str'},
        {title: '是否关注中', key: 'subscribe', sortable: 'custom' ,
          render: (h, params) => {
            let subscribe = params.row.subscribe*1
            if(subscribe == 0){
              return h('span', { style: {color: '#19be6b'}}, '未关注')
            }else if (subscribe == 1) {
              return h('span', { style: {color: '#2d8cf0'}}, '关注中')
            }
          }
        },
        {title: '关注时间', key: 'subscribe_time'},
        {title: '首次返现时间', key: 'first_time', width: 100},
        {title: '返现单数', key: 'order_total', width: 80},
        {title: '最后返现时间', key: 'last_time', width: 100},
      ],
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      userList: [],
      // 审批状态
      subscribeList:[
        {id:'', status_name:'全部'},
        {id:0, status_name:'未关注'},
        {id:1, status_name:'关注中'},
      ],
    }
  },
  methods: {
    // 导出
    exportTable(){
      let info =  Object.assign({},this.sreach)
      var str = '';
      for(let k in info){
        str += ( k + '=' + info[k] + "&");
      }
      str = str.substr(0, str.length - 1)
      const href = "./api/User/export?" + str;
      window.open(href, '_blank')
    },
    // 排序
    userSortTables(sort_data){
      if(sort_data.order == 'normal'){
        this.sort_data.order = '';
        this.sort_data.key = '';
      }else{
        this.sort_data.order = sort_data.order;
        this.sort_data.key = sort_data.key;
      }
      this.init({page:this.page.current_page})
    },
    // 搜索
    sreachKeyword(){
      this.init({});
    },
    // 选择时间
    selectDate(date){
      this.sreach.start_time = date[0]
      this.sreach.end_time = date[1]
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
    init(data){
      let td = this.sreach
      let sd = this.sort_data
      let obj = Object.assign(data,td,sd)
      getSpreadUserList(data).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.userList = dbody.data.list || [];
        this.page = dbody.data.page;
        this.total_num = dbody.data.page.total;
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
