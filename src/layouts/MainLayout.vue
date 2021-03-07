<template>
  <div id="mainLayout">
    <Sidebar/>
    <div class="preloader text-center" v-if="loading">
      <i class="icon el-icon-loading"></i>
    </div>
    <div class="main-panel" v-else>
      <Navbar @navClick="sidebarIsOpen = !sidebarIsOpen"/>
      <router-view/>
    </div>
    <Footer />
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default {
  name: "MainLayout",
  components: {Sidebar, Navbar, Footer},
  computed: {
    loading () {
      return this.$store.getters.globalLoading
    }
  },
  async mounted(){
    console.log("MainLayout mounted")
    // FIXME: why does this layout load for every page?
    //        To prevent access to protected API we have to check that user is logged-in or not...

    // if (this.$store.getters.accessToken){
    //   await this.$store.dispatch('getPodcasts')
    //   this.podcasts = this.$store.getters.podcasts
    // }
    // this.loading = false
  }
}
</script>
<style lang="scss">
  .preloader{
    padding-top: 75px;
    .icon{
      font-size: 50px;
    }
  }
</style>