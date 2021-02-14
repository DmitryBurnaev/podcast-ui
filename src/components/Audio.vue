<template>
  <div v-if="src" class="text-secondary audio-content" >
    <i
        class="nc-icon text-primary"
        :title="src"
        :class="{
          'nc-button-play': !isPlaying,
          'nc-button-pause': isPlaying,
        }"
        @click="playPause()"
    ></i>
    <div class="block">
      <el-slider v-model="audioCurrentTime" :max="length" @change="seek()"></el-slider>
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
export default {
  name: "Audio",
  props: ['src', 'length'],
  data: () => ({
    audio: null,
    isPlaying: false,
    audioCurrentTime: 0
  }),
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

  }
}
</script>

<style lang="scss">

.audio-content{
  figure{display: none}
  i{
    font-size: 2.5em;
    cursor: pointer;
  }
}
</style>