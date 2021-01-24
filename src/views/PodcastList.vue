<template>
  <div class="podcast-details">
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
  p{
    padding: 0;
    line-height: 2px;
  }
  img{
    width: 50px;
    height: 50px;
  }

</style>