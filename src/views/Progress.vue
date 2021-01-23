<template>
  <div class="podcast-details">
    <h2>Current Progress</h2>
  </div>
</template>

<script>
  export default {
    name: 'Progress',
    data: () => ({
        loading: true,
        progress: null,
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
        const podcastID = this.$route.params.id
        this.loading = true
        this.podcast = await this.$store.dispatch('getPodcastDetails', podcastID)
        this.episodes = await this.$store.dispatch('getEpisodes', podcastID)
        this.loading = false
      },
    }
  }

</script>