<template>
    <div class="content podcast-details">
      <div class="container-fluid">
        <h2>Episode Details</h2>
        <div v-if="loading" class="loading">
          <p style="text-align: center">Загрузка...</p>
        </div>
        <div v-else-if="episode" class="content">
          <h2>Episode {{ episode.id }}</h2>
          <p style="text-align: left">{{ episode.id }}</p>
          <p style="text-align: left">{{ episode.title }}</p>
          <p style="text-align: left">{{ episode.description }}</p>
          <p style="text-align: left"><img :src="episode.image_url" alt=""></p>
          <p style="text-align: left">{{ episode.created_at }}</p>
          <p style="text-align: left">{{ episode.published_at }}</p>
          <p style="text-align: left">{{ episode.status }}</p>
          <p style="text-align: left">{{ episode.author }}</p>
          <p style="text-align: left">{{ episode.length }}</p>
          <p style="text-align: left">{{ episode.remote_url }}</p>
        </div>
      </div>
    </div>

</template>

<script>
  export default {
    name: 'EpisodeDetails',
    data: () => ({
        loading: true,
        episode: null,
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
        const episodeID = this.$route.params.id
        this.loading = true
        this.episode = await this.$store.dispatch('getEpisodeDetails', episodeID)
        this.loading = false
      },
    }
  }
</script>