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
          </div>
          <div class="card-footer">
            <hr>
            <div class="button-container">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-6 ml-auto text-center">
                      <h5>{{ episode.length | length }}<br><small>Length</small></h5>
                    </div>
                    <div class="col-lg-6 col-md-6 col-6 ml-auto mr-auto text-center">
                      <h5>{{ episode.file_size | size }} MB<br><small>Size</small></h5>
                    </div>
                  </div>
            </div>
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
                <div class="col-md-8 pr-1">
                  <div class="form-group">
                    <label>Name</label>
                    <input v-model="episode.title" type="text" class="form-control" placeholder="Podcast Name">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Created At</label>
                    <input type="text" class="form-control" disabled :value="episode.created_at | date('datetime')">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control textarea" v-model="episode.description" rows="4"></textarea>
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


<!--    <div class="content podcast-details">-->
<!--      <div class="container-fluid">-->
<!--        <h2>Episode Details</h2>-->
<!--        <div v-if="loading" class="loading">-->
<!--          <p style="text-align: center">Загрузка...</p>-->
<!--        </div>-->
<!--        <div v-else-if="episode" class="content">-->
<!--          <h2>Episode {{ episode.id }}</h2>-->
<!--          <p style="text-align: left">{{ episode.id }}</p>-->
<!--          <p style="text-align: left">{{ episode.title }}</p>-->
<!--          <p style="text-align: left">{{ episode.description }}</p>-->
<!--          <p style="text-align: left"><img :src="episode.image_url" alt=""></p>-->
<!--          <p style="text-align: left">{{ episode.created_at }}</p>-->
<!--          <p style="text-align: left">{{ episode.published_at }}</p>-->
<!--          <p style="text-align: left">{{ episode.status }}</p>-->
<!--          <p style="text-align: left">{{ episode.author }}</p>-->
<!--          <p style="text-align: left">{{ episode.length }}</p>-->
<!--          <p style="text-align: left">{{ episode.remote_url }}</p>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>




</template>

<script>
  export default {
    name: 'EpisodeDetails',
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
<style>

.avatar-episode{
  width: 60% !important;
  height: auto !important;
  border-radius: 6px !important;
}


</style>