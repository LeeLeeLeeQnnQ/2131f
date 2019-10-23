<template>
  <div>
    <Card shadow>
      <Row :gutter="20">
        <i-col :xs="4" :md="4" :lg="4">
          <Select v-model="sreachInfo.area_id">
            <Option v-for="item in areaList" :value="item.id" :key="item.id">{{ item.area_name }}</Option>
          </Select>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4">
          <Button type="primary" @click="sreachKeyword">搜索</Button>
        </i-col>
        <i-col :xs="4" :md="4" :lg="4" v-if="shopList.length > 0">
          <Button type="error" @click="submitInfo">保存</Button>
        </i-col>
      </Row>
    </Card>
    <div class="draggable_warp">
      <draggable
        :options="options"
        :value="shopList"
        class="draggable_box"
        @end="draggEnd"
        v-show="refreshList"
        >
        <div v-for="(item, index) in shopList"
          class="draggable_box_item" 
            :key="index">
          <p
            class="draggable_box_item_title" 
          >{{item.shop_name}}</p>
          <p
            class="draggable_box_item_rules" 
          >{{item.rules}}</p>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
// 权限
// 
import { getSpreadStoreQueryList , getAreaList  , setStoreSort} from '@/api/spread'
import Tables from '_c/tables'
import draggable from 'vuedraggable'
export default {
  name: 'spreadShopSort',
  components: {
    draggable
  },
  data () {
    return {
      sreachInfo:{
        area_id:'',
        shop_state:1,
      },
      areaList:[],
      refreshList:true,

      shopList: [],
      options: { group: 'drag_list' }

    }
  },
  methods: {
    submitInfo(){
      let arr = [];
      let length = this.shopList.length;
      this.shopList.forEach((item,index)=>{
        let obj = {
          id:item.id,
          sort:length - index
        }
        arr.push(obj)
      })
      this.setStoreSort(arr)
    },
    init(){
      this.shopList = [];
      if(!this.sreachInfo.area_id){
        this.$Notice.warning({
          title: "地区必须选取！"
        })
        return
      }
      getSpreadStoreQueryList( this.sreachInfo ).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }
        this.shopList = dbody.data || [];
        if(this.shopList.length <= 0){
          this.$Notice.warning({
            title: "无匹配数据！"
          })
        }
      })
    },
    sreachKeyword(){
      this.init({})
    },
    setStoreSort(arr){
      setStoreSort(arr).then(res => {
        const dbody = res.data
        if (dbody.code != 0) {
          this.$Notice.warning({
            title: dbody.msg
          })
          return
        }      // 初始化函数
        this.$Notice.warning({
          title: "保存成功！"
        })
      })
    },
    draggEnd (evt) {
      let array = this.shopList;
      let index1 = evt.newIndex;
      let index2 = evt.oldIndex;
      [array[index1],array[index2]] = [array[index2],array[index1]];
      this.refreshList = false
      this.refreshList = true;
    }
  },
  mounted () {
    getAreaList().then(res => {
      const dbody = res.data
      if (dbody.code != 0) {
        this.$Notice.warning({
          title: dbody.msg
        })
        return
      }      // 初始化函数
      this.areaList = dbody.data || [];
    })
  },
  computed: {

  }
}
</script>

<style scoped lang="less">
  .draggable_warp{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #eee;
  }
  .draggable_box{
    display: inline-block;
    width: 600px;
    height: 560px;
    overflow-y: auto;
    .draggable_box_item{
      margin: 10px;
      background-color: #fff;
      cursor: pointer;
      padding: 5px;
      border-radius: 5px;
      border:1px solid #ddd;
    }
    .draggable_box_item_title{
      border-bottom: 1px solid #eee;
      font-size: 16px;
    }
  }
  .handle-log-box{
    display: inline-block;
    margin-left: 20px;
    border: 1px solid #eeeeee;
    vertical-align: top;
    width: 200px;
    height: 500px;
    h3{
      padding: 10px 14px;
    }
    .handle-inner-box{
      height: ~"calc(100% - 44px)";
      overflow: auto;
      p{
        padding: 14px 0;
        margin: 0 14px;
        border-bottom: 1px dashed #eeeeee;
      }
    }
  }
  .res-show-box{
    display: inline-block;
    margin-left: 20px;
    border: 1px solid #eeeeee;
    vertical-align: top;
    width: 350px;
    height: 570px;
  }
</style>
