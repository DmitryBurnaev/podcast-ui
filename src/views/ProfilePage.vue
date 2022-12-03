<template>
  <div class="content" v-if="!loading">
    <div class="row">
      <div class="col-md-4">
        <div class="card card-podcast card-user">
          <div class="image card-background" >
            <img src="../assets/img/podcast-background.jpg" alt="avatar">
          </div>
          <div class="card-body">
            <div class="author">
              <img class="avatar avatar-episode border-gray" src="../assets/img/python-avatar.jpg" alt="...">
              <p class="title">{{ profile.email }}</p>
            </div>
            <div class="text-center mt-3">
            </div>
          </div>
          <div class="card-footer">
            <hr>
            <div class="button-container">
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card card-podcast card-user">
          <div class="card-header card-header-squash">
            <h5 class="card-title" >Profile</h5>
          </div>
          <div class="card-body">
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "ProfilePage",
  data: () => ({
    loading: true,
    profile: null,
    profileForm: {
      title: '',
      author: '',
      description: ''
    },
  }),
  async created() {
    await this.fetchData()
    this.profileForm.email = this.profile.email;
    this.loading = false;
    this.$store.commit('setBreadcrumbs', [
      {
        "title": "Home",
        "route": {name: "Home"}
      },
      {
        "title": "My Profile",
        "route": null
      },
    ])
  },
  destroyed() {
  },
  watch: {
    // changing route calls fetching data
    $route: 'fetchData'
  },
  methods: {
    async fetchData() {
      this.profile = await this.$store.dispatch('getMe'); // TODO: use already fetched profile
    },
  }
}
</script>

<style lang="scss">
.card-background{
  img{
    filter: blur(1.5px);
  }
}
</style>