<template>
  <div>
    <div class="main_box">
      <div class="map_box">
        <div id="orderMap" :style="heightStyle"></div>
        <div class="input-card">
          <Button v-show="!!currentPoid" class="input-btn" type="error" @click="delePolygon">删除区域</Button>
          <Button v-show="!!currentPoid" class="input-btn" type="error" @click="countPolygon">计算区域数据</Button>
          <Button v-show="!!currentPoid" class="input-btn" type="error" @click="savePolygon">保存选取区域</Button>
          <Button class="input-btn" type="primary" @click="startDraw">选取区域</Button>
          <Button class="input-btn" type="primary" @click="endDraw">停止选取</Button>
        </div>
      </div>
      <ul class="floatRBox"  :style="heightStyle">
        <li v-for="(item,index) in polygonArr" class="info-item" :style="{borderColor:item.color}">
          <p>
            面积：{{measureArea(item.path)}}
          </p>
          <div v-show="item.hasData">
            <p>
             订单量：{{item.order_total}}
            </p>
            <p>
             商户数量：{{item.shop_total}}
            </p>
            <hr>
            <p>
             美团商户数量：{{item.meituan_shop_total}}
            </p>
            <p>
              美团占比：{{item.meituan_order_ratio}}%
            </p>
            <hr>
            <p>
             饿了么商户数量：{{item.ele_shop_total}}
            </p>
            <p>
              饿了么占比：{{item.ele_order_ratio}}%
            </p>
            <hr>
            <p>
              品牌商户占比：{{item.brand_ratio}}%
            </p>
            <p>
              品牌单量：{{item.brand_order_total}}
            </p>
            <p>
              品牌单量占比：{{item.brand_order_ratio}}%
            </p>
            <hr>
            <p>
             月销量9999+商户：{{item.month_sale_plus}}
            </p>
            <p>
             月销量3000+商户：{{item.month_sale}}
            </p>
            <p>
             流水10W+商户：{{item.turnover_plus}}
            </p>
            <p>
             流水80000+商户：{{item.turnover}}
            </p>
            <p>
             在营商户数量：{{item.store_total}}
            </p>
            <hr style="margin: 5px 0">
            <p>
              品类
            </p>
            <p v-for="(val,key) in item.category_ratio">
              {{key}}：{{val}} %
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div v-show="mapLoading"  class="mapLoading">
      <p>数据请求中.....</p>
    </div>
  </div>
</template>

