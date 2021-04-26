<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-12">
        <div class="card create-episode-card">
          <div class="card-header">
            <h5 class="card-title">Add episodes from playlist</h5>
          </div>
          <div class="card-body">
              <el-form :model="playlistSrc.form" :rules="playlistSrc.rules" ref="playlistForm" @submit="fetchPlaylist">
                <el-form-item prop="source_url" :class="{'is-error': playlistSrc.serverErrors.source_url.length > 0}">
                  <el-input
                      placeholder="Playlist Source Link"
                      v-model="playlistSrc.form.source_url"
                      :disabled="playlistSrc.inProgress"
                  >
                    <el-button slot="append" icon="el-icon-view" type="success" ref="tbtn" @click="fetchPlaylist"></el-button>
                  </el-input>
                  <input-errors :errors="playlistSrc.serverErrors.source_url"></input-errors>
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
            <h4 class="card-title">{{playlistTitle}} <i class="el-icon-caret-right"></i> {{podcast.name}}</h4>
            <div class="controls">
              <div class="icon-container">
                <i v-if="playlistDownloading" class="el-icon-loading"></i>
              </div>
              <button
                  type="button"
                  class="el-button el-button--info is-plain"
                  @click="createEpisodes"
                  :disabled="playlistDownloading">
                <i class="el-icon-edit"></i><span>Add chosen</span>
              </button>
            </div>
          </div>
          <div class="card-body">
            <ul class="list-unstyled team-members">
              <li
                  v-for="item in playlistItems"
                  :key="item.id">
                <div class="row row-episode">

                  <div class="col-md-1 col-1 text-center pt-2">
                    <el-switch
                      v-model="item.checked"
                      active-color="rgb(107, 208, 152)"
                      inactive-color="rgb(203, 203, 203)"
                      :disabled="playlistDownloading"
                    >
                    </el-switch>
                    <div class="item-status">
                      <i v-if="item.downloading" class="el-icon-loading"></i>
                      <i v-else-if="item.downloaded" class="el-icon-finished"></i>
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
// import axios from "axios";
import {fillFormErrors, formIsValid} from "@/utils/podcast";
import InputErrors from "@/components/InputErrors";
// import axios from "axios";
import app from "@/main";

export default {
  name: 'PodcastDetails',
  components: {InputErrors},
  data: () => ({
    loading: true,
    podcast: null,
    playlistTitle: [],
    playlistItems: [],
    playlistDownloading: false,
    playlistSrc:{
      formRef: 'playlistForm',
      formValid: null,
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
      console.log('aaa', this)
      if (this.$route.query.playlist){
        this.playlistSrc.form.source_url = this.$route.query.playlist
        // this.playlistSrc.form.validate()
        // we can't use `formIsValid` method in the `created` step
        // let formValid = true
        // // eslint-disable-next-line no-debugger
        // debugger;
        //   this.$nextTick(() => {
        //     // Code that will run only after the
        //     // entire view has been rendered
        //     console.log('bbbb', this, this.$refs['playlistForm'], this.playlistSrc.formRef, )
        //   })

        // try {
        //   console.log(this.$refs, this.playlistSrc.formRef)
        //   await this.$refs[this.playlistSrc.formRef].validate()
        // } catch (err) {
        //   console.log('Form is invalid', err)
        //   formValid = false
        // }
        this.playlistSrc.formValid = true;
        await this.fetchPlaylist()
      }
      this.loading = false;
    },
    async fetchPlaylist(){
      // if (formValid === undefined){
      //
      //
      if (this.playlistSrc.formValid === null){
        this.playlistSrc.formValid = await formIsValid(this, 'playlistForm')
      }
      // const formValid = await formIsValid(this, 'playlistForm')
      // console.log('formValid', formValid)
      if (this.playlistSrc.formValid && this.playlistSrc.form.source_url.length !== 0){
        // todo: fix validation problems
        this.playlistSrc.inProgress = true;
        this.playlistTitle = "Test playlist 1"
        this.playlistItems = []

        // const response = await axios.post(`playlist/`, this.playlistData.form);
        // if (response.data){
        //   this.playlistTitle = response.data.title
        //   this.playlistItems = response.data.entries
        // }
        this.playlistSrc.inProgress = false
      }
       this.playlistSrc.formValid = null
    },
    async createEpisodes() {
      this.playlistDownloading = true
      for (let index in this.playlistItems){
        let item = this.playlistItems[index];
        console.log(`Creating episode ${item.url}`)
        item.downloading = true;
        // const response = await axios.post(`podcasts/${this.podcast.id}/episodes/`, {source_url: item.url});
        // if (! response){
        //   item.failed = true
        // }
        // item.downloading = false
      }
      // this.playlistDownloading = false
      app.$message({type: 'info', message: `Episodes from playlist ${this.playlistItems}`, showClose: true});
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