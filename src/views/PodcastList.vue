<template>
    <div class="content content-podcast-list">
      <div class="content">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title"> Podcasts </h4>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table">
                    <thead class=" text-primary">
                      <th> ID </th>
                      <th> Logo </th>
                      <th> Name </th>
                      <th> Created </th>
                      <th> Description </th>
                    </thead>
                    <tbody>
                      <router-link
                          v-for="podcast in podcasts"
                          class="podcast_list__link-to-podcast"
                          :key="podcast.id"
                          tag="tr"
                          :to="{name: 'podcastDetails', params: {'id': podcast.id}}"
                      >
                        <td> {{ podcast.id }} </td>
                        <td> <img :src="podcast.image_url" :alt="podcast.name" class="podcast_list__image"> </td>
                        <td> {{podcast.name}}</td>
                        <td> {{podcast.created_at}}</td>
                        <td> {{podcast.description}}</td>
                      </router-link>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
  export default {
    name: 'PodcastList',
    data: () => ({
      podcasts: []
    }),
    async mounted(){
      await this.$store.dispatch('getPodcasts')
      this.podcasts = this.$store.getters.podcasts
    }
  }
</script>
<style>

.podcast_list__image{
  height: 50px;
}
.podcast_list__link-to-podcast{
  cursor: pointer;
}

</style>
