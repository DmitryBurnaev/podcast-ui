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

      <el-dialog :title="createEpisodeData.title" :visible.sync="createEpisodeData.dialog" v-if="createEpisodeData.podcast">
        <el-form :model="createEpisodeData.form" :rules="createEpisodeData.rules" ref="createEpisodeForm">
          <el-form-item prop="source_url" :class="{'is-error': createEpisodeData.serverErrors.source_url.length > 0}">
            <el-input
                placeholder="Link to the source"
                v-model="createEpisodeData.form.source_url"
                :disabled="createEpisodeData.inProgress"
            >
              <el-button slot="append" icon="el-icon-edit" type="success" @click="createEpisode"></el-button>
            </el-input>
            <small class="el-form-item__error" v-for="error in createEpisodeData.serverErrors.source_url" v-bind:key="error">
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
                <small>{{ humanStatus(createEpisodeData.episode.status) }}</small>
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
import {goToEpisode, humanStatus, fillFormErrors, formIsValid} from "@/utils/podcast";
import axios from "axios";

export default {
  name: "Home",
  data: () => ({
    loading: true,
    podcasts: [],
    createEpisodeData:{
      dialog: false,
      form: {
        source_url: "",
      },
      rules: {
        source_url: [
          { type: 'url', required: true, trigger: 'change' },
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
      this.createEpisodeData.inProgress = false
      fillFormErrors(serverErrors, this.createEpisodeData.serverErrors)
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
      this.createEpisodeData.title = `Creating episode for podcast "${podcast.name}"`
      this.createEpisodeData.inProgress = false
      this.createEpisodeData.podcast = podcast
      this.createEpisodeData.episode = null
      this.createEpisodeData.dialog = true
      this.createEpisodeData.serverErrors.source_url = []
    },
    async createEpisode(){
      this.createEpisodeData.serverErrors.source_url = []
      const valid = await formIsValid(this, 'createEpisodeForm')
      if (valid){
        this.createEpisodeData.inProgress = true
        const response = await axios.post(`podcasts/${this.createEpisodeData.podcast.id}/episodes/`, this.createEpisodeData.form)
        if (response){
          this.createEpisodeData.episode = response.data
        }
        this.createEpisodeData.inProgress = false
      }
    },
    goToEpisode: goToEpisode,
    humanStatus: humanStatus,
  }
}
</script>
<style lang="scss">

.content-home{
  .preload{
    width: 40px;
  }
  .card-body{
    cursor: pointer;
  }
}
</style>