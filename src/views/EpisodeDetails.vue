<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-md-4">
        <div class="card card-podcast card-user">
          <div class="image card-background" >
            <img v-if="podcast.image_url" :src="podcast.image_url" :alt="podcast.name">
            <img v-else src="../assets/img/cover-default.jpeg" :alt="podcast.name">
          </div>
          <div class="card-body">
            <div class="author">
                <img class="avatar avatar-episode border-gray" :src="episode.image_url" alt="...">
                <p class="title">{{ episode.title }}</p>
            </div>
            <div class="episode-content text-center mt-3">
              <Audio v-if="episode.status === 'published'" :src="episode.remote_url" :length="episode.length" ></Audio>
              <div v-else class="episode-status text-center">
                <div  v-if="episode.status === 'downloading'" class="icon-preload">
                  <i class="el-icon-loading"></i>
                </div>
                <p> {{ humanStatus(episode.status) }}</p>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <hr>
            <div class="button-container">
                  <div class="row">
                    <div class="col-lg-5 col-md-5 col-5 ml-auto text-center">
                      <h5>{{ episode.length | length }}<br><small>Length</small></h5>
                    </div>
                    <div class="col-lg-2 col-md-2 col-2 ml-auto pr-1 pl-1 text-center">
                      <span class="episode-status-icon">
                        <i
                            class="nc-icon text-success"
                            :title="humanStatus(episode.status)"
                            :class="{
                              'nc-tap-01 cursor text-danger': episode.status === 'error',
                              'nc-tap-01 cursor': episode.status === 'new',
                              'nc-cloud-download-93': episode.status === 'downloading',
                              'nc-headphones': episode.status === 'published',
                            }"
                            @click="downloadEpisode(episode)"
                        >
                        </i>
                      </span>
                    </div>
                    <div class="col-lg-5 col-md-5 col-5 ml-auto mr-auto text-center">
                      <h5>{{ episode.file_size | size }} MB<br><small>Size</small></h5>
                    </div>
                  </div>
            </div>
          </div>
        </div>
        <div class="card card-episode-details">
          <div class="card-header">
            <h4 class="card-title"  @click="showDetailsOnSmall = !showDetailsOnSmall">Episode details</h4>
            <div class="header-controls d-block d-sm-none">
              <el-switch
                v-model="showDetailsOnSmall"
                active-color="rgb(107, 208, 152)"
                inactive-color="rgb(203, 203, 203)"
              >
              </el-switch>
            </div>
          </div>
          <div class="card-body" :class="{'hide-on-small': !showDetailsOnSmall}">
            <ul class="list-unstyled episode-details">
              <li>
                <div class="row">
                  <div class="col-md-2 col-2">
                    <div class="icon-episode-detail text-center icon-warning"><i class="nc-icon nc-ruler-pencil text-success"></i></div>
                  </div>
                  <div class="col-md-7 col-7">
                    {{ episode.created_at | date}}
                    <br />
                    <span class="text-secondary"><small>Created At</small></span>
                  </div>
                </div>
              </li>
              <li v-if="episode.published_at">
                <div class="row">
                  <div class="col-md-2 col-2">
                    <div class="icon-episode-detail text-center"><i class="nc-icon nc-spaceship text-info"></i></div>
                  </div>
                  <div class="col-md-7 col-7">
                    {{ episode.published_at | date}}
                    <br />
                    <span class="text-secondary"><small>Published At</small></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="row">
                  <div class="col-2">
                    <div class="icon-episode-detail text-center"><i class="nc-icon nc-world-2 text-success"></i></div>
                  </div>
                  <div class="col-10">
                    <a :href="episode.watch_url" target="_blank">Source URL</a>
                  </div>
                </div>
              </li>
              <li v-if="episode.remote_url">
                <div class="row">
                  <div class="col-2">
                    <div class="icon-episode-detail text-center"><i class="nc-icon nc-note-03 text-info"></i></div>
                  </div>
                  <div class="col-10">
                    <a :href="episode.remote_url" target="_blank">Media URL</a>
                  </div>
                </div>
              </li>
              <li class="hide-on-large">
                <div class="row">
                  <div class="col-2">
                    <div class="icon-episode-detail text-center"><i class="nc-icon nc-paper text-success"></i></div>
                  </div>
                  <div class="col-10 pr-4">
                    <p>{{episode.description}}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
      <div class="col-md-8">
        <div class="card card-podcast card-user">
          <div class="card-header">
            <h5 class="card-title"  @click="showEditOnSmall = !showEditOnSmall">Edit Episode</h5>
            <div class="header-controls d-block d-sm-none">
              <el-switch
                v-model="showEditOnSmall"
                active-color="rgb(107, 208, 152)"
                inactive-color="rgb(203, 203, 203)"
              >
              </el-switch>
            </div>
          </div>
          <div class="card-body"  :class="{'hide-on-small': !showEditOnSmall}">
            <el-form ref="form" :model="form">
              <div class="row">
                <div class="col-12">
                  <div class="form-group text-left">
                    <label>Title</label>
                    <textarea class="form-control textarea" v-model="form.title" rows="2" placeholder="Podcast Title"></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-group text-left">
                    <label>Author</label>
                    <input type="text" class="form-control textarea" v-model="form.author" placeholder="Podcast Title">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-group text-left">
                    <label>Description</label>
                    <textarea class="form-control textarea" v-model="form.description" rows="13"></textarea>
                  </div>
                </div>
              </div>
              <div class="row mb-2">
                <div class="col-4 text-left">
                  <el-button type="info" plain @click="updateEpisode" icon="el-icon-edit">Update</el-button>
                </div>
                <div class="col-4 text-center">
                  <el-button class="hide-on-small" type="info" plain @click="downloadEpisode(episode)" icon="el-icon-download">Download</el-button>
                </div>
                <div class="col-4 text-right">
                  <el-button type="info" plain @click="deleteEpisode" icon="el-icon-delete"></el-button>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>

  </div>




