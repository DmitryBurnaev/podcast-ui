<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="Chapters" name="1">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(chapter, index) in chapters"
          :key="index"
          :type="'success'"
          :timestamp="chapter.start"
        >
          <span @click="chooseChapter(chapter)">
            {{chapter.title}}
          </span>
        </el-timeline-item>
      </el-timeline>
    </el-collapse-item>
  </el-collapse>

</template>

<script>
import {Collapse, CollapseItem} from 'element-ui';
import {Timeline, TimelineItem} from "element-ui";

export default {
  name: "EpisodeChapters",
  props: ['chapters'],
  data: () => ({
    activeNames: [],
  }),
  components: {
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem,
    'el-timeline': Timeline,
    'el-timeline-item': TimelineItem
  },
  mounted() {
    this.audio = document.getElementById("audioPlayer");
  },
  methods: {
    chooseChapter(chapter){
      this.playerSeek(chapter.start)
    },
    playerSeek(startTime){
      this.audio.currentTime = this.convertTimeToSeconds(startTime)
    },
    convertTimeToSeconds(timeString) {
      const timeParts = timeString.split(':');
      return parseInt(timeParts[0], 10) * 3600 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
    }
  }
}
</script>

<style lang="scss">
.el-collapse{
  border: 0;
  .el-collapse-item__content{
    padding-bottom: 0;
    padding-top: 10px;
  }
  .el-collapse-item__header{
    border-bottom: 0;
    padding-left: 3px;
  }
  .el-collapse-item__wrap{
    border-bottom: 0;
  }
  .el-collapse-item__content{
    margin-bottom: 5px;
  }
}
.el-timeline{
  padding-left: 5px;
  .el-timeline-item__node--normal {
    width: 10px;
    height: 10px;
  }
  .el-timeline-item__tail{
    left: 4px;
    border-left: 1px solid #E4E7ED;
  }
  .el-timeline-item__node--success {
    background-color: #6bd098;
  }
  .el-timeline-item__content{
    font-size: 13px;
    max-width: 200px;
    cursor: pointer;
  }
  .el-timeline-item{
    padding-bottom: 10px;
  }
  .el-timeline-item__wrapper{
    text-align: left;
    padding-left: 20px;
    top: -6px;
  }
  .el-timeline-item__timestamp{
    float: right;
    margin-top: -16px;
    padding-right: 7px;
    font-family: "Space Mono",monospace;
    font-size: 10px;
  }
}


</style>