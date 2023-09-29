<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-md-4" ref="episodeLeftFooter">
        <div class="card card-podcast card-user">
          <div class="image card-background" >
            <img v-if="podcast.image_url" :src="podcast.image_url" :alt="podcast.name">
            <img v-else src="../assets/img/cover-default.jpeg" :alt="podcast.name">
          </div>
          <div class="card-body">
            <div class="author">
              <img class="avatar avatar-episode border-gray" :src="episode.image_url" :alt="episode.title" @error="defaultImage">
              <p class="title">{{ episode.title }}</p>
            </div>
            <div class="episode-content text-center mt-3">
              <AudioPlayer v-if="episodePublished(episode)" :src="episode.audio_url" :length="episode.length" ></AudioPlayer>
              <div v-else>
                <div v-if="progress !== null" class="progress-line-block d-sm-block">
                  <p class="text-muted">{{ humanStatus(progress.status) }}</p>
                  <el-progress v-if="progress.status === 'ERROR'" :percentage="parseInt(progress.completed)" status="exception"></el-progress>
                  <el-progress v-else :percentage="parseInt(progress.completed)" ></el-progress>
                </div>
                <div v-else class="pre-progress">
                  <p :class="{
                      'text-danger': (episode.status === 'ERROR'),
                      'text-muted': (['NEW', 'DOWNLOADING'].includes(episode.status)),}">
                    {{ humanStatus(episode.status) }}
                  </p>
                  <i v-if="episode.status === 'NEW'" class="text-muted nc-icon el-icon-star-off"></i>
                  <i v-else-if="episode.status === 'ERROR'" class="text-danger nc-icon el-icon-warning"></i>
                  <i v-else-if="episode.status === 'CANCELING'" class="text-danger nc-icon el-icon-warning"></i>
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
                        v-if="episode.status === 'NEW' || episode.status === 'ERROR'"
                        class="nc-icon text-success"
                        :title="`${humanStatus(episode.status)} (click to download)`"
                        @click="downloadEpisode(episode)"
                        :class="{
                          'nc-tap-01 cursor text-danger': episode.status === 'ERROR',
                          'nc-tap-01 cursor': episode.status === 'NEW',
                        }"
                    >
                    </i>
                    <i
                        v-else-if="episode.status === 'CANCELING'"
                        class="nc-icon text-success"
                        :title="humanStatus(episode.status)"
                        @click="fetchData()"
                        :class="{
                          'nc-refresh-69 cursor': episode.status === 'CANCELING',
                        }"
                    >
                    </i>
                    <i
                        v-else
                        class="nc-icon text-success"
                        :title="humanStatus(episode.status)"
                        :class="{
                          'nc-cloud-download-93': episode.status === 'DOWNLOADING',
                          'nc-headphones': episode.status === 'PUBLISHED',
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
                  <div class="col-md-9 col-9 details-info">
                    {{ episode.created_at | date}} <span class="text-secondary ml-2"><small>(Created At)</small></span>
                  </div>
                </div>
              </li>
              <li v-if="episode.published_at">
                <div class="row">
                  <div class="col-md-2 col-2">
                    <div class="icon-episode-detail text-center"><i class="nc-icon nc-spaceship text-info"></i></div>
                  </div>
                  <div class="col-md-9 col-9 details-info">
                    {{ episode.published_at | date}} <span class="text-secondary ml-2"><small>(Published At)</small></span>
                  </div>
                </div>
              </li>
              <li v-if="episode.audio_url">
                <div class="row">
                  <div class="col-2">
                    <div class="icon-episode-detail text-center"><i class="nc-icon nc-note-03 text-success"></i></div>
                  </div>
                  <div class="col-10 details-info">
                    <a :href="episode.audio_url" target="_blank">Media URL</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="row">
                  <div class="col-2">
                    <source-type-icon
                        :source-type="episode.source_type"
                        :source-label="`Downloaded from ${episode.source_type} '${episode.title}'`">
                    </source-type-icon>
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
        <div class="card card-podcast card-user card-right-column" >
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
            <el-form ref="form" :model="episodeEdit.form">
              <div class="row">
                <div class="col-12">
                  <div class="form-group text-left" :class="{'has-error': episodeEdit.serverErrors.title.length > 0 }">
                    <label>Title</label>
                    <textarea class="form-control textarea" v-model="episodeEdit.form.title" rows="2" placeholder="Episode's Title"/>
                    <input-errors :errors="episodeEdit.serverErrors.title" />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-group text-left" :class="{'has-error': episodeEdit.serverErrors.author.length > 0 }">
                    <label>Author</label>
                    <input type="text" class="form-control textarea" v-model="episodeEdit.form.author">
                    <input-errors :errors="episodeEdit.serverErrors.author" />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-group text-left" :class="{'has-error': episodeEdit.serverErrors.description.length > 0 }">
                    <label>Description</label>
                    <textarea class="form-control textarea episode-description" v-model="episodeEdit.form.description"/>
                    <input-errors :errors="episodeEdit.serverErrors.description" />
                  </div>
                </div>
              </div>
              <div class="row mb-2 bottom-controllers">
                <div class="col-4 text-left">
                  <el-button
                    type="info"
                    plain
                    @click="updateEpisode"
                    icon="el-icon-edit"
                    title="Save Episode Changes"
                  >
                    <span class="control-caption hide-on-small">
                        Update
                    </span>
                  </el-button>
                </div>
                <div class="col-4 text-center">
                  <el-button
                    v-if="episodeInProgress(episode)"
                    type="info"
                    plain
                    @click="cancelDownloading(episode)"
                    icon="el-icon-circle-close"
                    title="Cancel Downloading"
                  >
                    <span class="control-caption hide-on-small">
                      Cancel Downloading
                    </span>
                  </el-button>
                  <el-button
                    v-else
                    class="hide-on-small"
                    type="info"
                    plain
                    @click="downloadEpisode(episode)"
                    icon="el-icon-download"
                    title="Start downloading"
                  >
                    <span class="control-caption hide-on-small">
                        Download
                    </span>
                  </el-button>
                </div>
                <div class="col-4 text-right">
                  <el-button
                    type="info"
                    plain
                    @click="deleteEpisode"
                    icon="el-icon-delete"
                    title="Delete Episode"
                    :disabled="episodeInProgress(episode)"
                  >
                  </el-button>
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
  import SourceTypeIcon from "@/components/SourceTypeIcon";
  import axios from "axios";
  import router from "@/router";
  import {Progress} from 'element-ui';
  import {deleteEpisode, downloadEpisode, fillFormErrors, humanStatus, defaultImage} from "@/utils/podcast";
  import {connectToWS} from "@/utils/ws";
  import InputErrors from "@/components/InputErrors.vue";

  export default {
    name: 'EpisodeDetailsView',
    components: {
      InputErrors,
      AudioPlayer,
      'el-progress': Progress,
      SourceTypeIcon,
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
      episodeEdit:{
        form: {
          title: '',
          author: '',
          description: ''
        },
        serverErrors:{
          title: [],
          author: [],
          description: [],
        },
        defaultServerErrors:{
          title: [],
          author: [],
          description: [],
        },
      },
      showEditOnSmall: false,
      showDetailsOnSmall: false,
      webSocket: null,
      episodeRightColStyles: {},
    }),
    async created() {
      await this.fetchData()
      this.episodeEdit.form.title = this.episode.title || "";
      this.episodeEdit.form.author = this.episode.author || "";
      this.episodeEdit.form.description = this.episode.description || "";
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
    computed: {
      error() {
        return this.$store.getters.error
      }
    },
    watch: {
      // changing route calls fetching data
      $route: 'fetchData',
      error(serverErrors){
        fillFormErrors(serverErrors, [
            this.episodeEdit.serverErrors
        ])
      }
    },
    methods: {
      defaultImage,
      async fetchData() {
        const episodeID = this.$route.params.episodeID
        this.episode = await this.$store.dispatch('getEpisodeDetails', episodeID)
        this.podcast = this.episode.podcast
        this.episodeEdit.serverErrors = {...this.episodeEdit.defaultServerErrors}
        this.updateProgress()
      },
      async updateEpisode(){
        this.episodeEdit.serverErrors = {...this.episodeEdit.defaultServerErrors}
        const response = await axios.patch(`episodes/${this.episode.id}/`, this.episodeEdit.form);
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
        this.episode.status = 'DOWNLOADING'
        this.updateProgress()
      },
      humanStatus: humanStatus,
      async cancelDownloading(episode){
        await axios.put(`episodes/${episode.id}/cancel-downloading/`);
        this.episode.status = 'NEW'
        await this.fetchData()
      },
      // defaultImage: defaultImage,
      episodeInProgress(episode){
        return episode.status === 'DOWNLOADING' || episode.status === 'CANCELLING'
      },
      episodePublished(episode){
        return episode.status === 'PUBLISHED'
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
    .source-type-img-container{
      img{
        margin-left: 5px;
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
  .card-right-column{
    .episode-description{
      min-height: 360px;
    }
  }
  .has-error{
    margin-bottom: 30px !important;
    input{
      border-color: red;
    }
    textarea{
      border-color: red;
    }
  }
  @media screen and (min-width: 768px){
    .bottom-controllers{
      position: absolute;
      bottom: 10px;
      width: 100%;
    }
    .card-episode-details{
      margin-bottom: 0;
    }
    .card-right-column{
      height: 100%;
      .episode-description{
        min-height: 360px;
      }
    }
  }
  .image.card-background{
    img{
      width: 100%;
    }
  }
  .control-caption.hide-on-small{
    margin-left: 0;
  }
</style>
