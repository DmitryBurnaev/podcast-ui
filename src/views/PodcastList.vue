<template>
  <div class="podcasts">
    <h1>List of available podcasts</h1>
    <ol>
        <li v-bind:key="podcast" v-for="podcast in podcastItems">
          {{ podcast.title }}
        </li>
    </ol>


  </div>
</template>

<script>
export default {
  name: 'PodcastList',
  podcastItems: [
      { title: 'Learn JavaScript' },
      { title: 'Learn Vue' },
      { title: 'Build something awesome' }
    ]
  }


</script>