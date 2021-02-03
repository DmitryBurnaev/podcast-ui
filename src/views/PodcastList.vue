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
                    </thead>
                    <tbody>
                      <tr v-for="podcast in podcasts" :key="podcast.id">
                        <td> {{ podcast.id }} </td>
                        <td> <img :src="podcast.image_url" :alt="podcast.name" class="podcast_list__image"> </td>
                        <td> {{podcast.name}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>Podcast List</h2>
      <ul>
          <router-link
              v-for="podcast in podcasts"
              :key="podcast.id"
              tag="li"
              active-class="active"
              :to="{name: 'podcastDetails', params: {'id': podcast.id}}"
          >
            <p>{{podcast.id}}</p>
            <p>{{podcast.name}}</p>
            <p>{{podcast.description}}</p>
            <p><img :src="podcast.image_url" alt=""></p>
            <p>{{podcast.created_at}}</p>
          </router-link>
      </ul>
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

</style>
