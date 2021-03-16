<template>
  <div id="mainLayout">
    <Sidebar v-model="sidebarIsOpen"/>
    <div class="main-panel">
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
  data: () => ({
    loading: true,
    podcasts: [],
    sidebarIsOpen: true
  }),
  async mounted(){
    console.log("MainLayout mounted")
    // FIXME: why does this layout load for every page?
    //        To prevent access to protected API we have to check that user is logged-in or not...

    // if (this.$store.getters.accessToken){
      await this.$store.dispatch('getPodcasts')
      this.podcasts = this.$store.getters.podcasts
    // }
    this.loading = false
  }
}
</script>
