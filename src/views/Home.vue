<template>
    <div class="content content-home">
      <div class="row">
        <div
            class="col-lg-3 col-md-6 col-sm-6"
            v-for="podcast in podcasts" :key="podcast.id"

        >
            <div class="card card-stats">
            <router-link
                tag="div"
                class="card-body"
                :to="{name: 'podcastDetails', params: {'id': podcast.id}}"
            >
              <div class="row">
                <div class="col-5 col-md-4 podcast-cover-container">
                    <img v-if="podcast.image_url" :src="podcast.image_url" :alt="podcast.name">
                    <img v-else src="../assets/img/cover-default.jpeg" :alt="podcast.name">
                </div>
                <div class="col-7 col-md-8">
                  <div class="numbers">
                    <p class="card-category">{{podcast.name}}</p>
                    <p class="card-title">{{podcast.episodes_count || 0}}</p>
                  </div>
                </div>
              </div>

            </router-link>

            <div class="card-footer ">
              <hr>
              <div class="stats cursor-pointer" @click="openCreateEpisodeDialog(podcast)">
                <i class="nc-icon nc-tap-01"></i>
                Add new episode
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-dialog title="Creating new episode" :visible.sync="dialogFormVisible">
        <el-form :model="createEpisodeForm">
<!--          <el-form-item>-->
<!--            <el-input v-model="createEpisodeForm.url" :disabled="createEpisodeForm.inProgress" autocomplete="off" placeholder="Link to the source"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="success" plain @click="createEpisode" :disabled="createEpisodeForm.inProgress">Create</el-button>-->
<!--          </el-form-item>-->
          <div>
            <el-input placeholder="Link to the source" v-model="createEpisodeForm.link" :disabled="createEpisodeForm.inProgress">
              <el-button slot="append" icon="el-icon-edit" type="success" @click="createEpisode"></el-button>
            </el-input>
          </div>
        </el-form>
        <div class="d-flex justify-content-center" v-if="createEpisodeForm.inProgress">
          <img class="preload ml-1" src="../assets/img/down-arrow.gif" alt=""/>
        </div>
        <div v-if="createdEpisode">
          <div class="row row-episode">
            <div class="col-md-1 col-1 episode-content" @click="goToEpisode(createdEpisode)">
              <div class="episode-image">
                <img :src="createdEpisode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
              </div>
            </div>
            <div class="col-md-9 col-9 episode-title episode-content" @click="goToEpisode(createdEpisode)">
              {{ createdEpisode.title }}
              <br/>
              <span
                  :class="{
                    'text-success': (createdEpisode.status === 'published'),
                    'text-danger': (createdEpisode.status === 'error'),
                    'text-info': (['new', 'downloading'].includes(createdEpisode.status)),
                    'text-gray': (createdEpisode.status === 'archived')
                  }">
                <small>{{humanStatus(createdEpisode.status)}}</small>
              </span>
            </div>
            <div class="col-md-2 col-2 text-right createdEpisode-controls">
              <img class="preload mr-1 mt-2" v-if="createdEpisode.status === 'downloading'" src="../assets/img/down-arrow.gif" alt=""/>
            </div>
          </div>
        </div>

<!--        <span slot="footer" class="dialog-footer">-->
<!--          <el-button @click="dialogFormVisible = false">Cancel</el-button>-->
<!--          <el-button type="primary" @click="dialogFormVisible = false">Create</el-button>-->
<!--        </span>-->
      </el-dialog>

    </div>

</template>

<script>
import {goToEpisode, humanStatus} from "@/utils/podcast";
import axios from "axios";

export default {
  name: "Home",
  data: () => ({
    loading: true,
    podcasts: [],
    dialogFormVisible: false,
    // todo: add url validation
    createEpisodeForm: {
      link: "",
      inProgress: false,
      podcastID: null,
    },
    createdEpisode: null
  }),
  async mounted(){
    console.log("MainLayout mounted")
    if (this.$store.getters.accessToken) {
      await this.$store.dispatch('getPodcasts')
      this.podcasts = this.$store.getters.podcasts
      this.loading = false
    }
  },
  methods:{
    openCreateEpisodeDialog(podcast){
      console.log("Creating episode for ", podcast)
      this.dialogFormVisible = true
      this.createEpisodeForm.podcastID = podcast.id
    },
    async createEpisode(){
      this.createEpisodeForm.inProgress = true
      const response = await axios.post(`podcasts/${this.createEpisodeForm.podcastID}/episodes/`, this.createEpisodeForm)
      if (response){
        this.createdEpisode = response.data
      }
      this.createEpisodeForm.inProgress = false
    },
    goToEpisode: goToEpisode,
    humanStatus: humanStatus,
  }
}
</script>
<style lang="scss">

.content-home .card-body{
  cursor: pointer;
}
.preload{
  width: 50px;
  margin-top: 30px;
}
</style>