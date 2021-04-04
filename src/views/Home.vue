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
                <div class="col-5 col-md-4 podcast-cover-container">
                    <img v-if="podcast.image_url" :src="podcast.image_url" :alt="podcast.name">
                    <img v-else src="../assets/img/cover-default.jpeg" :alt="podcast.name">
                </div>
                <div class="col-7 col-md-8">
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
      </div>

      <el-dialog :title="createEpisodeData.title" :visible.sync="dialogFormVisible" v-if="createEpisodeData.podcast">
        <el-form :model="createEpisodeForm">
          <el-form-item prop="source_url" :class="{'is-error': serverErrors.source_url.length > 0}">
            <el-input
                placeholder="Link to the source"
                v-model="createEpisodeForm.source_url"
            >
              <el-button slot="append" icon="el-icon-edit" type="success" @click="createEpisode"></el-button>
            </el-input>
            <small class="el-form-item__error" v-for="error in serverErrors.source_url" v-bind:key="error">
              {{error}}
            </small>
          </el-form-item>
        </el-form>
        <hr class="hr__row-episode">
        <div class="d-flex justify-content-center" v-if="createEpisodeData.inProgress">
          <img class="preload ml-1" src="../assets/img/down-arrow.gif" alt=""/>
        </div>
        <div v-else-if="createEpisodeData.episode">
          <div class="row row-episode">
            <div class="col-md-2 col-1 episode-content" @click="goToEpisode(createEpisodeData.episode, createEpisodeData.podcast.id)">
              <div class="episode-image">
                <img :src="createEpisodeData.episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
              </div>
            </div>
            <div class="col-md-9 col-9 episode-title episode-content" @click="goToEpisode(createEpisodeData.episode, createEpisodeData.podcast.id)">
              {{ createEpisodeData.episode.title }}
              <br/>
              <span
                  :class="{
                    'text-success': (createEpisodeData.episode.status === 'published'),
                    'text-danger': (createEpisodeData.episode.status === 'error'),
                    'text-info': (['new', 'downloading'].includes(createEpisodeData.episode.status)),
                    'text-gray': (createEpisodeData.episode.status === 'archived')
                  }">
                <small>{{humanStatus(createEpisodeData.episode.status)}}</small>
              </span>
            </div>
            <div class="col-md-1 col-1 text-right episode-controls">
              <img class="preload mr-1 mt-2" v-if="createEpisodeData.episode.status === 'downloading'" src="../assets/img/down-arrow.gif" alt=""/>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>

</template>

<script>
import {goToEpisode, humanStatus} from "@/utils/podcast";
import axios from "axios";

export default {
  name: "Home",
  data: () => ({
    loading: true,
    podcasts: [],
    dialogFormVisible: false,
    // todo: add url validation
    createEpisodeForm: {
      source_url: "",
    },
    createEpisodeData: {
      title: "",
      inProgress: false,
      podcast: null,
      episode: null
    },
    serverErrors:{
      source_url: [],
    }
  }),
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(serverErrors){
      // todo: move this logic to common part (helper function)
      if ( typeof serverErrors.details === 'object'){
        for (let key in this.serverErrors){
          let serverError = serverErrors.details[key]
          console.log('key', key, serverError)
          if (serverError){
            if (Array.isArray(serverError)){
              this.serverErrors[key] = serverError
            } else {
              this.serverErrors[key] = serverError
            }
          }
        }
        console.log(this.serverErrors)
      }
    }
  },
  async mounted(){
    console.log("MainLayout mounted")
    if (this.$store.getters.accessToken) {
      await this.$store.dispatch('getPodcasts')
      this.podcasts = this.$store.getters.podcasts
      this.loading = false
    }
  },
  methods:{
    openCreateEpisodeDialog(podcast){
      console.log("Creating episode for ", podcast)
      this.createEpisodeData = {
        title: `Creating episode for podcast "${podcast.name}"`,
        inProgress: false,
        podcast: podcast,
        episode: null
      }
      this.dialogFormVisible = true
    },
    async createEpisode(){
      this.createEpisodeData.inProgress = true
      this.serverErrors.source_url = []
      const response = await axios.post(`podcasts/${this.createEpisodeData.podcast.id}/episodes/`, this.createEpisodeForm)
      if (response){
        this.createEpisodeData.episode = response.data
      }
      this.createEpisodeData.inProgress = false
    },
    goToEpisode: goToEpisode,
    humanStatus: humanStatus,
  }
}
</script>
<style lang="scss">

.content-home .card-body{
  cursor: pointer;
}
.preload{
  width: 40px !important;
}
</style>