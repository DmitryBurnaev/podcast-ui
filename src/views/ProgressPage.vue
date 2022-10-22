<template>
  <div class="content content-podcast-progress">
    <div class="row">
      <div class="col-12">
      <div class="card">
        <div class="card-header card-header-progress">
          <h4 class="card-title">Episodes in progress</h4>
        </div>
        <hr class="progress-separator"/>
        <div class="card-body">
          <ul class="list-unstyled team-members">
            <li
                v-for="progress in progressItems"
                :key="progress.episode.id">
              <div class="row row-episode">
                <div class="col-md-1 col-3 episode-content" @click="goToEpisode(progress)">
                  <div class="episode-image">
                    <img :src="progress.podcast.image_url" alt="Circle Image" class="podcast-cover img-circle img-no-padding img-responsive">
                  </div>
                </div>
                <div class="col-md-11 col-9 episode-title episode-content" @click="goToEpisode(progress)">
                  <p class="progress-item-title d-none d-sm-block">{{ progress.episode.title }}</p>
                  <p class="progress-item-title d-block d-sm-none">{{ progress.episode.title | cut(70) }}</p>
                  <div class="progress-line-block d-none d-sm-block">
                    <small
                      :class="{
                        'text-danger': (progress.status === 'error'),
                        'text-muted': (['new', 'downloading'].includes(progress.episode.status)),
                      }"
                    >
                      {{ humanStatus(progress.status) }}
                    </small>
                    <el-progress v-if="progress.status === 'error'" :percentage="progress.completed" status="exception"></el-progress>
                    <el-progress v-else :percentage="parseInt(progress.completed)" ></el-progress>
                  </div>
                </div>
              </div>
              <!-- small screens -->
              <div class="progress-line-block d-block d-sm-none">
                <small
                  :class="{
                    'text-danger': (progress.status === 'error'),
                    'text-muted': (['new', 'downloading'].includes(progress.episode.status)),
                  }"
                >
                  {{ humanStatus(progress.status) }}
                </small>
                <el-progress v-if="progress.status === 'error'" :percentage="progress.completed" status="exception"></el-progress>
                <el-progress v-else :percentage="parseInt(progress.completed)" ></el-progress>
              </div>
              <hr class="hr__row-episode">
            </li>

          </ul>
          <div class="progress-preloader text-center" style="font-size: 24px;"><i class="icon el-icon-loading"></i></div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import axios from "axios";
  import router from "@/router";
  import config from "@/config";
  import {Progress} from 'element-ui';
  import {humanStatus} from "@/utils/podcast";
  import store from "@/store";

  export default {
    name: 'ProgressPage',
    data: () => ({
        progressItems: [],
        timeInterval: null,
        webSocket: null
    }),
    components: {
      'el-progress': Progress
    },
    async mounted() {
      this.$store.commit('setBreadcrumbs', [
        {
          "title": "Home",
          "route": {name: "Home"}
        },
        {
          "title": "Progress",
          "route": null
        },
      ])
      this.connectWS()
      // this.timeInterval = setInterval(() => {
      //   axios.get(`progress/`).then((response) => {
      //     this.progressItems = response.data.payload
      //   })
      // }, 1000)
    },
    destroyed() {
      clearInterval(this.timeInterval)
      this.webSocket.close()
    },
    methods: {
      goToEpisode(progress){
        router.push({
          name: 'episodeDetails',
          params: {'episodeID': progress.episode.id, 'podcastID': progress.podcast.id}
        })
      },
      humanStatus: humanStatus,
      connectWS(){
        if ("WebSocket" in window) {
          let ws = new WebSocket(`ws://${config.webSocketURL}/progress/`);
          ws.onopen = function() {
            console.log("Sending websocket data");
            let data = {
              "headers": {Authorization: `Bearer ${store.getters.accessToken}`},
            };
            ws.send(JSON.stringify(data, null));
          };
          ws.onmessage = (e) => {
            let data = JSON.parse(e.data);
            this.progressItems = data.progressItems
          };
          ws.onclose = function() {
            console.log("Closing websocket connection");
          };
          this.webSocket = ws
        } else {
          alert("WS not supported, sorry!");
        }
      }

    }
  }

</script>
<style lang="scss">
  .card-header-progress{
    padding-top: 0 !important;
    .card-title {
        margin-top: 12px !important;
        margin-bottom: 12px;
        @media (max-width: 576px) {
            margin-top: 15px !important;
            margin-bottom: 15px !important;
        }
    }
  }
  hr.progress-separator{
    margin-top: 0;
    margin-bottom: 0;
  }
  .podcast-cover{
    width: 70px;
  }
  .episode-content{
    cursor: pointer;
  }
  .progress-item-title{
    margin-bottom: 0;
  }
  .el-progress__text{
    margin-left: 0;
  }
  .progress-line-block{
    margin-top: 10px;
    .el-progress-bar{
      padding-right: 45px;
      margin-right: -40px;
    }
  }
  .el-progress-bar__inner{
    background-color: #6bd098;
  }
  .list-unstyled{
    margin-bottom: 0 !important;
  }
  .progress-preloader{
    font-size: 24px;
  }
</style>