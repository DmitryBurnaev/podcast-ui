<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-md-4">
        <div class="card card-podcast card-user">
          <div class="image">
            <img src="../assets/img/damir-bosnjak.jpg" alt="...">
          </div>
          <div class="card-body">
            <div class="author">
              <a href="#">
                <img class="avatar border-gray" :src="podcast.image_url" alt="...">
                <h5 class="title">{{ podcast.name }}</h5>
              </a>
            </div>
            <p class="description text-center"> {{ podcast.description }} </p>
          </div>
          <div class="card-footer">
            <hr>
            <div class="button-container">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-12 ml-auto text-center">
                  <h5 v-if="!loading">
                    {{ episodes.length }}<br>
                    <small>Episodes</small>
                  </h5>
                  <small v-else>loading</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card card-podcast card-user">
          <div class="card-header">
            <h5 class="card-title">Edit Podcast</h5>
          </div>
          <div class="card-body">
            <form>
              <div class="row">
                <div class="col-md-8 pr-1">
                  <div class="form-group">
                    <label>Name</label>
                    <input v-model="form.name" type="text" class="form-control" placeholder="Podcast Name">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Created At</label>
                    <input type="text" class="form-control" placeholder="Podcast name" disabled
                           :value="podcast.created_at | date('datetime')">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control textarea" v-model="form.description" rows="4"></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="update ml-auto mr-auto">
                  <button type="button" class="btn btn-success btn-round" @click="generateRSS">Regenerate RSS</button>
                </div>
                <div class="update ml-auto mr-auto">
                  <button type="button" class="btn btn-primary btn-round" @click="updatePodcast">Update Podcast</button>
                </div>
                <div class="update ml-auto mr-auto">
                  <button type="button" class="btn btn-danger btn-round" @click="deletePodcast">Delete Podcast</button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card create-episode-card">
          <div class="card-header">
            <h5 class="card-title">Create new episode</h5>
          </div>
          <div class="card-body">
            <form>
              <div class="row">
                <div class="col-md-9 pr-1">
                  <div class="form-group">
                    <input v-model="newEpisodeForm.url" type="text" class="form-control" placeholder="Episode Source Link">
                  </div>
                </div>
                <div class="col-md-3">
                  <img class="preload" v-if="newEpisodeIsCreating" src="../assets/img/down-arrow.gif" alt=""/>
                  <button
                      type="button"
                      class="btn btn-success btn-round"
                      :disabled="newEpisodeIsCreating"
                      @click="createEpisode">
                    <i v-if="newEpisodeIsCreating" class="nc-icon nc-refresh-69"></i>
                    Add Episode</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Episodes</h4>
          </div>
          <div class="card-body">
            <ul class="list-unstyled team-members">
              <router-link
                  tag="li"
                  v-for="episode in episodes"
                  :key="episode.id"
                  :to="{name: 'episodeDetails', params: {'podcastID': podcast.id, 'episodeID': episode.id}}"
              >
                  <div class="row row-episode">
                    <div class="col-md-1 col-1 episode-content">
                      <div class="episode-image">
                        <img :src="episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
                      </div>
                    </div>
                    <div class="col-md-9 col-9 episode-title episode-content">
                      {{ episode.title }}
                      <br/>
                      <span
                          :class="{
                            'text-success': (episode.status === 'published'),
                            'text-danger': (episode.status === 'error'),
                            'text-info': (['new', 'downloading'].includes(episode.status)),
                            'text-gray': (episode.status === 'archived')
                          }">
                        <small>{{humanStatus(episode.status)}}</small>
                      </span>
                    </div>
                    <div class="col-md-2 col-2 text-right episode-controls">
                      <button
                          v-if="episode.status === 'new'"
                          class="btn btn-sm btn-outline-success btn-round btn-icon">
                        <i class="nc-icon nc-cloud-download-93"></i>
                      </button>
                      <button
                          v-else-if="episode.status === 'downloading'"
                          class="btn btn-sm btn-outline-primary btn-round btn-icon">
                        <i class="fa fa-envelope"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger btn-round btn-icon">
                        <i class="nc-icon nc-simple-remove"></i>
                      </button>
                    </div>
                  </div>
                  <hr class="hr__row-episode">
              </router-link>
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
import {deleteEpisode, downloadEpisode, humanStatus} from "@/utils/podcast";

export default {
  name: 'PodcastDetails',
  data: () => ({
    loading: true,
    podcast: null,
    episodes: [],
    downloadAuto: false,
    form: {
      name: '',
      description: ''
    },
    newEpisodeForm: {
      //todo: rename to source_url
      youtube_link: ''
    },
    newEpisodeIsCreating: false,
  }),
  async created() {
    await this.fetchData()
    this.form.name = this.podcast.name;
    this.form.description = this.podcast.description;
    this.loading = false;
  },
  watch: {
    // при изменениях маршрута запрашиваем данные снова
    $route: 'fetchData'
  },
  methods: {
    async fetchData() {
      const podcastID = this.$route.params.id
      this.podcast = await this.$store.dispatch('getPodcastDetails', podcastID)
      this.episodes = await this.$store.dispatch('getEpisodes', podcastID)
      this.loading = false
    },
    async updatePodcast(){
      const response = await axios.patch(`podcasts/${this.podcast.id}/`, this.form);
      this.podcast = response.data
      this.$message({type: 'success', message: 'Podcast successful updated.'});
    },
    async generateRSS(){
      await axios.put(`podcasts/${this.podcast.id}/generate_rss/`);
      this.$message({type: 'success', message: 'RSS will be regenerated soon.'});
    },
    deletePodcast(){
      this.$confirm('This will permanently delete the podcast and included episodes. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        axios.delete(`podcasts/${this.episode.id}/`).then(() => {
          this.$message({type: 'success', message: `Podcast '${this.podcast.name}' successful deleted.`});
          router.push(`/podcasts`).then(() => {})
        })
      });
    },
    async createEpisode(){
      this.newEpisodeIsCreating = true
      // const response = await axios.post(`podcasts/${this.podcast.id}/episodes/`, this.newEpisodeForm);
      // if (response){
      //   this.$message({type: 'success', message: `New episode #${response.id} was created`});
      //   this.episodes.push(response)
      // }
      // this.newEpisodeIsCreating = false
    },
    deleteEpisode: deleteEpisode,
    downloadEpisode: downloadEpisode,
    humanStatus: humanStatus
  }
}
</script>
<style lang="scss">
.row-episode{
}
.row-episode .episode-content{
  cursor: pointer;
}
.row-episode .episode-title{
  margin-top: -3px;
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
}
.card-podcast .card-body{
  min-height: 198px;
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
}
</style>