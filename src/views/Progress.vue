<template>
  <div class="content content-podcast-progress">
    <div class="row">
      <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Episodes in progress</h4>
        </div>
        <div class="card-body">
          <ul class="list-unstyled team-members">
            <li
                v-for="progress in progressItems"
                :key="progress.episode.id">
              <div class="row row-episode">
                <div class="col-md-1 col-1 episode-content" @click="goToEpisode(progress)">
                  <div class="episode-image">
                    <img :src="progress.podcast.image_url" alt="Circle Image" class="podcast-cover img-circle img-no-padding img-responsive">
                  </div>
                </div>
                <div class="col-md-11 col-11 episode-title episode-content" @click="goToEpisode(progress)">
                  {{ progress.episode.title }}
                  <br/>
                  <small
                    :class="{
                      'text-danger': (progress.status === 'error'),
                      'text-muted': (['new', 'downloading'].includes(progress.episode.status)),
                    }"
                  >
                    {{progress.status_display }}
                  </small>
                  <el-progress v-if="progress.status === 'error'" :percentage="progress.completed" status="exception"></el-progress>
                  <el-progress v-else :percentage="parseInt(progress.completed)" ></el-progress>
                </div>
              </div>
              <hr class="hr__row-episode">
            </li>

          </ul>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import router from "@/router";

  export default {
    name: 'Progress',
    data: () => ({
        progressItems: [],
        timeInterval: null,
    }),
    async mounted() {
      const response = await axios.get(`progress/`)
      if (response){
        this.progressItems = response.data
      }
      console.log(this.progressItems)

      // this.timeInterval = setInterval(() => {
      //   // this.progressItems = [{"episode_id": 1, "test": "foo"}]
      //   const response = axios.get(`progress/`)
      //   console.log(this.episodesInProgress)
      //   if (response){
      //     this.episodesInProgress = response.data
      //   }
      // }, 1000)
    },
    destroyed() {
      clearInterval(this.timeInterval)
    },
    methods: {
      goToEpisode(progress){
        router.push({name: 'episodeDetails', params: {'episodeID': progress.episode.id, 'podcastID': progress.podcast.id}})
      },
    }
  }

</script>
<style lang="scss">
.podcast-cover{
  width: 70px;
}
.episode-content{
  cursor: pointer;
}

</style>