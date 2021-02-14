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
      <el-slider v-model="audioCurrentTime" :max="length"></el-slider>
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
    isPlaying: false,
    audioCurrentTime: 0
  }),
  methods: {
    playPause(){
      let audio = document.getElementById("audioPlayer");
      audio.addEventListener("timeupdate", () => { this.audioCurrentTime = audio.currentTime })
      if (this.isPlaying){
        audio.pause()
      } else {
        audio.play()
      }
      this.audioCurrentTime = audio.currentTime
      this.isPlaying = !this.isPlaying;
    }
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