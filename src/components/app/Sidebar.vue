<template>
  <div class="side-bar" :class="{open: value}">

    <ul class="main-nav">
      <router-link
          v-for="link in links"
          :key="link.url"
          tag="li"
          active-class="active"
          :to=link.url
          :exact=link.exact
      >
        <a href="#" class="link-link">{{link.title}}</a>
      </router-link>
    </ul>
    <hr>
    <h4 style="text-align: center">Podcasts list</h4>
    <ul class="podcast-list-nav">
      <router-link
          v-for="podcast in podcasts"
          :key="podcast.id"
          tag="li"
          active-class="active"
          :to="{name: 'PodcastDetails', params: {'id': podcast.id}}"
      >
        <a href="#" class="podcast-link">{{podcast.name}}</a>
      </router-link>
    </ul>


  </div>

</template>

<script>
export default {
  name: "Sidebar",
  props: ['value', 'podcasts'],
  data: () => ({
    links: [
      {"title": "Home", "url": "/", "exact": true},
      {"title": "Podcast List", "url": "/podcasts/"},
      {"title": "Progress", "url": "/progress/"},
    ],
    // podcasts: null,
    // podcastItems: [
    //   {"id": 1, "title": "Test podcast 1", "url": "/podcasts/1"},
    //   {"id": 2, "title": "Test podcast 2", "url": "/podcasts/2"},
    //   {"id": 3, "title": "Test podcast 3", "url": "/podcasts/3"},
    //   {"id": 4, "title": "Test podcast 4", "url": "/podcasts/4"},
    // ]
  }),
  // async mounted() {
  //   if (!this.podcasts){
  //     this.podcasts = await this.$store.dispatch("getPodcasts")
  //   }
  // },
}
</script>

<style scoped>
  .side-bar{
    width: 25%;
    border: 1px solid gray;
    float: left;
  }
  .side-bar li.router-link-exact-active a{
      color: #42b983;
  }
</style>