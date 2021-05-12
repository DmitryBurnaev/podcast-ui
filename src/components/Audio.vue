<template>
  <div v-if="src" class="text-secondary audio-content" >
    <i
        class="nc-icon text-success"
        :title="src"
        :class="{
          'nc-button-play': !isPlaying,
          'nc-button-pause': isPlaying,
        }"
        @click="playPause()"
    ></i>
    <br />
    <span class="muted">{{audioCurrentTime | length}}</span>
    <div class="block">
      <el-slider
          v-model="audioCurrentTime"
          :max="length"
          :format-tooltip="audioLength"
          @change="seek()">
      </el-slider>
    </div>
    <figure>
      <audio :src="src" id="audioPlayer" >
          Your browser does not support the
          <code>audio</code> element.
      </audio>
    </figure>
  </div>

</template>

<script>
import {audioLengthFilter} from "@/utils/filters";
import {Slider} from 'element-ui';

export default {
  name: "Audio",
  props: ['src', 'length'],
  data: () => ({
    audio: null,
    isPlaying: false,
    audioCurrentTime: 0
  }),
  components: {
    'el-slider': Slider,
  },
  mounted() {
    this.audio = document.getElementById("audioPlayer");
    this.audio.addEventListener("timeupdate", () => { this.audioCurrentTime = this.audio.currentTime})
    this.audio.addEventListener("ended", () => { this.isPlaying = false;})
  },
  methods: {
    playPause(){
      if (this.isPlaying){
        this.audio.pause()
      } else {
        this.audio.play()
      }
      this.isPlaying = !this.isPlaying;
    },
    seek(){
      this.audio.currentTime = this.audioCurrentTime
    },
    audioLength: audioLengthFilter
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