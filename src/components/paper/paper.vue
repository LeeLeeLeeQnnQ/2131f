<template>
  <Card :title=number icon="md-calendar">
    <Modal title="预览图" v-model="visible">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>
    <Card title='检查意见' shadow>
      <p>{{opinion}}</p>
    </Card>
    <Card title='照片列表' shadow style="margin: 3px 0;">
      <div class="img-upload-list" v-for="item in pictures">
          <img :src="item">
          <div class="img-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          </div>
      </div>
    </Card>
    <Card title='检查详情' shadow>
      <CellGroup>
          <Cell v-for="item in subjects" style="border-bottom: 1px solid #e8eaec;">
            <p>{{item.content}}</p>
            <Icon v-if="item.judge == 1" type="md-checkmark" class="iconSize" slot="extra" style="color:#19be6b"/>
            <Icon v-else-if="item.judge == 2" type="md-close" class="iconSize"  slot="extra" style="color:#ed4014"/>
            <Icon v-else type="md-help" class="iconSize" slot="extra" style="color:#2db7f5"/>
          </Cell>
      </CellGroup>
    </Card>
  </Card>
</template>

<script>
export default {
  name: 'paper',
  props: {
    number: {
      type: String,
      default: ''
    },
    subjects: {
      type: Array,
      default: () => {
        return []
      }
    },
    opinion: {
      type: String,
      default: ''
    },
    pictures: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      imgUrl: ''
    }
  },
  methods: {
    handleView (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    }
  }
}
</script>

<style lang="less">
  .iconSize{
    font-size: 1.5em;
  }
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
