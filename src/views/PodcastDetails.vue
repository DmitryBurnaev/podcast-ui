<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-md-4">
        <div class="card card-podcast-summary  card-user">
          <div class="image card-background">
            <img src="../assets/img/podcast-background.jpg" alt="podcast-background" >
          </div>
          <div class="card-body">
            <div class="author">
              <img v-if="podcast.image_url" class="avatar border-gray" :src="podcast.image_url" :alt="podcast.name">
              <img v-else class="avatar border-gray" src="../assets/img/cover-default.jpeg" :alt="podcast.name">
              <h5 class="podcast-title">{{ podcast.name }}</h5>
            </div>
            <p class="description text-center"> {{ podcast.description }} </p>
          </div>
          <div class="card-footer">
            <hr>
            <div class="button-container">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-12 ml-auto text-center" >
                  <h5>
                    {{ episodes.length }}<br>
                    <small>Episodes</small>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card card-podcast card-user">
          <div class="card-header">
            <h5 v-if="podcast.id" class="card-title">Edit Podcast</h5>
            <h5 v-else class="card-title">Create Podcast</h5>
            <div class="header-controls d-block d-sm-none">
              <el-switch
                v-model="showEditOnSmall"
                active-color="rgb(107, 208, 152)"
                inactive-color="rgb(203, 203, 203)"
              >
              </el-switch>
            </div>
            </div>
          <div class="card-body" :class="{'hide-on-small': !showEditOnSmall}">
            <el-form :model="podcastEdit.form" :rules="podcastEdit.rules" ref="podcastEditForm">
              <div class="row">
                <div class="col-md-8">
                  <div class="form-group  text-left">
                    <label>Name</label>
                    <el-form-item prop="name" :class="{'is-error': podcastEdit.serverErrors.name.length > 0}">
                      <el-input placeholder="Podcast Name" v-model="podcastEdit.form.name"></el-input>
                      <input-errors :errors="podcastEdit.serverErrors.name"></input-errors>
                    </el-form-item>
                  </div>
                </div>
                <div class="col-md-4 text-left">
                  <div class="form-group">
                    <label>Created At</label>
                    <el-input
                        placeholder="Created AT"
                        :value="podcast.created_at | date('datetime')"
                        disabled
                    >
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 text-left">
                  <div class="form-group">
                    <label>RSS link</label>
                    <el-input
                        class="rss-link-input"
                        placeholder="Podcast RSS link"
                        v-model="podcast.rss_link"
                        disabled
                    >
                      <el-button slot="append" icon="el-icon-copy-document" type="success" @click="copyToClipboard(podcast.rss_link)"></el-button>
                    </el-input>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 text-left">
                  <div class="form-group">
                    <label>Description</label>
                    <el-form-item prop="description" :class="{'is-error': podcastEdit.serverErrors.description.length > 0}">
                      <el-input type="textarea" rows="6" placeholder="Description" v-model="podcastEdit.form.description"></el-input>
                      <input-errors :errors="podcastEdit.serverErrors.description"></input-errors>
                    </el-form-item>
                  </div>
                </div>
              </div>

              <div class="row mb-2" v-if="!podcast.id">
                <div class="col-md-4 text-left">
                  <el-button type="info" plain @click="createPodcast" icon="el-icon-edit">Create</el-button>
                </div>
              </div>
              <div class="row mb-2" v-else>
                <div class="col-4 text-left">
                  <el-button type="info" plain @click="updatePodcast" icon="el-icon-edit">Update</el-button>
                </div>
                <div class="col-4">
                  <div class="d-none d-sm-block text-center">
                    <el-button type="info" plain @click="generateRSS" icon="el-icon-magic-stick">
                      Regenerate RSS
                    </el-button>
                  </div>
                </div>
                <div class="col-4 text-right">
                  <el-button type="info" plain @click="deletePodcast" icon="el-icon-delete"></el-button>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="podcast.id">
      <div class="col-12">
        <div class="card create-episode-card">
          <div class="card-header">
            <h5 class="card-title">Create new episode</h5>
            <div class="header-controls">
              <el-switch
                v-model="podcastEdit.form.download_automatically"
                active-color="rgb(107, 208, 152)"
                inactive-color="rgb(203, 203, 203)"
                inactive-text="Auto Download"
                @change="updatePodcast('download_automatically')"
              >
              </el-switch>
            </div>
          </div>
          <div class="card-body">
              <el-form :model="episodeCreation.form" :rules="episodeCreation.rules" ref="createEpisodeForm" @submit.native.prevent="createEpisode">
                <el-form-item prop="source_url" :class="{'is-error': episodeCreation.serverErrors.source_url.length > 0}">
                  <el-input
                      placeholder="Episode Source Link"
                      v-model="episodeCreation.form.source_url"
                      :disabled="episodeCreation.inProgress"
                  >
                    <el-button slot="append" icon="el-icon-edit" type="success" @click="createEpisode"></el-button>
                  </el-input>
                  <input-errors :errors="episodeCreation.serverErrors.source_url"></input-errors>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
    </div>
    <div class="row" v-if="episodes.length > 0">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Episodes</h4>
          </div>
          <div class="card-body">
            <ul class="list-unstyled team-members">
              <li
                  v-for="episode in episodes"
                  :key="episode.id">
                <div class="row row-episode">
                  <div class="col-md-1 col-3 episode-content" @click="goToEpisode(episode)">
                    <div class="episode-image">
                      <img :src="episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
                    </div>
                  </div>
                  <div class="col-md-9 col-9 episode-title episode-content" @click="goToEpisode(episode)">
                    {{ episode.title }}
                    <br/>
                    <span
                        :class="{
                          'text-danger': (episode.status === 'error'),
                          'text-success': (['new', 'downloading', 'published'].includes(episode.status)),
                          'text-gray': (episode.status === 'archived')
                        }">
                      <small>{{humanStatus(episode.status)}}</small>
                    </span>
                  </div>
                  <div class="col-md-2 episode-controls">
                      <div  v-if="episode.status === 'downloading'" class="btn-outline-gray btn-icon">
                        <i class="el-icon-loading"></i>
                      </div>
                      <div
                          v-if="episode.status !== 'downloading'"
                          class="btn-outline-gray btn-icon"
                          @click="deleteEpisode(episode)">
                        <i class="nc-icon nc-simple-remove"></i>
                      </div>
                      <div
                          v-if="episode.status === 'new' || episode.status === 'error'"
                          class="btn-outline-gray btn-icon"
                          @click="downloadEpisode(episode)">
                        <i class="nc-icon nc-cloud-download-93"></i>
                      </div>
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
import {
  deleteEpisode,
  downloadEpisode,
  fillFormErrors,
  humanStatus,
  formIsValid,
  goToEpisode,
  deletePodcast,
  copyToClipboard
} from "@/utils/podcast";
import InputErrors from "@/components/InputErrors";

