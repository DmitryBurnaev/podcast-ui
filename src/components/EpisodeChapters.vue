<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item title="Chapters" name="1">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :type="'success'"
          :timestamp="activity.timestamp">
          {{activity.content}}
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
  // props: ['src', 'length'],
  data: () => ({
    activeNames: [],
    activities: [{
      content: 'Chapter 1',
      timestamp: '0:0:0'
    }, {
      content: 'Chapter 2',
      timestamp: '0:10:25'
    }, {
      content: 'Chapter 3',
      timestamp: '0:23:11'
    }]
  }),
  components: {
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem,
    'el-timeline': Timeline,
    'el-timeline-item': TimelineItem
  },
  mounted() {
    this.audio = document.getElementById("audioPlayer");
    this.audio.addEventListener("timeupdate", () => { this.audioCurrentTime = this.audio.currentTime})
    this.audio.addEventListener("ended", () => { this.isPlaying = false;})
  },
  methods: {
    handleChange(val) {
        console.log(val);
    }
  }
}
</script>

<style lang="scss">

.audio-content{
  padding-left: 10px;
  padding-right: 10px;
  figure{display: none}
  i{
    font-size: 2.5em;
    cursor: pointer;
  }
  .el-slider__button{
    border-color: #6bd098 !important;
  }
  .el-slider__bar{
    background-color: #6bd098 !important;
  }
}
</style>