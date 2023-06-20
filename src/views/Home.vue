<template>
    <div class="content content-home">
      <div class="row">
        <div
            class="col-lg-3 col-md-6 col-sm-6"
            v-for="podcast in podcasts" :key="podcast.id"
        >
            <div class="card card-stats">
            <router-link
                tag="div"
                class="card-body"
                :to="{name: 'podcastDetails', params: {'id': podcast.id}}"
            >
              <div class="row">
                <div class="col-4 col-md-4 podcast-cover-container">
                    <img v-if="podcast.image_url" :src="podcast.image_url" :alt="podcast.name" @error="defaultImage">
                    <img v-else src="../assets/img/cover-default.jpeg" :alt="podcast.name">
                </div>
                <div class="col-8 col-md-8">
                  <div class="numbers">
                    <p class="card-category">{{podcast.name}}</p>
                    <p class="card-title">{{podcast.episodes_count || 0}}</p>
                  </div>
                </div>
              </div>

            </router-link>

            <div class="card-footer ">
              <hr>
              <div class="stats cursor-pointer" @click="openCreateEpisodeDialog(podcast)">
                <i class="nc-icon nc-tap-01"></i>
                Add new episode
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 ">
            <div class="card card-stats card-add-podcast">
            <router-link
                tag="div"
                class="card-body"
                :to="{name: 'podcastCreate'}"
            >
              <div class="row">
                <div class="col-4 col-md-4 podcast-cover-container">
                    <img src="../assets/img/cover-default.jpeg" alt="Add Podcast" style="opacity: 0">
                </div>
                <div class="col-8 col-md-8">
                  <div class="numbers">
                    <p class="card-category">Add New</p>
                    <p class="card-title">-</p>
                  </div>
                </div>
              </div>
            <div class="card-footer ">
              <hr>
              <div class="stats cursor-pointer">
                <i class="nc-icon nc-tap-01"></i>
                Add new podcast
              </div>
            </div>
            </router-link>

          </div>
        </div>
      </div>

      <el-dialog :title="episodeCreation.title" :visible.sync="episodeCreation.dialog" v-if="episodeCreation.podcast">
        <el-form :model="episodeCreation.form" :rules="episodeCreation.rules" ref="createEpisodeForm" @submit.native.prevent="createEpisode">
          <el-form-item prop="source_url" :class="{'is-error': episodeCreation.serverErrors.source_url.length > 0}">
            <el-input
                placeholder="Link to the source"
                v-model="episodeCreation.form.source_url"
                :disabled="episodeCreation.inProgress"
            >
              <el-button slot="append" icon="el-icon-edit" type="success" @click="createEpisode"></el-button>
            </el-input>
            <input-errors :errors="episodeCreation.serverErrors.source_url"></input-errors>
          </el-form-item>
        </el-form>
        <hr class="hr__row-episode">
        <div class="d-flex justify-content-center" v-if="episodeCreation.inProgress">
          <img class="preload ml-1" src="../assets/img/down-arrow.gif" alt=""/>
        </div>
        <div v-else-if="episodeCreation.episode">
          <div class="row row-episode">
            <div class="col-md-2 col-1 episode-content" @click="goToEpisode(episodeCreation.episode, episodeCreation.podcast.id)">
              <div class="episode-image">
                <img :src="episodeCreation.episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
              </div>
            </div>
            <div class="col-md-9 col-9 episode-title episode-content" @click="goToEpisode(episodeCreation.episode, episodeCreation.podcast.id)">
              {{ episodeCreation.episode.title }}
              <br/>
              <span
                  :class="{
                    'text-success': (episodeCreation.episode.status === 'PUBLISHED'),
                    'text-danger': (episodeCreation.episode.status === 'ERROR'),
                    'text-info': (['NEW', 'DOWNLOADING'].includes(episodeCreation.episode.status)),
                    'text-gray': (episodeCreation.episode.status === 'ARCHIVED')
                  }">
                <small>{{ humanStatus(episodeCreation.episode.status) }}</small>
              </span>
            </div>
            <div class="col-md-1 col-1 text-right episode-controls">
              <img class="preload mr-1 mt-2" v-if="episodeCreation.episode.status === 'DOWNLOADING'" src="../assets/img/down-arrow.gif" alt=""/>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>

</template>

<script>
import {
    goToEpisode,
    humanStatus,
    fillFormErrors,
    formIsValid,
    isPlaylistURL,
    defaultImage,
} from "@/utils/podcast";
import InputErrors from "@/components/InputErrors";
import axios from "axios";

export default {
  name: "HomePage",
  components: {InputErrors},
  data: () => ({
    loading: true,
    podcasts: [],
    episodeCreation:{
      dialog: false,
      form: {
        source_url: "",
      },
      rules: {
        source_url: [
          { type: 'url', required: true, trigger: 'blur', message: 'Input URL has invalid format' },
        ],
      },
      serverErrors:{
        source_url: [],
      },
      inProgress: false,
      podcast: null,
      episode: null,
    },
  }),
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(serverErrors){
      this.episodeCreation.inProgress = false
      fillFormErrors(serverErrors, [this.episodeCreation.serverErrors])
    }
  },
  async mounted(){
    console.log("MainLayout mounted")
    if (this.$store.getters.accessToken) {
      await this.$store.dispatch('getPodcasts')
      this.podcasts = this.$store.getters.podcasts
      this.loading = false
    }
    this.$store.commit('setBreadcrumbs', [
      {
        "title": "Home",
        "route": null
      },
    ])
  },
  methods:{
    defaultImage,
    openCreateEpisodeDialog(podcast){
      this.episodeCreation.title = `Add episode to "${podcast.name}"`
      this.episodeCreation.inProgress = false
      this.episodeCreation.podcast = podcast
      this.episodeCreation.episode = null
      this.episodeCreation.dialog = true
      this.episodeCreation.serverErrors.source_url = []
    },
    async createEpisode(){
      this.episodeCreation.serverErrors.source_url = []
      const valid = await formIsValid(this, 'createEpisodeForm')
      const sourceURL = this.episodeCreation.form.source_url
      if (valid && sourceURL.length !== 0){
        if (this.isPlaylistURL(sourceURL)){
          await this.$router.push({name: 'playlist', params: {podcastID: this.episodeCreation.podcast.id}, query: {playlist: sourceURL}})
        }
        else {
          this.episodeCreation.inProgress = true
          const response = await axios.post(`podcasts/${this.episodeCreation.podcast.id}/episodes/`, this.episodeCreation.form)
          if (response){
            this.episodeCreation.episode = response.data.payload
          }
          this.episodeCreation.inProgress = false
        }
      }
    },
    goToEpisode: goToEpisode,
    humanStatus: humanStatus,
    isPlaylistURL: isPlaylistURL,
  }
}
</script>
<style lang="scss">

  .content-home{
    .preload{
      width: 40px;
    }
    .card{
      .card-body{
        cursor: pointer;
      }
      .card-footer{
        overflow-x: hidden;
        .stats{
          min-width: 173px;
        }
      }
    }
    .card-add-podcast{
      background-color: inherit;
      border: 1px dashed;
      box-shadow: none;
    }
  }
</style>