export default {
  name: 'PodcastDetails',
  components: {InputErrors},
  data: () => ({
    loading: true,
    podcast: null,
    episodes: [],
    downloadAuto: false,
    podcastTitle: null,
    showEditOnSmall: false,
    podcastEdit:{
      form: {
        name: '',
        description: '',
        download_automatically: false,
      },
      rules: {
        name: [
          {min: 1, max: 32, message: 'Name should be from 1 tp 32 symbols', trigger: 'blur'}
        ],
        description: [
          {min: 0, max: 180, message: 'Description should be less than 100 symbols', trigger: 'blur'}
        ],
      },
      serverErrors:{
        name: [],
        description: [],
      },
      inProgress: false,
    },
    episodeCreation:{
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
      this.episodeCreation.inProgress = false
      fillFormErrors(serverErrors, [
          this.podcastEdit.serverErrors,
          this.episodeCreation.serverErrors
      ])
    }
  },
  async created() {
    await this.fetchData()
    if (this.podcast.id){
      this.podcastEdit.form.name = this.podcast.name;
      this.podcastEdit.form.description = this.podcast.description;
      this.podcastEdit.form.download_automatically = this.podcast.download_automatically;
      this.podcastTitle = this.podcast.name;
    } else {
      this.showEditOnSmall = true;
      this.podcastTitle = "New podcast"
    }
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
    async fetchData() {
      this.loading = true
      const podcastID = this.$route.params.id
      if (podcastID && podcastID !== 'create'){
        this.podcast = await this.$store.dispatch('getPodcastDetails', podcastID)
        this.episodes = await this.$store.dispatch('getEpisodes', podcastID)
      } else {
        this.podcast = {}
      }
      this.loading = false
    },
    async createPodcast(){
      const valid = await formIsValid(this, 'podcastEditForm')
      if (valid){
        const response = await axios.post(`podcasts/`, this.podcastEdit.form);
        if (response){
          this.$message({type: 'success', message: 'Podcast successful created.'});
          setTimeout(() => {router.push(`/podcasts/${response.data.id}`).then(() => {})}, 500)
        }
      }
    },
    async updatePodcast(target){
      const valid = await formIsValid(this, 'podcastEditForm')
      if (valid){
        const response = await axios.patch(`podcasts/${this.podcast.id}/`, this.podcastEdit.form);
        this.podcast = response.data
        if (target !== 'download_automatically'){
          this.$message({type: 'success', message: 'Podcast successful updated.'});
        }
      }
    },
    async generateRSS(){
      await axios.put(`podcasts/${this.podcast.id}/generate_rss/`);
      this.$message({type: 'success', message: 'RSS will be regenerated soon.'});
    },
    async createEpisode(){
      const valid = await formIsValid(this, 'createEpisodeForm')
      const sourceURL = this.episodeCreation.form.source_url
      if (valid && sourceURL.length !== 0){
        if (sourceURL.indexOf("playlist") !== -1){
          await this.$router.push({name: 'playlist', params: {podcastID: this.podcast.id}, query: {playlist: sourceURL}})
        }
        else {
          this.episodeCreation.inProgress = true;
          const response = await axios.post(`podcasts/${this.podcast.id}/episodes/`, this.episodeCreation.form);
          if (response){
            const newEpisode = response.data
            this.$message({type: 'success', message: `New episode #${newEpisode.id} was created`});
            if (!this.episodes.find((el) => el.id === newEpisode.id)){
              this.episodes.unshift(newEpisode)
            }
            this.episodeCreation.form.source_url = ''
          }
          this.episodeCreation.inProgress = false
        }
      }
    },
    deletePodcast(){
      deletePodcast(this.podcast, () => {router.push(`/podcasts`).then(() => {})})
    },
    downloadEpisode: downloadEpisode,
    humanStatus: humanStatus,
    deleteEpisode(episode){
      deleteEpisode(episode, () => {
        const index = this.episodes.findIndex((el) => el.id === episode.id)
        this.episodes.splice(index, 1)
      })
    },
    goToEpisode(episode){
      goToEpisode(episode, this.podcast.id)
    },
    goToLink(link){
       window.open(link, "_blank");
    },
    copyToClipboard: copyToClipboard
  }
}
</script>
<style lang="scss">
.podcast-title{
  color: #7b7979;
  font-weight: bold;
}
.hr__row-episode{
  margin-top: 0.5rem;
}
.episode-controls{
  margin-top: -7px;
  i{
    font-weight: bold;
    font-size: 14px !important;
  }
  @media (max-width: 576px) {
    position: absolute !important;
    right: 10px;
    top: -4px;
    width: initial;
    padding: initial;
  }
  .preload{
    width: 20px;
  }
}
.card-podcast-summary{
  height: 500px;
  @media (max-width: 576px) {
    min-height: 400px;
    height: initial;
  }
  .card-body{
    @media (max-width: 576px) {
      min-height: initial;
    }
  }
}
.card-header{
  position: relative;
  .header-controls{
    position: absolute;
    right: 15px;
    top: 24px;
    @media (max-width: 576px) {
      top: 20px;
    }
    .el-switch__label{
      @media (max-width: 576px) {
        margin-right: -40px;
        margin-top: -42px;
      }
      span{
        @media (max-width: 576px) {
          font-size: 11px;
        }
      }
      &.is-active{
        color: #A1A4A9 !important;
      }
    }
    div{
      margin-left: 5px;
    }
  }
}

.create-episode-card{
  .form-group{
    margin-top: 10px;
  }
  .card-body{
    padding-top: 0
  }
  img.preload{
    width: 20px;
  }
  .card-header{
    .card-title{
      margin-top: 5px;
    }
  }
}
.podcast-info-item{
  float: left;
  font-size: 16px;
}
.rss-link-input{
  input{
    cursor: alias !important;
  }
}
</style>