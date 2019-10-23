<template>
  <div>
    <div>
      <Card shadow>
        <Row :gutter="20">
          <i-col :xs="5" :md="5" :lg="5">
            <DatePicker type="datetimerange" format="yyyy-MM-dd" placeholder="选择日期" @on-change="getNewDate" style="width:100%;"></DatePicker>
          </i-col>
        </Row>
      </Card>
    </div>
    <Card style="margin-top: 5px;">
      <Modal v-model="showEditStatus" title="修改状态" @on-ok="saveEditStatus" :mask-closable="false">
        <Form :model="editStatus" :label-width="80">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="20">
              <FormItem label="意向">
                  <i-switch v-model="editStatus.status" size="large">
                      <span slot="open">有</span>
                      <span slot="close">无</span>
                  </i-switch>
              </FormItem>
            </i-col>
            <i-col span="20" >
              <FormItem label="备注">
                <Input v-model="editStatus.remark" type="textarea" :rows="6" :autosize="{minRows: 5,maxRows: 5}" placeholder="备注" />
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </Modal>
      <tables ref="tables" v-model="book_list" :columns="columns" @data-edit="showEditStatusModal"/>
      <Page :total="page.total" :page-size="page.list_rows" style="margin-top:10px;" @on-change="getNewPage"/>
    </Card>
  </div>
</template>

<script>
import { getWebBookList , changWebBookStatus } from '@/api/canvass'
import Tables from '_c/tables'
// 权限
// Reserve/index,Reserve/edit
export default {
  name: 'canvassWebBook',
  components: {
    Tables
  },
  data () {
    return {
      // 也属 数据
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      columns: [
        {title: '客户姓名', key: 'customer_name'},
        {title: '联系方式', key: 'contact'},
        {title: '预约场地', key: 'kitchen_name'},
        {title: '预约时间', key: 'create_time'},
        {title: '客户留言', key: 'message'},
        { title: '意向',
          render: (h, params) => {
            let status = params.row.idea
            if(status == 1){
              return h('span', { style: {color: '#19be6b'}}, '有意向')
            }else if (status == 2) {
              return h('span', { style: {color: '#2d8cf0'}}, '无意向')
            }
          }
        },
        {title: '备注', key: 'remark'},
        {
          title: '操作',
          key: 'handle',
          button: [
            // 不带气泡 一层嵌套
            (h, params, vm) => {
              return h('Button', {
                style: {margin: '0'},
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    vm.$emit('data-edit', params)
                  }
                }},
              '更改状态')
            },
          ]
        },
      ],
      book_list:[],
      // 编辑状态
      showEditStatus:false,
      editStatus:{},
      // 搜索条件
      start_time:'',
      end_time:"",
    }
  },
  methods: {
    showEditStatusModal( params ){
      let id = params.row.id;
      this.editStatus.id = id;
      this.showEditStatus = true;
    },
    saveEditStatus(){
      let info = {};
      info.idea = !!this.editStatus.status ? "1" : "2";
      info.remark = this.editStatus.remark ;
      info.id = this.editStatus.id ;
      changWebBookStatus( info ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 初始化函数
        let obj = {
          start_time:this.start_time,
          end_time:this.end_time,
          page:this.page.current_page
        };
        this.initData(obj);
      })
    },
    getNewDate(date_arr){
      this.start_time = date_arr[0];
      this.end_time = date_arr[1];
      let obj = {
        start_time:this.start_time,
        end_time:this.end_time,
      };
      this.initData( obj );
    },
    getNewPage(page){
      let obj = {
        start_time:this.start_time,
        end_time:this.end_time,
        page : page
      };
     this.initData( obj );
    },
    initData( info ){
    // 搜索操作
      getWebBookList( info ).then(res => {
        const dbody = res.data
        this.page = dbody.data.page;
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 初始化函数
        this.book_list = dbody.data.list || [];
      })
    },
  },
  created () {
    let obj = {
      start_time:this.start_time,
      end_time:this.end_time,
    };
    this.initData(obj);
  },
}
</script>

<style>

</style>
