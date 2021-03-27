<template>
    <div class="content content-podcast-list">
      <div class="content">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Podcasts</h4>
              </div>
              <div class="card-body">
                <ul class="list-unstyled team-members">
                  <li
                      v-for="podcast in podcasts"
                      :key="podcast.id">
                    <div class="row row-podcast">
                      <div class="col-md-1 col-1 podcast-content" @click="goToPodcast(podcast)">
                        <div class="podcast-image">
                          <img v-if="podcast.image_url" :src="podcast.image_url" :alt="podcast.name" class="img-circle img-no-padding img-responsive">
                          <img v-else src="../assets/img/cover-default.jpeg" :alt="podcast.name" class="img-circle img-no-padding img-responsive">
                        </div>
                      </div>
                      <div class="col-md-9 col-9 podcast-title podcast-content" @click="goToPodcast(podcast)">
                        {{ podcast.name }}
                        <br/>
                        <span class="podcast-description">
                          {{ podcast.description }}
                        </span>
                      </div>
                      <div class="col-md-2 col-2 text-right podcast-controls">
                          <button
                              class="btn btn-sm btn-outline-danger btn-round btn-icon"
                              @click="deletePodcast(podcast)">
                            <i class="nc-icon nc-simple-remove"></i>
                          </button>
                        </div>
                    </div>
                    <hr class="hr__row-podcast">
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
  import router from "@/router";

  export default {
    name: 'PodcastList',
    data: () => ({
      podcasts: []
    }),
    async mounted(){
      await this.$store.dispatch('getPodcasts')
      this.podcasts = this.$store.getters.podcasts
    },
    methods: {
      goToPodcast(podcast){
        router.push({name: 'podcastDetails', params: {'id': podcast.id}})
      },
      deletePodcast(){
        console.log("Deleting podcast...")
      }
    }
  }
</script>
<style lang="scss">

.podcast_list__image{
  height: 50px;
}
.podcast_list__link-to-podcast{
  cursor: pointer;
}
.podcast-content{
  cursor: pointer;
}
.podcast-controls{
  margin-top: -7px;
  i{
    font-weight: bold;
    font-size: 14px !important;
  }
}
.podcast-description{
  color: #ACABAB !important;
  font-size: 12px;
}
</style>
