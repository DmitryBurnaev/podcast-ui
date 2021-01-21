<template>
  <div id="mainLayout">
    <Navbar @navClick="sidebarIsOpen = !sidebarIsOpen"/>
    <Sidebar v-model="sidebarIsOpen" :podcasts="podcasts"/>
    <main class="app-content" :class="{full: !sidebarIsOpen}">
      <router-view/>
    </main>
  </div>
</template>

<script>
import Sidebar from "@/components/app/Sidebar";
import Navbar from "@/components/app/Navbar";
export default {
  name: "MainLayout",
  components: {Sidebar, Navbar},
  data: () => ({
    loading: true,
    podcasts: [],
    sidebarIsOpen: true
  }),
  async mounted(){
    console.log("MainLayout mounted")
    // FIXME: why does this layout load for every page?
    //        To prevent access to protected API we have to check that user is logged-in or not...

    if (this.$store.getters.accessToken){
      await this.$store.dispatch('getPodcasts')
      this.podcasts = this.$store.getters.podcasts
    }
    this.loading = false
  }
}
</script>
