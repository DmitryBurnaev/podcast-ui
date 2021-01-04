<template>
  <div class="podcast-details">
    <template>
      <div class="post">
        <div v-if="loading" class="loading">
          <p style="text-align: center">Загрузка...</p>
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div v-if="podcast" class="content">
          <h2>{{ podcast.id }}</h2>
          <p style="text-align: center">{{ podcast.name }}</p>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
  export default {
    name: 'PodcastDetails',
    data: () => ({
        loading: false,
        podcast: null,
        error: null
    }),
    created() {
      this.fetchData()
    },
    watch: {
      // при изменениях маршрута запрашиваем данные снова
      $route: 'fetchData'
    },
    methods: {
      fetchData() {
        this.podcast = {}
        this.error = this.post = null
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.podcast = {
            "id": "Podcast-" + this.$route.params.id,
            "name": "Name of Podcast #" + this.$route.params.id
          }
        }, 300)
      },
    }
  }
</script>