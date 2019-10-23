<template>
  <div>
    <!-- 头部搜索 按钮 -->
    <Card shadow style="margin-top: 5px">
      <Row type="flex" justify="start" align="middle" :gutter="20">
        <i-col>
          <Input v-model="userPhone" placeholder="输入客户联系方式" style="width: 200px"></Input>
        </i-col>
        <i-col>
          <DatePicker type="daterange" placeholder="选择时间段" style="min-width: 200px" @on-change="selectDate"></DatePicker>
        </i-col>
        <i-col>
          <Select v-model="sources" clearable placeholder="选择渠道来源" style="width: 200px">
            <Option v-for="(item,index) in sources_list" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Select
            v-model="employee_id"
            filterable
            remote
            :remote-method="remoteLeaseMethod"
            :loading="remoteLoading"
            clearable
            placeholder="选择招商经理"
            style="width: 200px"
            >
            <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20" style="margin-top: 10px;">
        <i-col>
          <Select v-model="kitchen_id" clearable style="width: 200px" placeholder="选择带看场地">
            <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Select v-model="consider" clearable placeholder="选择未成交因素" style="width: 200px">
            <Option v-for="(item,index) in considers_list" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Select v-model="category" clearable style="width: 200px"  placeholder="选择意向品类">
            <Option v-for="(item,index) in category_list" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Select v-model="level" clearable style="width: 200px" placeholder="选择意向程度">
            <Option v-for="(item,index) in head_list" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20" style="margin-top: 10px;">
        <i-col>
          <Select v-model="group_name" clearable style="width: 200px" placeholder="选择团队">
            <Option v-for="(item,index) in group_list" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </i-col>
        <i-col>
          <Input v-model="start_area" placeholder="开始面积" style="width: 95px;display: inline-block;"/>
          <Input v-model="end_area" placeholder="结束面积" style="width: 95px;display: inline-block;margin-left: 10px;"/>
        </i-col>
        <i-col>
          <Input v-model="start_count" placeholder="开始次数" style="width: 95px;display: inline-block;"/>
          <Input v-model="end_count" placeholder="结束次数" style="width: 95px;display: inline-block;margin-left: 10px;"/>
        </i-col>
      </Row>
      <Row type="flex" justify="start" align="middle" :gutter="20" style="margin-top: 10px;">
        <i-col>
          <Button type="primary" @click="sreachPhone">搜索</Button>
        </i-col>
        <i-col>
          <Button type="primary" @click="addViewItem">增加带看信息</Button>
        </i-col>
        <i-col>
          <Button type="primary" @click="exportTable">导出表格</Button>
        </i-col>
      </Row>
    </Card>
    <Card style="margin-top:5px;min-height: 220px;">
      <tables :columns="view_columns"
        v-model="view_list"
        @data-build="handlePreBuild"
        @data-edit="handleEdit"
        @data-dele="handleDele">
      </tables>
      <Page :total="page.total" :page-size="page.list_rows" @on-change="getNewPage" style="margin-top:10px;"/>
      <Modal v-model="showNewAddModal" title="添加带看信息" @on-ok="saveNewAddModalInfo" :mask-closable="false" width="64%;">
        <Form :model="addModal" :label-width="80">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="客户手机">
                <Input v-model="addModal.contact" style="width: 200px" readonly></Input>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="客户姓名">
                <Input v-model="addModal.customer_name" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="招商经理">
                <Select
                  v-model="addModal.employee_id"
                  filterable
                  remote
                  :remote-method="remoteLeaseMethod"
                  :loading="remoteLoading"
                  clearable
                  placeholder="选择招商经理"
                  @on-change="selectAddManageLease"
                  style="width: 200px"
                  >
                  <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="所属组">
                <Select v-model="addModal.group_name" style="width: 200px">
                  <Option v-for="(item,index) in group_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="带看次数">
                <Input v-model="addModal.total_count" readonly style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="带看时间">
                <DatePicker :value="addModal.clue_date" format="yyyy-MM-dd" type="date" placeholder="带看时间" style="width: 200px" @on-change="changeAddModalClueDate"></DatePicker>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="场地">
                <Select v-model="addModal.kitchen_id" @on-change="selectAddKitchen" style="width: 200px">
                  <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="渠道来源">
                <Select v-model="addModal.source" style="width: 200px">
                  <Option v-for="(item,index) in sources_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="未成交因素">
                <Select v-model="addModal.consider" style="width: 200px">
                  <Option v-for="(item,index) in considers_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="意向面积">
                <Input v-model="addModal.area" placeholder="输入意向面积" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="意向品类">
                <Select v-model="addModal.category" style="width: 200px">
                  <Option v-for="(item,index) in category_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="意向程度">
                <Select v-model="addModal.level" style="width: 200px">
                  <Option v-for="(item,index) in head_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="22">
              <FormItem label="留言备注">
                <Input v-model="addModal.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </Modal>
      <Modal v-model="showOldAddModal" title="增加带看信息"  @on-ok="saveNewAddModalInfo" :mask-closable="false" width="64%;">
        <Form :model="addModal" :label-width="80">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="客户手机">
                <Input v-model="addModal.contact" style="width: 200px" readonly></Input>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="客户姓名">
                <Input v-model="addModal.customer_name" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10" v-if="hasEmployee">
              <FormItem label="招商经理">
                <Select
                  v-model="addModal.employee_id"
                  filterable
                  remote
                  :remote-method="remoteLeaseMethod"
                  :loading="remoteLoading"
                  clearable
                  style="width: 200px"
                  @on-change="selectAddManageLease"
                  >
                  <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" v-else>
              <FormItem label="招商经理">
                <Input v-model="addModal.fullname" disabled style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="所属组">
                <Select v-model="addModal.group_name" style="width: 200px">
                  <Option v-for="(item,index) in group_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="带看次数">
                <Input v-model="addModal.total_count" readonly style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="带看时间">
                <DatePicker :value="addModal.clue_date" format="yyyy-MM-dd" type="date" placeholder="带看时间" style="width: 200px" @on-change="changeAddModalClueDate"></DatePicker>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="场地">
                <Select v-model="addModal.kitchen_id" @on-change="selectAddKitchen" style="width: 200px">
                  <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="渠道来源">
                <Select v-model="addModal.source" style="width: 200px">
                  <Option v-for="(item,index) in sources_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="未成交因素">
                <Select v-model="addModal.consider" style="width: 200px">
                  <Option v-for="(item,index) in considers_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="意向面积">
                <Input v-model="addModal.area" placeholder="输入意向面积" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="意向品类">
                <Select v-model="addModal.category" style="width: 200px">
                  <Option v-for="(item,index) in category_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="意向程度">
                <Select v-model="addModal.level" style="width: 200px">
                  <Option v-for="(item,index) in head_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="22">
              <FormItem label="留言备注">
                <Input v-model="addModal.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </Modal>
      <Modal v-model="showEditModal" title="编辑带看信息"  @on-ok="saveEditModalInfo" :mask-closable="false" width="64%;">
        <Form :model="editModal" :label-width="80">
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="客户手机">
                <Input v-model="editModal.contact" style="width: 200px" readonly></Input>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="客户姓名">
                <Input v-model="editModal.customer_name" readonly style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10" v-if="hasEmployee">
              <FormItem label="招商经理">
                <Select
                  v-model="editModal.employee_id"
                  filterable
                  remote
                  :remote-method="remoteLeaseMethod"
                  :loading="remoteLoading"
                  clearable
                  style="width: 200px"
                  @on-change="selectEditManageLease"
                  >
                  <Option v-for="item in leasingList" :value="item.id" :key="item.id">{{ item.fullname }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" v-else>
              <FormItem label="招商经理">
                <Input v-model="editModal.fullname" disabled style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="所属组">
                <Select v-model="editModal.group_name" style="width: 200px">
                  <Option v-for="(item,index) in group_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="带看次数">
                <Input v-model="editModal.total_count" readonly style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="带看时间">
                <DatePicker :value="editModal.clue_date" format="yyyy-MM-dd" type="date" placeholder="带看时间" style="width: 200px" @on-change="changeAddModalClueDate"></DatePicker>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="场地">
                <Select v-model="editModal.kitchen_id" @on-change="selectAddKitchen" style="width: 200px">
                  <Option v-for="item in kitchenList" :value="item.id" :key="item.id">{{ item.kitchen_name }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="渠道来源">
                <Select v-model="editModal.source" style="width: 200px">
                  <Option v-for="(item,index) in sources_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="未成交因素">
                <Select v-model="editModal.consider" style="width: 200px">
                  <Option v-for="(item,index) in considers_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="意向面积">
                <Input v-model="editModal.area" placeholder="输入意向面积" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="10">
              <FormItem label="意向品类">
                <Select v-model="editModal.category" style="width: 200px">
                  <Option v-for="(item,index) in category_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="10" offset="2">
              <FormItem label="意向程度">
                <Select v-model="editModal.level" style="width: 200px">
                  <Option v-for="(item,index) in head_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row type="flex" justify="start" align="middle" :gutter="20">
            <i-col span="22">
              <FormItem label="留言备注">
                <Input v-model="editModal.remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注"></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
//权限
// Index/getKitchenList,Index/getEmployeeList,Clue/index,Clue/queryCustomer,Clue/add,Clue/edit,Clue/export,Clue/delete
import { getKitchenList , getLeasingList , showEmployee } from '@/api/data'
import { getClueList , queryCustomer , addNewClue , editOldClue , deleteClue } from '@/api/canvass'
export default {
  name: 'canvassStoreView',
  components: {
    Tables
  },
  data () {
    return {
      // 搜索
      userPhone:'',
      sources:'',
      employee_id:'',
      kitchen_id:'',
      start_count:'',
      end_count:'',
      consider:'',
      category:'',
      level:'',
      start_area:'',
      end_area:'',
      start_time:'',
      end_time:'',
      group_name:'',
      hasEmployee:true,
      // 表格
      view_columns:[
        {title: '所属团队', key: 'group_name'},
        {title: '渠道来源', key: 'source'},
        {title: '招商经理', key: 'employee_name'},
        {title: '带看时间', key: 'clue_date'},
        {title: '场地', width:100 , key: 'kitchen_name'},
        {title: '客户ID', width:80 , key: 'customer_id'},
        {title: '客户姓名', key: 'customer_name'},
        {title: '联系方式', key: 'contact'},
        {title: '未成交因素', key: 'consider'},
        {title: '意向面积', key: 'area'},
        {title: '意向品类', key: 'category'},
        {title: '意向程度', key: 'level'},
        {title: '已带看次数', key: 'total_count'},
        {
          title: '留言', 
          key: 'remark',
          width :160
        },
        {
          title: '编辑',
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
              '编辑')
            },
          ]
        },
        {
          title: '操作',
          key: 'handle',
          width :160,
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('data-dele', params)
                  }
                }
              }, [
                h('Button', {
                  style:{margin: '0'},
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                }, '删除')
              ])
            },
            (h, params, vm) => {
              return h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {marginLeft: '5px'},
                on: {
                  'click': () => {
                    vm.$emit('data-build', params)
                  }
                }},
              '预建档')
            },
          ]
        }
      ],
      view_list:[],
      page: {
        current_page: 1,
        last_page: '',
        list_rows: 0,
        total: 0
      },
      // 增加一条
      // 厨房列表
      leasingList:[],
      remoteLoading:false,
      kitchenList:[],
      showNewAddModal:false,
      showOldAddModal:false,
      showEditModal:false,
      addModal:{},
      editModal:{},
      // 渠道来源 
      sources_list:["58渠道","微信群","电话渠道","转介绍-中介","转介绍-BD","转介绍-已签约客户","转介绍-非签约客户","已合作门店开分店","转介绍-招商同行","转介绍-品牌渠道","访客","官网","其他来源务必备注说明"],
      // 意向程度
      head_list:["已签约","高意向","中意向","低意向"],
      // 未成交因素 
      considers_list:["已成交","费用高","区域门店保护","客户开店计划尚未成熟","项目施工开业较晚","商圈流量较低","没有堂食","商圈竞争激烈","资质证件未办齐","其他因素务必备注说明"],
      category_list:["快餐","米粉","面馆","粥店","麻辣烫麻辣拌","麻辣香锅","汉堡炸鸡","黄焖鸡","炒饭","烤肉拌饭","凉皮","锅贴","饮品","甜点蛋糕","其他"],
      // 队伍
      group_list:['望京组','十里堡组','通州组','四道口组','新人组'],
    }
  },
  methods: {
    remoteLeaseMethod (query) {
        if (query !== '') {
          this.remoteLoading = true;
          getLeasingList({keyword:query}).then(res => {
            const dbody = res.data
            this.remoteLoading = false;
            if (dbody.code != 0) {
              this.$Notice.warning({
                title: dbody.msg
              })
              return
            }
            this.leasingList = dbody.data || [];
          }).catch(err =>{
            this.remoteLoading = false;
          })
        } else {
          this.leasingList = [];
        }
    },
    // 搜索
    sreachPhone(){
      if(!!this.userPhone && !this.checkPhone( this.userPhone ) ){
        this.$Notice.warning({
          title: '请输入正确联系方式！'
        })
        return false
      }
      if(!!this.start_count && this.start_count*1 <= 0){
        this.$Notice.warning({
          title: '请输入正确带看搜索！'
        })
        return false
      }
      if(!!this.end_count && this.end_count*1 <= 0){
        this.$Notice.warning({
          title: '请输入正确带看搜索！'
        })
        return false
      }
      if(!!this.start_area && this.start_area*1 <= 0){
        this.$Notice.warning({
          title: '请输入正确搜索面积！'
        })
        return false
      }
      if(!!this.end_area && this.end_area*1 <= 0){
        this.$Notice.warning({
          title: '请输入正确搜索面积！'
        })
        return false
      }
      let info = {
        contact:this.userPhone.trim(),
        source:this.sources,
        employee_id:this.employee_id,
        kitchen_id:this.kitchen_id,
        start_area:this.start_area,
        end_area:this.end_area,
        consider:this.consider,
        category:this.category,
        level:this.level,
        start_count:this.start_count,
        end_count:this.end_count,
        start_time:this.start_time,
        end_time:this.end_time,
        group_name:this.group_name,
      }
      this.initData( info )
    },
    // 导出
    exportTable(){
      if(!!this.userPhone && !this.checkPhone( this.userPhone ) ){
        this.$Notice.warning({
          title: '请输入正确联系方式！'
        })
        return false
      }
      let info = {
        contact:this.userPhone.trim(),
        source:this.sources,
        employee_id:this.employee_id,
        kitchen_id:this.kitchen_id,
        start_area:this.start_area,
        end_area:this.end_area,
        consider:this.consider,
        category:this.category,
        level:this.level,
        start_count:this.start_count,
        end_count:this.end_count,
        start_time:this.start_time,
        end_time:this.end_time,
        group_name:this.group_name,
      }
      var str = '';
      for(let k in info){
        str += ( k + '=' + info[k] + "&");
      }
      str = str.substr(0, str.length - 1)
      const href = "./api/Clue/export?" + str;
      window.open(href, '_blank')
    },
    // 选择时间
    selectDate(date){
      this.start_time = date[0]
      this.end_time = date[1]
    },
    // 返回信息
    formatArea(val) {
        return '意向面积: ' + val ;
    },
    formatCount(val) {
        return '带看次数: ' + val ;
    },
    // 验证添加信息
    testInfo( info ){
      if( !info.customer_name ){
        this.$Notice.warning({
          title: '请输入客户姓名！'
        })
        return false
      }
      if( !info.employee_id ){
        this.$Notice.warning({
          title: '请选择招商经理！'
        })
        return false
      }
      if( !info.kitchen_id ){
        this.$Notice.warning({
          title: '请选择带看场地！'
        })
        return false
      }
      if( !info.clue_date ){
        this.$Notice.warning({
          title: '请选择带看时间！'
        })
        return false
      }
      if( !info.source ){
        this.$Notice.warning({
          title: '请输入渠道来源！'
        })
        return false
      }
      if( !info.area ){
        this.$Notice.warning({
          title: '请输入意向面积！'
        })
        return false
      }
      if( !info.consider ){
        this.$Notice.warning({
          title: '请输入未成交因素！'
        })
        return false
      }
      if( !info.category ){
        this.$Notice.warning({
          title: '请输入意向品类！'
        })
        return false
      }
      if( !info.group_name ){
        this.$Notice.warning({
          title: '请输入所属团队！'
        })
        return false
      }
      return true
    },
    // 获取一个新页
    getNewPage(page){
      let info = {
        contact:!!this.userPhone?this.userPhone.trim() : '',
        source:this.sources,
        employee_id:this.employee_id,
        kitchen_id:this.kitchen_id,
        start_area:this.start_area,
        end_area:this.end_area,
        consider:this.consider,
        category:this.category,
        level:this.level,
        start_count:this.start_count,
        end_count:this.end_count,
        start_time:this.start_time,
        end_time:this.end_time,
        group_name:this.group_name,
        page : page
      }
      this.initData(info)
    },
    // 增加带看
    addViewItem(){
      if( !this.checkPhone( this.userPhone ) ){
        this.$Notice.warning({
          title: '请输入有效联系方式！'
        })
        return false
      }
      queryCustomer( { contact : this.userPhone.trim() } ).then(res => {
      const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.addModal = {};
        if(!dbody.data){
          this.$Message.info({
                    content: '新客户',
                    duration: 5,
                });
          this.addModal.contact = this.userPhone.trim();
          this.addModal.total_count = 1;
          this.showNewAddModal = true;
        }else{
          this.$Message.info({
                    content: '老客户',
                    duration: 5,
                });
          this.addModal = dbody.data;
          this.addModal.total_count = dbody.data.total_count*1 + 1;
          let employee_id = this.addModal.employee_id;
          this.isHasEmployee(employee_id,'showOldAddModal','addModal');
        }
      })
    },
    isHasEmployee(id,key,item){
      showEmployee( {id:id} ).then(res => {
        const dbody = res.data
        let info = dbody.data || {}
        if(info.status != 0){
          this.hasEmployee = false;
          this[item].employee_id = id;
          this[item].fullname = info.fullname;
        }else{
          this[item].employee_id = '';
          this.hasEmployee = true;
        }
        setTimeout(()=>{
          this[key] = true;
        },200)
      })
    },
    // 编辑显示弹窗
    handleEdit(params){
      let data = Object.assign({},params.row);
      this.editModal = {};
      this.editModal = data;
      let employee_id = this.editModal.employee_id;
      this.isHasEmployee(employee_id,'showEditModal','editModal');
    },
    // 删除一条带看
    handleDele( params ){
      let id = params.row.id;
      deleteClue( id ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "删除成功！"
        })
        this.view_list = this.view_list.filter(obj => obj.id !== id)
      })
    },
    // handlePreBuild 预建档
    handlePreBuild(params){
      let customer_id = params.row.customer_id;
      const route = {
        name: 'canvassShopPreBuild',
        query: {
          customer_id
        }
      }
      this.$router.push(route)
    },
    // 编辑一条带看
    saveEditModalInfo(  ){
      delete this.editModal.create_time
      delete this.editModal.update_time
      editOldClue( this.editModal ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "修改成功！"
        })
        this.initData();
      })
    },
    // 增加一条新客户带看
    saveNewAddModalInfo(){
      if(!this.testInfo(this.addModal)){
        return
      }
      this.addNewClue(this.addModal);
      delete this.addModal.id
    },
    addNewClue( info ){
      addNewClue( info ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.$Notice.warning({
          title: "添加成功！"
        })
        this.initData();
      })
    },
    changeAddModalClueDate(date){
      this.addModal.clue_date = date;
    },
    

    // 获取厨房
    getKitchenList(){
      getKitchenList().then(res => {
        const dbody = res.data
        // 初始化函数
        this.kitchenList = dbody.data || [];
      })
    },

    // 依据招商ID获取店长姓名
    selectAddManageLease (  ) {
      let that = this;
      this.leasingList.forEach( function(element, index) {
        if(element.id*1 == that.addModal.employee_id*1){
          that.addModal.employee_name = element.fullname
        }
      });
    },
    selectEditManageLease (  ) {
      let that = this;
      this.leasingList.forEach( function(element, index) {
        if(element.id*1 == that.editModal.employee_id*1){
          that.editModal.employee_name = element.fullname
        }
      });
    },
    selectAddKitchen( ){
      let that = this;
      this.kitchenList.forEach( function(element, index) {
        if(element.kitchen_id*1 == that.addModal.kitchen_id*1){
          that.addModal.kitchen_name = element.kitchen_name
        }
      });
    },
    // 手机号正则
    checkPhone(str){
      if(!str){
        return false;
      }
      str = str.trim();

      // var re =/^[1][3-9][0-9]{9}$/;
      // if(re.test(str)){
      //   return true;
      // }else{
      //   return false;
      // }

      // 更改手机号为联系方式
      if(str.length > 2){
        return true;
      }else{
        return false;
      }
    },
    //初始化
    initData( info ){
      getClueList( info ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        // 初始化函数
        this.view_list = dbody.data.list || [];
        this.page = dbody.data.page;
      })
    },
  },
  created () {
    this.getKitchenList();
    this.initData();
  }
}
</script>

<style lang="less">

</style>
