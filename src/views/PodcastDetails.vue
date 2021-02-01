<template>
    <div class="content podcast-details">
      <div class="container-fluid">
        <h2>Podcast Details</h2>
        <div class="post">

        <!-- todo: move to common component -->
        <div v-if="loading" class="loading">
          <p style="text-align: center">Загрузка...</p>
        </div>

        <div v-if="podcast" class="content">
          <h2>Podcast {{ podcast.id }}</h2>
          <p style="text-align: center">{{ podcast.id }}</p>
          <p style="text-align: center">{{ podcast.name }}</p>
          <p style="text-align: center">{{ podcast.description }}</p>
          <p style="text-align: center"><img :src="podcast.image_url" alt=""></p>
          <p style="text-align: center">{{ podcast.created_at }}</p>
        </div>
        <div class="episodes">
          <ul>
            <router-link v-for="episode in episodes" :key="episode.id"
                tag="li"
                active-class="active"
                :to="{name: 'episodeDetails', params: {'id': episode.id}}"
            >
              #{{episode.id}} "{{episode.title}}"

            </router-link>
          </ul>


        </div>


      </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'PodcastDetails',
    data: () => ({
        loading: true,
        podcast: null,
        episodes: [],
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