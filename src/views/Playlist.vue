<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-12">
        <div class="card create-episode-card">
          <div class="card-header">
            <h5 class="card-title">Add episodes from playlist</h5>
          </div>
          <div class="card-body">
              <el-form :model="playlistData.form" :rules="playlistData.rules" ref="playlistForm">
                <el-form-item prop="source_url" :class="{'is-error': playlistData.serverErrors.source_url.length > 0}">
                  <el-input
                      placeholder="Playlist Source Link"
                      v-model="playlistData.form.source_url"
                      :disabled="playlistData.inProgress"
                  >
                    <el-button slot="append" icon="el-icon-view" type="success" @click="fetchPlaylist"></el-button>
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
                  v-for="item in playlistItems"
                  :key="item.id">
                <div class="row row-episode">

                  <div class="col-md-1 col-1 episode-content">
                    <el-checkbox label="Online activities" v-model="item.checked"></el-checkbox>
                  </div>
                  <div class="col-md-2 col-2 episode-content">
                    <div class="episode-image">
                      <img :src="item.thumbnail" alt="Circle Image" class="img-circle img-no-padding img-responsive">
                    </div>
                  </div>
                  <div class="col-md-9 col-9 episode-title episode-content">
                    {{ item.title }}
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

export default {
  name: 'PodcastDetails',
  components: {InputErrors},
  data: () => ({
    loading: true,
    podcast: null,
    playlistTitle: [],
    playlistItems: [],
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
    // // при изменениях маршрута запрашиваем данные снова
    // $route: 'fetchData',
    error(serverErrors){
      this.playlistData.inProgress = false
      fillFormErrors(serverErrors, [
          this.playlistData.serverErrors
      ])
    }
  },
  async created() {
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
      if (this.$route.query.playlist){
        this.playlistData.form.source_url = this.$route.query.playlist
        await this.fetchPlaylist()
      }
      this.loading = false;
    },
    async fetchPlaylist(){
      const valid = await formIsValid(this, 'playlistForm')
      if (valid && this.playlistData.form.source_url.length !== 0){
        // todo: fix validation problems
        this.playlistData.inProgress = true;
        this.playlistTitle = "Test playlist 1"
        this.playlistItems = []

        // const response = await axios.post(`playlist/`, this.playlistData.form);
        // if (response.data){
        //   this.playlistTitle = response.data.title
        //   this.playlistItems = response.data.entries
        // }
        // this.playlistData.inProgress = false
      }
    },
  }
}
</script>
<style lang="scss">

</style>