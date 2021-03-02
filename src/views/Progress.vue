<template>
  <div class="content content-podcast-progress">
    <div class="row">
      <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Episodes in progress</h4>
        </div>
        <div class="card-body">
          <ul class="list-unstyled team-members">
            <li
                v-for="episode in episodesInProgress"
                :key="episode.id">
              <div class="row row-episode">
                <div class="col-md-1 col-1 episode-content" @click="goToEpisode(episode)">
                  <div class="episode-image">
                    <img :src="episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
                  </div>
                </div>
                <div class="col-md-9 col-9 episode-title episode-content" @click="goToEpisode(episode)">
                  {{ episode.title }}
                  <br/>
                  <span
                      :class="{
                        'text-success': (episode.status === 'published'),
                        'text-danger': (episode.status === 'error'),
                        'text-info': (['new', 'downloading'].includes(episode.status)),
                        'text-gray': (episode.status === 'archived')
                      }">
                    <small>{{episode.status | status}}</small>
                  </span>
                </div>
                <div class="col-md-2 col-2 text-right episode-controls">
                    <img class="preload mr-1 mt-2" v-if="episode.status === 'downloading'" src="../assets/img/down-arrow.gif" alt=""/>
                    <button
                        v-if="episode.status !== 'downloading'"
                        class="btn btn-sm btn-outline-danger btn-round btn-icon"
                        @click="deleteEpisode(episode)">
                      <i class="nc-icon nc-simple-remove"></i>
                    </button>
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
  import {deleteEpisode} from "@/utils/podcast";

  export default {
    name: 'Progress',
    data: () => ({
        episodesInProgress: [],
        timeInterval: null,
    }),
    async mounted() {
      this.timeInterval = setInterval(() => {
        // this.progressItems = [{"episode_id": 1, "test": "foo"}]
        const response = axios.get(`progress/`)
        console.log(this.episodesInProgress)
        if (response){
          this.episodesInProgress = response.data
        }
      }, 500)
    },
    destroyed() {
      clearInterval(this.timeInterval)
    },
    methods: {
      goToEpisode(episode){
        router.push({name: 'episodeDetails', params: {'episodeID': episode.id, 'podcastID': episode.podcast_id}})
      },
      deleteEpisode(episode){
        deleteEpisode(episode, () => {
          const index = this.episodes.findIndex((el) => el.id === episode.id)
          this.episodesInProgress.splice(index, 1)
        })
      },
    }
  }

</script>