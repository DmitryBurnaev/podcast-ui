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
              <AudioPlayer v-if="episodePublished(episode)" :src="episode.audio_url" :length="episode.length" ></AudioPlayer>
              <div v-else>
                <div v-if="progress !== null" class="progress-line-block d-sm-block">
                  <p class="text-muted">{{ humanStatus(progress.status) }}</p>
                  <el-progress v-if="progress.status === 'error'" :percentage="progress.completed" status="exception"></el-progress>
                  <el-progress v-else :percentage="parseInt(progress.completed)" ></el-progress>
                </div>
                <div v-else class="pre-progress">
                  <p :class="{
                      'text-danger': (episode.status === 'error'),
                      'text-muted': (['new', 'downloading'].includes(episode.status)),}">
                    {{ humanStatus(episode.status) }}
                  </p>
                  <i v-if="episode.status === 'new'" class="text-muted nc-icon el-icon-star-off"></i>
                  <i v-else-if="episode.status === 'error'" class="text-danger nc-icon el-icon-warning"></i>
                </div>
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
                            v-if="episode.status === 'new' || episode.status === 'error'"
                            class="nc-icon text-success"
                            :title="`${humanStatus(episode.status)} (click to download)`"
                            @click="downloadEpisode(episode)"
                            :class="{
                              'nc-tap-01 cursor text-danger': episode.status === 'error',
                              'nc-tap-01 cursor': episode.status === 'new',
                            }"
                        >
                        </i>
                        <i
                            v-else
                            class="nc-icon text-success"
                            :title="humanStatus(episode.status)"
                            :class="{
                              'nc-cloud-download-93': episode.status === 'downloading',
                              'nc-headphones': episode.status === 'published',
                            }"
                        >
                        </i>
                      </span>
                    </div>
                    <div class="col-lg-5 col-md-5 col-5 ml-auto mr-auto text-center">
                      <h5>{{ episode.audio_size | size }} MB<br><small>Size</small></h5>
                    </div>
                  </div>
            </div>
          </div>
        </div>
        <div class="card card-episode-details">
          <div class="card-header card-header-squash">
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
              <li v-if="episode.audio_url">
                <div class="row">
                  <div class="col-2">
                    <div class="icon-episode-detail text-center"><i class="nc-icon nc-note-03 text-info"></i></div>
                  </div>
                  <div class="col-10 details-info">
                    <a :href="episode.audio_url" target="_blank">Media URL</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="row">
                  <div class="col-2">
                    <div class="icon-episode-detail text-center source-img-container">
                      <img :src="getSourceBadgeIcon()" alt="" :title="episode.title">
                    </div>
                  </div>
                  <div class="col-10 details-info">
                    <a :href="episode.watch_url" target="_blank">Source URL</a>
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
          <div class="card-header card-header-squash">
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
                    <textarea class="form-control textarea" v-model="form.description" rows="15"></textarea>
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
  import AudioPlayer from "@/components/AudioPlayer";
  import axios from "axios";
  import router from "@/router";
  import {Progress} from 'element-ui';
  import {deleteEpisode, downloadEpisode, humanStatus} from "@/utils/podcast";
  import {connectToWS} from "@/utils/ws";

  export default {
    name: 'EpisodeDetailsView',
    components: {
      AudioPlayer,
      'el-progress': Progress,
    },
    data: () => ({
        loading: true,
        episode: null,
        podcast: null,
        progress: null,
        form: {
          title: '',
          author: '',
          description: ''
        },
        showEditOnSmall: false,
        showDetailsOnSmall: false,
        webSocket: null,
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
    destroyed() {
      if (this.webSocket) {this.webSocket.close()}
    },
    watch: {
      // changing route calls fetching data
      $route: 'fetchData'
    },
    methods: {
      async fetchData() {
        const episodeID = this.$route.params.episodeID
        const podcastID = this.$route.params.podcastID
        this.podcast = await this.$store.dispatch('getPodcastDetails', podcastID)
        this.episode = await this.$store.dispatch('getEpisodeDetails', episodeID)
        this.updateProgress()
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
      downloadEpisode(episode){
        downloadEpisode(episode, false)
        this.episode.status = 'downloading'
        this.updateProgress()
      },
      humanStatus: humanStatus,
      episodeInProgress(episode){
        return episode.status === 'downloading'
      },
      episodePublished(episode){
        return episode.status === 'published'
      },
      updateProgress(){
        if (this.episodeInProgress(this.episode)){
          this.webSocket = connectToWS(
              "/progress/",
              {"episodeID": this.episode.id},
              (data) => {
                if (data.progressItems.length !== 0){
                  this.progress = data.progressItems[0];
                  if (! this.episodeInProgress(this.progress.episode)){
                    console.log("Episode not in progress. Closing connection")
                    this.webSocket.close()
                    this.fetchData()
                  }
                }
                else {
                  this.progress = null
                }
            })
        }
      },
      getSourceBadgeIcon(){
        return require(`../assets/img/source-${this.episode.source_type.toLowerCase()}.png`)
      },
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
    div.details-info{
      padding-top: 1px;
    }
    div.source-img-container{
      img{
        display: block;
        margin-top: -2px;
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
  .el-progress-bar__inner{
    background-color: #6bd098;
  }
  .pre-progress{
    i{
      font-size: 20pt;
    }
  }
</style>