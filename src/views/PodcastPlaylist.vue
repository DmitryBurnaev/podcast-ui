<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-12">
        <div class="card create-episode-card">
          <div class="card-header">
            <h5 class="card-title">Download playlist</h5>
          </div>
          <div class="card-body">
              <el-form :model="playlistData.form" :rules="playlistData.rules" ref="createEpisodeForm">
                <el-form-item prop="source_url" :class="{'is-error': playlistData.serverErrors.source_url.length > 0}">
                  <el-input
                      placeholder="Playlist Source Link"
                      v-model="playlistData.form.source_url"
                      :disabled="playlistData.inProgress"
                  >
                    <el-button slot="append" icon="el-icon-view" type="success" @click="createEpisode"></el-button>
                  </el-input>
                  <input-errors :errors="playlistData.serverErrors.source_url"></input-errors>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
    </div>
    <div class="row" v-if="playlistItems.length > 0">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Videos</h4>
          </div>
          <div class="card-body">
            <ul class="list-unstyled team-members">
              <li
                  v-for="video in playlistItems"
                  :key="video.id">
                <div class="row row-episode">
<!--                  <div class="col-md-1 col-1 episode-content" @click="goToEpisode(episode)">-->
<!--                    <div class="episode-image">-->
<!--                      <img :src="episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div class="col-md-9 col-9 episode-title episode-content" @click="goToEpisode(episode)">-->
<!--                    {{ episode.title }}-->
<!--                    <br/>-->
<!--                    <span-->
<!--                        :class="{-->
<!--                          'text-danger': (episode.status === 'error'),-->
<!--                          'text-success': (['new', 'downloading', 'published'].includes(episode.status)),-->
<!--                          'text-gray': (episode.status === 'archived')-->
<!--                        }">-->
<!--                      <small>{{humanStatus(episode.status)}}</small>-->
<!--                    </span>-->
<!--                  </div>-->

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
import {
  fillFormErrors, formIsValid,
} from "@/utils/podcast";
import InputErrors from "@/components/InputErrors";

export default {
  name: 'PodcastDetails',
  components: {InputErrors},
  data: () => ({
    loading: true,
    podcast: null,
    playlistItems: [],
    downloadAuto: false,
    podcastTitle: null,
    playlistData:{
      form: {
        source_url: "",
      },
      rules: {
        source_url: [
          { type: 'url', max: 250, trigger: 'blur', message: 'Input URL has invalid format' },
        ],
      },
      serverErrors:{
        source_url: [],
      },
      inProgress: false,
    },
  }),
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    // при изменениях маршрута запрашиваем данные снова
    $route: 'fetchData',
    error(serverErrors){
      this.playlistData.inProgress = false
      fillFormErrors(serverErrors, [
          this.playlistData.serverErrors
      ])
    }
  },
  async created() {
    this.$store.commit('setBreadcrumbs', [
      {
        "title": "Home",
        "route": {name: "Home"}
      },
      {
        "title": this.podcastTitle,
        "route": null
      },
    ])
  },
  methods: {
    async createEpisode(){
      const valid = await formIsValid(this, 'createEpisodeForm')
      if (valid && this.playlistData.form.source_url.length !== 0){
        this.playlistData.inProgress = true;
        const response = await axios.post(`podcasts/${this.podcast.id}/episodes/`, this.playlistData.form);
        if (response){
          const newEpisode = response.data
          this.$message({type: 'success', message: `New episode #${newEpisode.id} was created`});
          if (!this.episodes.find((el) => el.id === newEpisode.id)){
            this.episodes.unshift(newEpisode)
          }
          this.playlistData.form.source_url = ''
        }
        this.playlistData.inProgress = false
      }
    },
  }
}
</script>
<style lang="scss">

</style>