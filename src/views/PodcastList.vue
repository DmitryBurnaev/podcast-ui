<template>
    <div class="content content-podcast-list">
      <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header card-header-with-controls" >
                <h4 class="card-title">Podcasts</h4>
                  <router-link
                      tag="div"
                      class="controls"
                      :to="{name: 'podcastCreate'}"
                  >
                    <el-button class="d-none d-sm-block" type="info" plain icon="el-icon-edit">Create new</el-button>
                    <el-button class="d-block d-sm-none" type="info" plain icon="el-icon-edit" title="Create new podcast"></el-button>
                  </router-link>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li
                      v-for="podcast in podcasts"
                      :key="podcast.id">
                    <div class="row row-podcast" @click="goToPodcast(podcast.id)">
                      <div class="col-md-1 col-3 podcast-content">
                        <div class="podcast-image">
                          <img v-if="podcast.image_url" :src="podcast.image_url" :alt="podcast.name" class="img-circle img-no-padding img-responsive">
                          <img v-else src="../assets/img/cover-default.jpeg" :alt="podcast.name" class="img-circle img-no-padding img-responsive">
                        </div>
                      </div>
                      <div class="col-md-9 col-8 podcast-content" @click="goToPodcast(podcast)">
                        <p class=" podcast-title">{{ podcast.name }}</p>
                        <p class="podcast-description d-none d-sm-block">{{ podcast.description }}</p>
                        <p class="podcast-description d-block d-sm-none">{{ podcast.description | cut(60) }}</p>
                      </div>
                      <div class="col-md-2 col-1 text-right podcast-controls">
                          <div
                              class="btn-outline-gray btn-icon"
                              @click="deletePodcast(podcast)">
                            <i class="nc-icon nc-simple-remove"></i>
                          </div>
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
</template>

<script>
  import {deletePodcast, goToPodcast} from "@/utils/podcast";

  export default {
    name: 'PodcastListView',
    data: () => ({
      podcasts: []
    }),
    async mounted(){
      await this.$store.dispatch('getPodcasts')
      this.podcasts = this.$store.getters.podcasts
      this.$store.commit('setBreadcrumbs', [
        {
          "title": "Home",
          "route": {name: "Home"}
        },
        {
          "title": "Podcasts",
          "route": null
        },
      ])
    },
    methods: {
      goToPodcast: goToPodcast,
      deletePodcast(podcast){
        deletePodcast(podcast, () => {
          const index = this.podcasts.findIndex((el) => el.id === podcast.id)
          this.podcasts.splice(index, 1)
        })
      },
    }
  }
</script>
<style lang="scss">
  p{
    margin-bottom: 5px;
  }
  .row-podcast{
    position: relative;
  }
  .podcast_list__image{
    height: 50px;
  }
  .podcast_list__link-to-podcast{
    cursor: pointer;
  }
  .podcast-content{
    cursor: pointer;
  }
  .podcast-title{
    margin-top: -4px;
    margin-bottom: 2px;
  }
  .podcast-description{
    color: #ACABAB !important;
    font-size: 12px;
  }
  .podcast-controls{
    margin-top: -7px;
    i{
      font-weight: bold;
      font-size: 14px !important;
    }
    @media (max-width: 576px) {
      position: absolute;
      right: 14px;
      top: -2px;
    }
  }


</style>
