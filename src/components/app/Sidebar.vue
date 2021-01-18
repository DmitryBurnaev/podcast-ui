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
  }),
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