<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-12">
        <div class="card create-episode-card">
          <div class="card-header">
            <h5 class="card-title">Add episodes from playlist</h5>
          </div>
          <div class="card-body">
              <el-form :model="playlistSrc.form" :rules="playlistSrc.rules" ref="playlistForm" @submit.native.prevent="fetchPlaylist">
                <el-form-item prop="source_url" :class="{'is-error': playlistSrc.serverErrors.url.length > 0}">
                  <el-input
                      placeholder="Playlist Source Link"
                      v-model="playlistSrc.form.url"
                      :disabled="playlistSrc.inProgress"
                  >
                    <el-button v-if="!playlistSrc.inProgress" slot="append" icon='el-icon-view' @click="fetchPlaylist"></el-button>
                    <el-button v-else slot="append" icon="el-icon-loading" title="Playlist wasn't loaded yet"></el-button>
                  </el-input>
                  <input-errors :errors="playlistSrc.serverErrors.url"></input-errors>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
    </div>
    <div class="row" v-if="playlistItems.length > 0">
      <div class="col-12">
        <div class="card">
          <div class="card-header card-header-with-controls">
            <h4 class="card-title">
              <span v-if="!playlistSrc.inProgress && playlistTitle">{{playlistTitle}}</span>
              <i class="el-icon-caret-right"></i> <!-- " > " -->
              {{podcast.name}}
            </h4>
            <div class="controls">
              <div class="icon-container">
                <i v-if="episodesCreating" class="el-icon-loading"></i>
              </div>
              <button
                  type="button"
                  class="el-button el-button--info is-plain"
                  @click="createEpisodes"
                  :disabled="episodesCreating || playlistSrc.inProgress"
              >
                <i class="el-icon-edit"></i><span>Add chosen</span>
              </button>
            </div>
          </div>
          <div class="card-body">
            <ul class="list-unstyled team-members" v-if="!playlistSrc.inProgress">
              <li
                  v-for="item in playlistItems"
                  :key="item.id">
                <div class="row row-episode">

                  <div class="col-md-1 col-1 text-center pt-2">
                    <el-switch
                      v-model="item.checked"
                      active-color="rgb(107, 208, 152)"
                      inactive-color="rgb(203, 203, 203)"
                      :disabled="episodesCreating || item.downloaded"
                    >
                    </el-switch>
                    <div class="item-status">
                      <i v-if="item.downloading" class="el-icon-loading" title="episode is creating now"></i>
                      <i v-else-if="item.downloaded" class="el-icon-finished" title="episode successfully created"></i>
                      <i v-else-if="item.failed" class="el-icon-document-delete invalid" title="episode creation failed"></i>
                    </div>
                  </div>
                  <div class="col-md-2 col-2 image-container">
                    <img :src="item.thumbnail_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
                  </div>
                  <div class="col-md-9 col-9 item-details">
                    <a :href="item.url" target="_blank" :title="item.title"> {{ item.title }}</a>
                    <br/>
                    <span class="text-muted">
                      <small>{{item.description}}</small>
                    </span>
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
import {fillFormErrors, formIsValid} from "@/utils/podcast";
import InputErrors from "@/components/InputErrors";
import axios from "axios";
import app from "@/main";

export default {
  name: 'PlaylistView',
  components: {InputErrors},
  data: () => ({
    loading: true,
    podcast: null,
    playlistTitle: [],
    playlistItems: [],
    episodesCreating: false,
    playlistSrc:{
      formRef: 'playlistForm',
      formValid: null,
      form: {
        url: "",
      },
      rules: {
        url: [
          { type: 'url', max: 250, trigger: 'blur', message: 'Input URL has invalid format' },
        ],
      },
      serverErrors:{
        url: [],
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
    // // при изменениях маршрута запрашиваем данные снова
    $route: 'fetchData',
    error(serverErrors){
      this.playlistSrc.inProgress = false
      fillFormErrors(serverErrors, [
          this.playlistSrc.serverErrors
      ])
    }
  },
  async mounted() {
    await this.fetchData()
    this.$store.commit('setBreadcrumbs', [
      {
        "title": "Home",
        "route": {name: "Home"}
      },
      {
        "title": this.podcast.name,
        "route": {
          name: "podcastDetails",
          params: {
            id: this.podcast.id
          }
        }
      },
      {
        "title": "playlist",
        "route": null
      },
    ])
  },
  methods: {
    async fetchData() {
      const podcastID = this.$route.params.podcastID
      this.podcast = await this.$store.dispatch('getPodcastDetails', podcastID)
      this.loading = false;
      if (this.$route.query.playlist){
        this.playlistSrc.form.url = this.$route.query.playlist
        this.playlistSrc.formValid = true;
        await this.fetchPlaylist()
      }
    },
    async fetchPlaylist(){
      this.playlistSrc.inProgress = true;
      if (this.playlistSrc.formValid === null){
        this.playlistSrc.formValid = await formIsValid(this, 'playlistForm')
      }
      if (this.playlistSrc.formValid && this.playlistSrc.form.url.length !== 0){
        this.playlistItems = []
        const response = await axios.get(`playlist/?url=${this.playlistSrc.form.url}`);
        if (response.data.payload){
          this.playlistTitle = response.data.payload.title
          let playlistItems = response.data.payload.entries
          playlistItems.forEach((item) => {
            item.checked = false
            item.downloaded = false
            item.downloading = false
          })
          this.playlistItems = playlistItems
        }
      }
      this.playlistSrc.inProgress = false
      this.playlistSrc.formValid = null
    },
    async createEpisodes() {
      this.episodesCreating = true
      let createdEpisodesCount = 0
      for (let index in this.playlistItems){
        let item = this.playlistItems[index];
        if ( item.checked && !item.downloaded ){
          console.log(`Creating episode ${item.url}`)
          item.downloading = true;
          const response = await axios.post(`podcasts/${this.podcast.id}/episodes/`, {source_url: item.url});
          if (! response){
            item.failed = true
          } else {
            item.downloaded = true
            createdEpisodesCount += 1
          }
          item.downloading = false
        }
        else {
          console.log(`Episode ${item.url} not checked or already created `)
        }
      }
      this.episodesCreating = false
      if (createdEpisodesCount > 0){
        const msg = `Successful added ${createdEpisodesCount} episode to podcast '${this.podcast.name}'`
        app.$message({type: 'success', message: msg, showClose: true});
      }

    }
  }
}
</script>
<style lang="scss">
  .image-container{
    padding-left: 0;
    padding-right: 0;
    img{
      width: 85%;
    }
    text-align: center;
  }
  .item-details{
    a{
      color: #55a87a;
      text-decoration: none;
    }
  }
  .controls{
    .icon-container{
      float: left;
      margin-right: 10px;
      padding-top: 5px;
      font-size: 20px;
    }
  }
  .item-status{
    font-size: 24px;
    margin-top: 5px;
  }
</style>