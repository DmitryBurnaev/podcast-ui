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
                    <!-- TODO: implement `episodes_count` in list of podcasts -->
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
          <el-form-item label="Link to the source">
            <el-input v-model="createEpisodeForm.url" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">Create</el-button>
        </span>
      </el-dialog>

    </div>

</template>

<script>
export default {
  name: "Home",
  data: () => ({
    loading: true,
    podcasts: [],
    dialogFormVisible: false,
    // todo: add url validation
    createEpisodeForm: {
      url: ""
    }
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
    }
  }
}
</script>
<style lang="scss">

.content-home .card-body{
  cursor: pointer;
}
</style>