</template>

<script>
  import Audio from "@/components/Audio";
  import axios from "axios";
  import router from "@/router";
  import {deleteEpisode, downloadEpisode, humanStatus} from "@/utils/podcast";

  export default {
    name: 'EpisodeDetails',
    components: {Audio},
    data: () => ({
        loading: true,
        episode: null,
        podcast: null,
        form: {
          title: '',
          author: '',
          description: ''
        },
        showEditOnSmall: false,
        showDetailsOnSmall: false,
    }),
    async created() {
      await this.fetchData()
      this.form.title = this.episode.title;
      this.form.author = this.episode.author;
      this.form.description = this.episode.description;
      this.loading = false;
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
          "title": this.episode.title,
          "route": null
        },
      ])
    },
    watch: {
      // при изменениях маршрута запрашиваем данные снова
      $route: 'fetchData'
    },
    methods: {
      async fetchData() {
        const episodeID = this.$route.params.episodeID
        const podcastID = this.$route.params.podcastID
        this.podcast = await this.$store.dispatch('getPodcastDetails', podcastID)
        this.episode = await this.$store.dispatch('getEpisodeDetails', episodeID)
      },
      async updateEpisode(){
        const response = await axios.patch(`episodes/${this.episode.id}/`, this.form);
        this.episode = response.data.payload
        this.$message({type: 'success', message: 'Episode successful updated.'});
      },
      deleteEpisode(){
        deleteEpisode(this.episode, () => {
            router.push({name: 'podcastDetails', params: {'id': this.podcast.id}}).then(() => {})
        })
      },
      downloadEpisode: downloadEpisode,
      humanStatus: humanStatus,
    }
  }
</script>
<style lang="scss">
  .title{
    font-weight: initial;
    font-size: 18px;
  }
  .icon-preload{
    font-size: 35px;
  }
  .podcast-background{
    filter: blur(1.2px);
  }
  .avatar-episode{
    width: 60% !important;
    height: auto !important;
    border-radius: 6px !important;
  }
  .card-episode-details{
    height: 294px;
    @media (max-width: 576px) {
      height: initial;
    }
  }
  .episode-details{
    li{
      padding-bottom: 10px;
    }
    .icon-episode-detail{
      font-size: 1.5em;
    }
    a{
      color: #393836;
      :hover{
        color: #393836;
      }
    }
  }
  .cursor{
    cursor: pointer;
  }
  .episode-status{
    .preload{
      width: 50px;
    }
    p{
      margin-top: 10px;
      font-size: 14px;
      color: #b1b1b1;
    }
  }
  .episode-status-icon{
    font-size: 30px;
  }
</style>