<script>
//权限
// Kitchen/index,KitchenReside/queryList
import { getMapInfo } from '@/api/data'
export default {
  name: 'analysisOrders',
  components: {
    
  },
  data () {
    return {
      smap:{},
      mouseTool:'',
      polygonColor:'',
      polygonArr:[],
      currentPoid:null,
      mapLoading:false,
    }
  },
  methods: {
    // 随机生成颜色
    getRandomColor16(){//十六进制颜色随机
      var r = Math.floor(Math.random()*256);
      var g = Math.floor(Math.random()*256);
      var b = Math.floor(Math.random()*256);
      var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
      return color;
    },
    // 
    measureArea(path){
      let area = Math.round(AMap.GeometryUtil.ringArea(path));
      return (area/1000000).toFixed(2) + '平方千米'
    },
    // delePolygon
    delePolygon(){
      if(!this.currentPoid){
        return
      }
      // 清除覆盖物
      let polygonObj = this.findPolygonObj(this.currentPoid)
      polygonObj.editor.close()
      this.smap.remove(polygonObj.polygon);
      // 清除数据
      let itemArr = this.polygonArr.forEach((item,index)=>{
        if(item.poid === this.currentPoid){
            this.polygonArr.splice(index,1);
        }
      });
      // 清除当前索引
      this.currentPoid = '';
    },
    // savePolygon
    savePolygon(){
      if(!this.currentPoid){
        return
      }
      let polygonObj = this.findPolygonObj(this.currentPoid)
      this.currentPoid = '';
      polygonObj.editor.close()
    },
    // 计算该区域数据
    countPolygon(){
      if(!this.currentPoid){
        return
      }
      let id = this.currentPoid;
      let polygonObj = this.findPolygonObj(this.currentPoid)
      this.currentPoid = '';
      polygonObj.hasData = false;
      polygonObj.editor.close();
      // 请求接口
      let spath = [];
      polygonObj.path.forEach((item)=>{
        let dot = {}
        dot.lat = item.lat
        dot.lng = item.lng
        spath.push(dot)
      })
      this.mapLoading = true;
      setTimeout(()=>{
        this.getMapInfo({poid:id,polygon:spath})
      },0)
    },
    // 初始化数据
    initMap(){
      this.smap = new AMap.Map('orderMap')
      this.mouseTool = new AMap.MouseTool(this.smap)
      this.smap.setZoom(13);
      AMap.plugin('AMap.ToolBar',()=>{
          const toolbar = new AMap.ToolBar()
          this.smap.addControl(toolbar);
      });
      AMap.event.addListener( this.mouseTool,'draw',(e)=>{
          this.drawPolygon(e.obj.getPath());
          this.mouseTool.close(true);
      });
      // 绘制函数
      const draw = ()=>{
        this.startDraw();
      }
    },
    // 开始画画
    startDraw(){
      this.polygonArr.forEach((i)=>{
        i.editor.close()
      });
      this.currentPoid = null;
      this.polygonColor = this.getRandomColor16();
      this.mouseTool.polygon({
        strokeColor:this.polygonColor,
        fillColor:this.polygonColor,
      })
    },
    // 获取地图数据
    getMapInfo(data){
      let polygonObj = this.findPolygonObj(data.poid)
      getMapInfo(data).then(res => {
        let  dbody = res.data
        this.polygonArr.forEach((item)=>{
          if(item.poid === polygonObj.poid){
            item.hasData = false;
          }
        })
        setTimeout(()=>{
          // 清除Loading
          this.mapLoading = false;
          // 返回数据不成功
          if (dbody.code != 0) {
            this.$Notice.warning({
              title: dbody.msg
            })
            polygonObj = data;
            return
          }
          // 返回数据成功
          let resData = dbody.data || {}
          this.polygonArr.forEach((item)=>{
            if(item.poid === polygonObj.poid){
              item.brand_ratio = resData.brand_ratio
              item.brand_shop = resData.brand_shop
              item.category_ratio = resData.category_ratio || {}
              item.ele_order_ratio = resData.ele_order_ratio
              item.ele_order_total = resData.ele_order_total
              item.meituan_order_ratio = resData.meituan_order_ratio
              item.meituan_order_total = resData.meituan_order_total
              item.month_sale = resData.month_sale
              item.month_sale_plus = resData.month_sale_plus
              item.order_total = resData.order_total
              item.shop_total = resData.shop_total
              item.store_total = resData.store_total
              item.turnover = resData.turnover
              item.turnover_plus = resData.turnover_plus
              item.meituan_shop_total = resData.meituan_shop_total
              item.ele_shop_total = resData.ele_shop_total
              item.brand_order_total = resData.brand_order_total
              item.brand_order_ratio = resData.brand_order_ratio
              item.hasData = true;
            }
          })
          this.$Notice.warning({
            title: '计算完毕！'
          })
        },800)
      }).catch((e)=>{
        setTimeout(()=>{
          this.mapLoading = false;
          this.$Notice.warning({
            title: e
          })
        },800)
        return
      })
    },
    // 停止画画
    endDraw(){
      this.mouseTool.close(true);
    },
    //绘画已经留存的多边形
    drawPolygon(path){
      let index = this.polygonArr.length*1 + 1;
      var polygon = new AMap.Polygon({
          path: path,
          strokeColor: this.polygonColor, 
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: this.polygonColor, 
          zIndex: 50,
      })
      var polygonEditor = new AMap.PolyEditor(this.smap, polygon)
      polygon.on('click', (e)=>{
        this.currentPoid = e.target._amap_id
        polygonEditor.open()
      })

      this.smap.add(polygon)
      let o = {
        poid:polygon._amap_id,
        editor:polygonEditor,
        polygon:polygon,
        color:this.polygonColor,
        path:path,
      }
      this.polygonArr.push(o);
    },
    // 找到对象修改path
    findPolygonObj(poid){
      let itemArr = this.polygonArr.filter((i)=>{
        return i.poid  == poid;
      });
      return itemArr[0]
    },
  },
  computed: {
    heightStyle() {
      const ms = "height: "+(window.screen.availHeight*1-110)+"px";
      return ms
    },
  },
  watch:{
    // 选定新编辑时候上一个编辑关闭
    currentPoid(newV, oldV){
      if(!!oldV){
        let polygonObj = this.findPolygonObj(oldV)
        if(!polygonObj){
          return
        }
        polygonObj.editor.close()
      }
    }
  },
  mounted () {
    this.initMap();
  },
  created () {
      
  },
}
</script>

<style>
  .main_box{
    width: 100%;
    height: 100%;
    display: flex;
    padding: 5px;
  }
  .map_box{
    position: relative;
    width: 85%;
  }
  .input-card{
    position: absolute;
    top: 5px;
    right: 10px;
  }
  .input-btn{
    margin: 3px;
  }
  #orderMap{
    width: 100%;
  }
  .floatRBox{
    width: 15%;
    overflow: auto;
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .info-item{
    border-style:solid;
    border-width:2px;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 0 5px #999;
    margin-bottom: 5px;
  }
  .mapLoading{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #333;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.5em;
    z-index: 9999;
    top: 0;
    left: 0;
    opacity: 0.8;
  }
</style>
