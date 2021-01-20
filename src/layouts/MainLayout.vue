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
    podcasts: [{"id":1, "name": "test2"}],
    sidebarIsOpen: true
  }),
  async mounted(){
    console.log("MainLayout mounted")
    // console.log("getPodcasts here (from main layout)", this.$router.history.current.name)
    // await this.$store.dispatch('getPodcasts')
    this.podcasts = this.$store.getters.podcasts
    this.loading = false

    // if (! this.$router.history.name.startsWith('auth')){
    // }
  }
}
</script>
