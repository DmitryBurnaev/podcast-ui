<template>
    <div class="content">
      <div class="row">
        <div
            class="col-lg-3 col-md-6 col-sm-6"
            v-for="podcast in podcasts" :key="podcast.id"
        >
            <div class="card card-stats">
            <div class="card-body ">
              <div class="row">
                <div class="col-5 col-md-4">
                  <div class="icon-big text-center icon-warning">
                    <img v-if="podcast.image_url" :src="podcast.image_url" alt="">
                    <i v-else class="nc-icon nc-globe text-warning"></i>
                  </div>
                </div>
                <div class="col-7 col-md-8">
                  <div class="numbers">
                    <p class="card-category">{{podcast.name}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer ">
              <hr>
              <div class="stats">
                <i class="nc-icon nc-tap-01"></i>
                Add episode
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  name: "Home",
  // props: ['podcasts'],
  data: () => ({
    loading: true,
    podcasts: [],
  }),
  async mounted(){
    console.log("MainLayout mounted")
    await this.$store.dispatch('getPodcasts')
    this.podcasts = this.$store.getters.podcasts
    this.loading = false
  }
}
</script>
