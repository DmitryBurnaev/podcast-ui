<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-md-4">
        <div class="card card-podcast card-user">
          <div class="image">
            <img :src="podcast.image_url" alt="...">
          </div>
          <div class="card-body">
            <div class="author">
                <img class="avatar avatar-episode border-gray" :src="episode.image_url" alt="...">
                <p class="title">{{ episode.title }}</p>
            </div>
            <div class="episode-content text-center">
              <Audio v-if="episode.status === 'published'" :src="episode.remote_url" :length="episode.length" ></Audio>
              <div v-else class="text-success">
                <i class="nc-icin nc-cloud-download-93"></i>
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
                      <h2>
                        <i
                            class="nc-icon text-primary"
                            :title="episode.status"
                            :class="{
                              'nc-watch-time cursor': episode.status === 'pending',
                              'nc-cloud-download-93': episode.status === 'downloading',
                              'nc-headphones': episode.status === 'published',
                            }"
                            @click="downloadEpisode"
                        >
                        </i>
                      </h2>
                    </div>
                    <div class="col-lg-5 col-md-5 col-5 ml-auto mr-auto text-center">
                      <h5>{{ episode.file_size | size }} MB<br><small>Size</small></h5>
                    </div>
                  </div>
            </div>
          </div>


        </div>
        <div class="card">
              <div class="card-header">
                <h4 class="card-title">Episode details</h4>
              </div>
              <div class="card-body">
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
                  <li>
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
                      <div class="col-md-2 col-2">
                        <div class="icon-episode-detail text-center"><i class="nc-icon nc-world-2 text-success"></i></div>
                      </div>
                      <div class="col-ms-10 col-10">
                        <a :href="episode.watch_url" target="_blank">{{ episode.watch_url }}</a>
                        <br />
                        <span class="text-secondary"><small>Watch URL</small></span>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div class="row">
                      <div class="col-md-2 col-2">
                        <div class="icon-episode-detail text-center"><i class="nc-icon nc-note-03 text-info"></i></div>
                      </div>
                      <div class="col-ms-10 col-10">
                        <a :href="episode.remote_url" target="_blank">{{ episode.remote_url }}</a>
                        <br />
                        <span class="text-secondary"><small>Remote URL</small></span>
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
            <h5 class="card-title">Edit Episode</h5>
          </div>
          <div class="card-body">
            <el-form ref="form" :model="form">
              <div class="row">
                <div class="col-md-12 pr-1">
                  <div class="form-group">
                    <label>Title</label>
                    <textarea class="form-control textarea" v-model="form.title" rows="2" placeholder="Podcast Title"></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 pr-1">
                  <div class="form-group">
                    <label>Author</label>
                    <input type="text" class="form-control textarea" v-model="form.author" placeholder="Podcast Title">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control textarea" v-model="form.description" rows="10"></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="update ml-auto mr-auto">
                  <button type="button" class="btn btn-success btn-round" @click="downloadEpisode">Download Episode</button>
                </div>
                <div class="update ml-auto mr-auto">
                  <button type="button" class="btn btn-primary btn-round" @click="updateEpisode">Update Episode</button>
                </div>
                <div class="update ml-auto mr-auto">
                  <button type="button" class="btn btn-danger btn-round" @click="deleteEpisode">Delete Episode</button>
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
  import {deleteEpisode} from "@/utils/podcast";

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
        }
    }),
    async created() {
      await this.fetchData()
      this.form.title = this.episode.title;
      this.form.author = this.episode.author;
      this.form.description = this.episode.description;
      this.loading = false;
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
        this.episode = response.data
        this.$message({type: 'success', message: 'Episode successful updated.'});
      },
      deleteEpisode(){
        deleteEpisode(this.episode, () => {
            router.push({name: 'podcastDetails', params: {'id': this.podcast.id}}).then(() => {})
        })
      },
      downloadEpisode(){
        if (this.episode.status === 'downloading'){
          this.$message({type: 'warning', message: `Episode is downloading now.`});
          return
        }

        if (this.episode.status === 'new'){
          axios.put(`episodes/${this.episode.id}/download/`).then(() => {
            this.$message({type: 'success', message: `Downloading has been started.`});
          })
        } else {
          this.$confirm('This will remove downloaded and reload new episode. Continue?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            axios.put(`episodes/${this.episode.id}/download/`).then(() => {
              this.$message({type: 'success', message: `Downloading has been started.`});
            })
          });
        }
      }

    }
  }
</script>
<style lang="scss">

.avatar-episode{
  width: 60% !important;
  height: auto !important;
  border-radius: 6px !important;
}
.episode-details{
  li{
    padding-bottom: 10px;
  }
  .icon-episode-detail{
    font-size: 1.5em;
  }
}
.cursor{
  cursor: pointer;
}
</style>