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
                    <div class="col-lg-4 col-md-4 col-4 ml-auto text-center">
                      <h5>{{ episode.length | length }}<br><small>Length</small></h5>
                    </div>
                    <div class="col-lg-4 col-md-4 col-4 ml-auto text-center">
                      <h2>
                        <i
                            class="nc-icon text-primary"
                            :title="episode.status"
                            :class="{
                              'nc-watch-time': episode.status === 'pending',
                              'nc-cloud-download-93': episode.status === 'downloading',
                              'nc-headphones': episode.status === 'published',
                            }"
                        >
                        </i>
                      </h2>
                    </div>
                    <div class="col-lg-4 col-md-4 col-4 ml-auto mr-auto text-center">
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
                        <div class="icon-episode-detail text-center"><i class="nc-icon nc-spaceship text-warning"></i></div>
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
                        <div class="icon-episode-detail text-center"><i class="nc-icon nc-world-2 text-primary"></i></div>
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
            <form>
              <div class="row">
                <div class="col-md-12 pr-1">
                  <div class="form-group">
                    <label>Title</label>
                    <textarea class="form-control textarea" v-model="episode.title" rows="2" placeholder="Podcast Title"></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 pr-1">
                  <div class="form-group">
                    <label>Author</label>
                    <input type="text" class="form-control textarea" v-model="episode.author" placeholder="Podcast Title">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control textarea" v-model="episode.description" rows="10"></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="update ml-auto mr-auto">
                  <button type="submit" class="btn btn-primary btn-round">Update Episode</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>




</template>

<script>
  import Audio from "@/components/Audio";

  export default {
    name: 'EpisodeDetails',
    components: {Audio},
    data: () => ({
        loading: true,
        episode: null,
        podcast: null,
    }),
    async created() {
      await this.fetchData()
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
        this.loading = false
      },
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
</style>